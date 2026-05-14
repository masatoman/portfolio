#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * koumuten_reviews_raw (Layer 1) → if_jobs (Layer 2 入口) ブリッジ
 *
 * 1. raw テーブルから未処理レビュー (processed_in_cluster_job_id IS NULL) を SELECT
 * 2. 各レビュー本文を論点単位で分解 (ルールベース)
 * 3. 「店舗名 / エリア / ★ / 論点」 を構造化テキストとして組み立て
 * 4. if_jobs に raw_input_text 付きで INSERT
 *    (profile_id='komuten', role='施主 (顧客側)', status='pending')
 * 5. raw 側に processed_in_cluster_job_id を書き戻し
 * 6. 次に実行すべき SKILL コマンドを表示
 *
 * 実行:
 *   node --env-file=.env.local scripts/prepare-koumuten-cluster-job.js
 *   node --env-file=.env.local scripts/prepare-koumuten-cluster-job.js --low-only
 *   node --env-file=.env.local scripts/prepare-koumuten-cluster-job.js --dry-run
 *
 * オプション:
 *   --low-only   ★3 以下のレビューのみ対象 (default: 全件)
 *   --limit N    対象レビュー上限 (default: 1000)
 *   --dry-run    if_jobs INSERT / raw UPDATE をスキップ、 整形結果だけ表示
 */

const PROFILE_ID = 'komuten';
const ROLE = '施主 (顧客側)';
const MIN_POINT_LENGTH = 20; // 論点として有効な最小文字数
const MAX_POINTS_PER_REVIEW = 8; // 1 レビューから抽出する論点上限

function parseArgs(argv) {
  const out = { lowOnly: false, limit: 1000, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--low-only') out.lowOnly = true;
    else if (a === '--limit') out.limit = Number(argv[++i]) || out.limit;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--help' || a === '-h') {
      console.log(`使い方:
  node --env-file=.env.local scripts/prepare-koumuten-cluster-job.js [options]

  --low-only   ★3 以下のレビューのみ対象 (default: 全件)
  --limit N    対象レビュー上限 (default 1000)
  --dry-run    if_jobs INSERT / raw UPDATE をスキップ
`);
      process.exit(0);
    }
  }
  return out;
}

/**
 * レビュー本文を論点単位で分解する (ルールベース)
 * - 改行と 「。!?」 で文単位に分割
 * - MIN_POINT_LENGTH 文字未満は除外
 * - 重複は排除
 * - 最大 MAX_POINTS_PER_REVIEW 個まで
 */
