#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * 工務店レビュー収集スクリプト
 *
 * Google Places API (New) v1 を使い、東京都の住宅地ワード 8 区で
 * 「工務店」をテキスト検索 → 各 place の詳細 (reviews 含む) を取得 →
 * ★3 以下のレビューを lowRatingReviews として抽出し
 * koumuten_reviews.json に書き出す。
 *
 * 実行:
 *   node --env-file=.env.local scripts/koumuten-review-collector.js
 *   node --env-file=.env.local scripts/koumuten-review-collector.js --limit 5 --areas 世田谷区,杉並区
 *   node --env-file=.env.local scripts/koumuten-review-collector.js --dry-run
 *
 * 必須環境変数:
 *   GOOGLE_PLACES_API_KEY   Google Cloud Console で発行した Places API (New) のキー
 *
 * 概算コスト (フル実行 8 区 × 20 件):
 *   Text Search    8 calls    ≈ $0.26
 *   Place Details  160 calls  ≈ $3.20
 *   合計           ≈ $3.50 / 回
 *   ※ --limit で件数を絞ると安く済む。 開発時は --limit 3 推奨
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const API_BASE = 'https://places.googleapis.com/v1';
const OUTPUT_PATH = path.resolve(process.cwd(), 'koumuten_reviews.json');
const CACHE_DIR = path.resolve(process.cwd(), '.cache/koumuten-reviews');

// 東京都 23 区のうち、 住宅地が多く工務店が比較的多いと想定される 8 区
const DEFAULT_AREAS = [
  '世田谷区',
  '練馬区',
  '大田区',
  '杉並区',
  '足立区',
  '板橋区',
  '江戸川区',
  '葛飾区',
];

const SEARCH_KEYWORD = '工務店';
const LOW_RATING_THRESHOLD = 3; // ★3 以下 (=1〜3) を「低評価」として抽出

// --- CLI args -----------------------------------------------------------

function parseArgs(argv) {
  const out = { limit: 20, areas: DEFAULT_AREAS, dryRun: false, noCache: false, submit: false, noJson: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--limit') {
      out.limit = Number(argv[++i]) || out.limit;
    } else if (a === '--areas') {
      out.areas = String(argv[++i] || '').split(',').map((s) => s.trim()).filter(Boolean);
    } else if (a === '--dry-run') {
      out.dryRun = true;
    } else if (a === '--no-cache') {
      out.noCache = true;
    } else if (a === '--submit') {
      out.submit = true;
    } else if (a === '--no-json') {
      out.noJson = true;
    } else if (a === '--help' || a === '-h') {
      console.log(`使い方:
  node --env-file=.env.local scripts/koumuten-review-collector.js [options]

  --limit N            各エリアで取得する最大件数 (default 20)
  --areas A,B,C        対象エリアをカンマ区切りで指定 (default ${DEFAULT_AREAS.join(',')})
  --dry-run            API は叩かず、 リクエスト計画だけ表示
  --no-cache           ローカルキャッシュを無視して必ず API を叩く
  --submit             取得結果を Supabase koumuten_reviews_raw テーブルに INSERT
                       (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が必要)
  --no-json            JSON 出力をスキップ (--submit と併用想定)
`);
      process.exit(0);
    }
  }
  return out;
}

// --- Cache --------------------------------------------------------------

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function cacheKey(kind, id) {
  return path.join(CACHE_DIR, `${kind}__${encodeURIComponent(id)}.json`);
}

function readCache(kind, id) {
  const p = cacheKey(kind, id);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function writeCache(kind, id, data) {
  fs.writeFileSync(cacheKey(kind, id), JSON.stringify(data, null, 2), 'utf8');
}

// --- API calls ----------------------------------------------------------

async function searchText({ apiKey, query, pageSize }) {
  const res = await fetch(`${API_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.rating',
        'places.userRatingCount',
        'places.types',
        'places.primaryType',
      ].join(','),
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: 'ja',
      regionCode: 'JP',
      pageSize,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`searchText ${res.status}: ${text}`);
  }
  return res.json();
}

async function getPlaceDetails({ apiKey, placeId }) {
  const res = await fetch(`${API_BASE}/places/${encodeURIComponent(placeId)}?languageCode=ja&regionCode=JP`, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': [
        'id',
        'displayName',
        'formattedAddress',
        'rating',
        'userRatingCount',
        'websiteUri',
        'internationalPhoneNumber',
        'googleMapsUri',
        'reviews',
      ].join(','),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`placeDetails ${placeId} ${res.status}: ${text}`);
  }
  return res.json();
}

// --- helpers ------------------------------------------------------------

function extractLowRatingReviews(reviews) {
  if (!Array.isArray(reviews)) return [];
  return reviews
    .filter((r) => typeof r.rating === 'number' && r.rating <= LOW_RATING_THRESHOLD)
    .map((r) => ({
      rating: r.rating,
      text: r.text?.text ?? null,
      originalText: r.originalText?.text ?? null,
      authorName: r.authorAttribution?.displayName ?? null,
      publishTime: r.publishTime ?? null,
      relativePublishTimeDescription: r.relativePublishTimeDescription ?? null,
    }));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// --- Supabase submit ----------------------------------------------------

async function submitToSupabase(results) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が .env.local に未設定');
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const runId = crypto.randomUUID();
  const rows = [];

  for (const r of results) {
    for (const rev of r.allReviews) {
      if (!rev.publishTime) continue; // UNIQUE 制約上、 publishTime 必須
      rows.push({
        place_id: r.placeId,
        place_name: r.name,
        place_area: r.area,
        place_rating: r.rating,
        place_user_rating_count: r.userRatingCount,
        place_address: r.address,
        place_google_maps_uri: r.googleMapsUri,
        place_website_uri: r.websiteUri,
        review_rating: rev.rating,
        review_text: rev.text,
        review_original_text: rev.originalText,
        review_author_name: rev.authorName,
        review_publish_time: rev.publishTime,
        review_relative_time: rev.relativeTime,
        collected_run_id: runId,
      });
    }
  }

  console.log('');
  console.log(`---- Supabase 投入 (collected_run_id=${runId}) ----`);
  console.log(`対象 行数: ${rows.length}`);

  if (rows.length === 0) {
    console.log('  -> 0 行のため何もしない');
    return { runId, inserted: 0, skipped: 0 };
  }

  const { count: beforeCount } = await supabase
    .from('koumuten_reviews_raw')
    .select('*', { count: 'exact', head: true });

  const { error } = await supabase
    .from('koumuten_reviews_raw')
    .upsert(rows, { onConflict: 'place_id,review_publish_time', ignoreDuplicates: true });
  if (error) {
    throw new Error(`Supabase upsert エラー: ${error.message}`);
  }

  const { count: afterCount } = await supabase
    .from('koumuten_reviews_raw')
    .select('*', { count: 'exact', head: true });

  const inserted = (afterCount ?? 0) - (beforeCount ?? 0);
  const skipped = rows.length - inserted;
  console.log(`  -> 新規 INSERT: ${inserted} 行 / スキップ (重複): ${skipped} 行`);
  console.log(`  -> テーブル全体: ${beforeCount} → ${afterCount} 行`);

  return { runId, inserted, skipped };
}

// --- main ---------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey && !args.dryRun) {
    console.error('GOOGLE_PLACES_API_KEY が設定されていません。 .env.local に追記してください。');
    process.exit(1);
  }

  ensureCacheDir();

  console.log('---- 工務店レビュー収集 ----');
  console.log(`対象エリア: ${args.areas.join(', ')}`);
  console.log(`各エリア取得上限: ${args.limit}`);
  console.log(`ドライラン: ${args.dryRun ? 'YES' : 'no'}`);
  console.log(`キャッシュ: ${args.noCache ? 'OFF' : 'ON'} (${CACHE_DIR})`);
  console.log('');

  const allPlaces = [];
  const seenIds = new Set();

  for (const area of args.areas) {
    const query = `${SEARCH_KEYWORD} ${area}`;
    console.log(`[search] ${query}`);

    if (args.dryRun) {
      console.log(`  -> (dry-run) skipped`);
      continue;
    }

    const cacheId = `search__${query}__limit${args.limit}`;
    let searchResult = !args.noCache && readCache('search', cacheId);

    if (!searchResult) {
      try {
        searchResult = await searchText({ apiKey, query, pageSize: args.limit });
        writeCache('search', cacheId, searchResult);
        await sleep(200); // 軽い rate limit よけ
      } catch (e) {
        console.error(`  -> 検索エラー: ${e.message}`);
        continue;
      }
    } else {
      console.log(`  -> cache hit`);
    }

    const places = searchResult.places ?? [];
    console.log(`  -> ${places.length} 件 hit`);

    for (const p of places) {
      if (seenIds.has(p.id)) continue;
      seenIds.add(p.id);
      allPlaces.push({ area, base: p });
    }
  }

  console.log('');
  console.log(`ユニーク place 数: ${allPlaces.length}`);
  console.log('---- 詳細 (reviews) 取得 ----');

  const results = [];
  let lowCountTotal = 0;
  let withReviewsCount = 0;

  for (let i = 0; i < allPlaces.length; i++) {
    const { area, base } = allPlaces[i];
    const placeId = base.id;
    const label = base.displayName?.text ?? placeId;
    console.log(`[${i + 1}/${allPlaces.length}] (${area}) ${label}`);

    if (args.dryRun) {
      console.log('  -> (dry-run) skipped');
      continue;
    }

    let details = !args.noCache && readCache('details', placeId);
    if (!details) {
      try {
        details = await getPlaceDetails({ apiKey, placeId });
        writeCache('details', placeId, details);
        await sleep(200);
      } catch (e) {
        console.error(`  -> 詳細取得エラー: ${e.message}`);
        continue;
      }
    } else {
      console.log('  -> cache hit');
    }

    const reviews = details.reviews ?? [];
    const lowRatingReviews = extractLowRatingReviews(reviews);
    if (reviews.length > 0) withReviewsCount++;
    lowCountTotal += lowRatingReviews.length;

    results.push({
      area,
      placeId,
      name: details.displayName?.text ?? null,
      address: details.formattedAddress ?? null,
      rating: details.rating ?? null,
      userRatingCount: details.userRatingCount ?? null,
      websiteUri: details.websiteUri ?? null,
      phone: details.internationalPhoneNumber ?? null,
      googleMapsUri: details.googleMapsUri ?? null,
      totalReviewCount: reviews.length,
      lowRatingReviewCount: lowRatingReviews.length,
      lowRatingReviews,
      allReviews: reviews.map((r) => ({
        rating: r.rating,
        text: r.text?.text ?? null,
        originalText: r.originalText?.text ?? null,
        authorName: r.authorAttribution?.displayName ?? null,
        publishTime: r.publishTime ?? null,
        relativeTime: r.relativePublishTimeDescription ?? null,
      })),
    });

    console.log(`  -> reviews ${reviews.length} (うち低評価 ${lowRatingReviews.length})`);
  }

  if (args.dryRun) {
    console.log('');
    console.log('(dry-run のため JSON は書き出しません)');
    return;
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    areas: args.areas,
    limitPerArea: args.limit,
    totalPlaces: results.length,
    placesWithReviews: withReviewsCount,
    totalLowRatingReviews: lowCountTotal,
  };

  if (!args.noJson) {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ summary, results }, null, 2), 'utf8');
  }

  console.log('');
  console.log('---- 完了 ----');
  console.log(`place 総数: ${results.length}`);
  console.log(`レビューありの place: ${withReviewsCount}`);
  console.log(`低評価レビュー (★${LOW_RATING_THRESHOLD} 以下) 合計: ${lowCountTotal}`);
  if (!args.noJson) console.log(`JSON 出力: ${OUTPUT_PATH}`);

  if (args.submit) {
    const submitResult = await submitToSupabase(results);
    summary.submitResult = submitResult;
    if (!args.noJson) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ summary, results }, null, 2), 'utf8');
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