function splitIntoPoints(text) {
  if (!text) return [];
  const raw = text
    .replace(/\r/g, '')
    .split(/[\n。！？!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= MIN_POINT_LENGTH);
  const uniq = [...new Set(raw)];
  return uniq.slice(0, MAX_POINTS_PER_REVIEW);
}

function formatRawInputText(reviews, lowCount) {
  const header = [
    '# 工務店 Google マップ レビューから抽出した施主の声',
    '',
    `総レビュー数: ${reviews.length} 件 / うち低評価 (★3以下): ${lowCount} 件`,
    `地域: 東京 21 区市 (新宿区・文京区・豊島区・中野区・府中市・調布市・国立市・国分寺市・小金井市・三鷹市・武蔵野市・立川市・八王子市 + 既取得 8 区)`,
    '',
    '以下は実際の施主が Google マップに投稿したレビューから論点単位で抽出した不満・体験の断片。 同じ論点を共有する複数の声を見つけてクラスタリングし、 業界共通の痛点を浮き彫りにする。',
    '',
    '---',
    '',
  ].join('\n');

  const body = [];
  let idx = 1;
  for (const r of reviews) {
    const points = splitIntoPoints(r.review_text);
    if (points.length === 0) continue;
    for (const p of points) {
      const ratingStr = '★'.repeat(r.review_rating ?? 0) + '☆'.repeat(5 - (r.review_rating ?? 0));
      body.push(
        `## ${idx}. 論点 (${ratingStr})`,
        `店舗: ${r.place_name ?? '不明'} (${r.place_area ?? '不明'})`,
        `投稿時期: ${r.review_relative_time ?? r.review_publish_time ?? '不明'}`,
        `論点: ${p}`,
        ''
      );
      idx++;
    }
  }
  return header + body.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が未設定');
    process.exit(1);
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log('---- koumuten_reviews_raw → if_jobs ブリッジ ----');
  console.log(`オプション: low-only=${args.lowOnly}, limit=${args.limit}, dry-run=${args.dryRun}`);

  // 未処理レビュー取得
  let query = supabase
    .from('koumuten_reviews_raw')
    .select('id, place_name, place_area, place_rating, review_rating, review_text, review_publish_time, review_relative_time')
    .is('processed_in_cluster_job_id', null)
    .not('review_text', 'is', null)
    .order('review_rating', { ascending: true })
    .limit(args.limit);

  if (args.lowOnly) {
    query = query.lte('review_rating', 3);
  }

  const { data: reviews, error: selErr } = await query;
  if (selErr) {
    console.error(`SELECT エラー: ${selErr.message}`);
    process.exit(1);
  }

  if (!reviews || reviews.length === 0) {
    console.log('対象レビューが 0 件。 既に全て処理済みの可能性。');
    process.exit(0);
  }

  const lowCount = reviews.filter((r) => (r.review_rating ?? 5) <= 3).length;
  console.log(`対象レビュー: ${reviews.length} 件 (うち低評価 ${lowCount} 件)`);

  // 論点抽出 + raw_input_text 整形
  const rawInputText = formatRawInputText(reviews, lowCount);
  const totalPoints = (rawInputText.match(/^## \d+\. 論点/gm) || []).length;
  console.log(`論点抽出: ${totalPoints} 個`);
  console.log(`raw_input_text サイズ: ${(rawInputText.length / 1024).toFixed(1)} KB`);

  if (args.dryRun) {
    console.log('');
    console.log('---- dry-run / 整形プレビュー (先頭 1500 文字) ----');
    console.log(rawInputText.slice(0, 1500));
    console.log('...');
    return;
  }

  // if_jobs INSERT
  const samplingTarget = Math.min(Math.max(reviews.length, 20), 500);
  const { data: jobData, error: insErr } = await supabase
    .from('if_jobs')
    .insert({
      profile_id: PROFILE_ID,
      role: ROLE,
      sampling_target: samplingTarget,
      extra_notes: `koumuten_reviews_raw 由来。 ${reviews.length} レビュー / ${totalPoints} 論点 / 21 地域 / 低評価 ${lowCount} 件。 source_type='review' で登録すること。`,
      raw_input_text: rawInputText,
      status: 'pending',
    })
    .select('id')
    .single();

  if (insErr) {
    console.error(`if_jobs INSERT エラー: ${insErr.message}`);
    process.exit(1);
  }

  const jobId = jobData.id;
  console.log('');
  console.log(`✅ if_jobs INSERT 成功: ${jobId}`);

  // raw 側に job_id を書き戻し
  const reviewIds = reviews.map((r) => r.id);
  const { error: updErr } = await supabase
    .from('koumuten_reviews_raw')
    .update({ processed_in_cluster_job_id: jobId })
    .in('id', reviewIds);

  if (updErr) {
    console.error(`raw UPDATE エラー: ${updErr.message}`);
    console.error('注意: if_jobs は INSERT 済だが raw 側のマーキングに失敗。 重複処理リスクあり');
    process.exit(1);
  }

  console.log(`✅ raw 側に processed_in_cluster_job_id 書き戻し: ${reviewIds.length} 行`);
  console.log('');
  console.log('---- 次のアクション ----');
  console.log('Claude Code セッションで次の SKILL を invoke してください:');
  console.log('');
  console.log('  /issue-finder process');
  console.log('');
  console.log('SKILL は if_jobs.status=pending を読み、 raw_input_text 付きジョブを検出 → web_search をスキップしてクラスタリング → if_issues に INSERT します。');
  console.log(`完了後、 /lab/tools/issue-finder ページで profile_id=${PROFILE_ID}, role="${ROLE}" のクラスタが見えるはず。`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
