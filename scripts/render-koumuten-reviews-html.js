#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * 工務店レビュー収集レポート HTML レンダラ (v2 / Supabase 読み出し版)
 *
 * Supabase から koumuten_reviews_raw (Layer 1) と if_issues (Layer 2 / クラスタ) を
 * 取得し、 1 枚の自己完結 HTML として書き出す。
 *
 * セクション:
 *   // 00 / 使い方 (誰が・どこで・どう使うか)
 *   // 01 / サマリ (件数 / エリア別分布)
 *   // 02 / 動くべき度ランキング (Layer 2 クラスタ)
 *   // 03 / エリア別ダッシュボード
 *   // 04 / 低評価レビュー全件 (★3 以下)
 *   // 05 / 全店舗一覧 (折りたたみ)
 *   // 06 / 全レビュー (折りたたみ)
 *   // 07 / データ取得方法 / 再現手順
 *
 * 実行:
 *   node --env-file=.env.local scripts/render-koumuten-reviews-html.js
 *
 * 出力:
 *   docs/koumuten-reviews-YYYY-MM-DD.html (実行日)
 */

const fs = require('node:fs');
const path = require('node:path');

const PROFILE_ID = 'komuten';
const ROLE = '施主 (顧客側)';
const SOURCE_TYPE = 'review';
const today = new Date().toISOString().slice(0, 10);
const OUTPUT = path.resolve(process.cwd(), `docs/koumuten-reviews-${today}.html`);

// 友人軸 / ユーザー営業圏 / 既取得の区分け (memory より)
const AREA_GROUPS = {
  '友人軸': ['新宿区', '文京区', '豊島区', '中野区'],
  'ユーザー営業圏 (たましん圏)': ['府中市', '調布市', '国立市', '国分寺市', '小金井市', '三鷹市', '武蔵野市', '立川市', '八王子市'],
  '既取得 8 区 (業界俯瞰)': ['世田谷区', '練馬区', '大田区', '杉並区', '足立区', '板橋区', '江戸川区', '葛飾区'],
};

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(s) {
  return escapeHtml(s).replace(/\n/g, '<br>');
}

function getAreaGroup(area) {
  for (const [group, areas] of Object.entries(AREA_GROUPS)) {
    if (areas.includes(area)) return group;
  }
  return 'その他';
}

async function fetchData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 未設定');
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // Layer 1: raw レビュー全件
  const { data: reviews, error: e1 } = await supabase
    .from('koumuten_reviews_raw')
    .select('*')
    .order('place_area')
    .order('place_id')
    .order('review_publish_time', { ascending: false });
  if (e1) throw new Error(`reviews 取得失敗: ${e1.message}`);

  // Layer 2: クラスタ
  const { data: clusters, error: e2 } = await supabase
    .from('if_issues')
    .select('*')
    .eq('profile_id', PROFILE_ID)
    .eq('role', ROLE)
    .eq('source_type', SOURCE_TYPE)
    .order('issue_score', { ascending: false });
  if (e2) throw new Error(`clusters 取得失敗: ${e2.message}`);

  return { reviews, clusters };
}

function renderHtml({ reviews, clusters }) {
  // 集計
  const totalReviews = reviews.length;
  const totalLow = reviews.filter((r) => (r.review_rating ?? 5) <= 3).length;
  const uniquePlaces = new Set(reviews.map((r) => r.place_id)).size;
  const uniqueAreas = new Set(reviews.map((r) => r.place_area)).size;
  const avgPlaceRating = (() => {
    const seen = new Set();
    let sum = 0;
    let count = 0;
    for (const r of reviews) {
      if (seen.has(r.place_id)) continue;
      seen.add(r.place_id);
      if (r.place_rating != null) {
        sum += Number(r.place_rating);
        count++;
      }
    }
    return count > 0 ? sum / count : 0;
  })();

  // エリア別集計
  const areaStats = {};
  for (const r of reviews) {
    const a = r.place_area || '不明';
    if (!areaStats[a]) areaStats[a] = { places: new Set(), reviews: 0, low: 0, ratingSum: 0, placeSeen: new Set() };
    areaStats[a].places.add(r.place_id);
    areaStats[a].reviews++;
    if ((r.review_rating ?? 5) <= 3) areaStats[a].low++;
    if (!areaStats[a].placeSeen.has(r.place_id) && r.place_rating != null) {
      areaStats[a].placeSeen.add(r.place_id);
      areaStats[a].ratingSum += Number(r.place_rating);
    }
  }
  const areaTable = Object.entries(areaStats)
    .map(([area, s]) => ({
      area,
      group: getAreaGroup(area),
      places: s.places.size,
      reviews: s.reviews,
      low: s.low,
      avgRating: s.placeSeen.size > 0 ? s.ratingSum / s.placeSeen.size : 0,
    }))
    .sort((a, b) => b.low - a.low);

  // 低評価レビューだけ抽出 (フラット)
  const lowReviews = reviews
    .filter((r) => (r.review_rating ?? 5) <= 3 && r.review_text)
    .sort((a, b) => (a.review_rating ?? 5) - (b.review_rating ?? 5));

  // 店舗単位
  const placeMap = {};
  for (const r of reviews) {
    if (!placeMap[r.place_id]) {
      placeMap[r.place_id] = {
        placeId: r.place_id,
        name: r.place_name,
        area: r.place_area,
        rating: r.place_rating,
        userRatingCount: r.place_user_rating_count,
        address: r.place_address,
        googleMapsUri: r.place_google_maps_uri,
        websiteUri: r.place_website_uri,
        reviews: [],
        lowCount: 0,
      };
    }
    placeMap[r.place_id].reviews.push(r);
    if ((r.review_rating ?? 5) <= 3) placeMap[r.place_id].lowCount++;
  }
  const places = Object.values(placeMap).sort((a, b) => b.lowCount - a.lowCount || (b.rating ?? 0) - (a.rating ?? 0));

  // ---------- HTML ----------
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>工務店レビュー収集 + 不満カテゴリ分析レポート / ${today}</title>
<style>
:root {
  --bg: #faf7f2;
  --fg: #1f1c18;
  --muted: #6b6359;
  --accent: #b85c3a;
  --warn: #c34a1f;
  --good: #2d6a4f;
  --card: #ffffff;
  --border: #e4ddd1;
  --code-bg: #f4ede0;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", "Yu Gothic", system-ui, sans-serif;
  background: var(--bg);
  color: var(--fg);
  line-height: 1.75;
  font-size: 15px;
}
.container { max-width: 1000px; margin: 0 auto; padding: 32px 20px 100px; }

header { border-bottom: 2px solid var(--fg); padding-bottom: 16px; margin-bottom: 32px; }
header h1 { font-size: 26px; margin: 0 0 6px; font-weight: 700; line-height: 1.4; }
header .meta { color: var(--muted); font-size: 13px; }

h2 { font-size: 20px; margin: 44px 0 14px; padding-bottom: 6px; border-bottom: 1px solid var(--border); }
h3 { font-size: 16px; margin: 24px 0 10px; }
h4 { font-size: 14px; margin: 18px 0 8px; color: var(--accent); }

code { font-family: "SF Mono", Menlo, monospace; font-size: 13px; background: var(--code-bg); padding: 1px 6px; border-radius: 3px; }
pre { background: var(--code-bg); padding: 14px 16px; border-radius: 4px; font-size: 13px; overflow-x: auto; font-family: "SF Mono", Menlo, monospace; line-height: 1.6; }

.toc { background: var(--card); border: 1px solid var(--border); padding: 14px 20px; border-radius: 6px; margin-bottom: 24px; }
.toc strong { font-size: 13px; }
.toc ol { margin: 6px 0 0; padding-left: 22px; }
.toc a { color: var(--accent); text-decoration: none; }
.toc a:hover { text-decoration: underline; }

/* サマリ */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}
.stat { background: var(--card); border: 1px solid var(--border); padding: 14px 16px; border-radius: 6px; }
.stat .label { color: var(--muted); font-size: 12px; margin-bottom: 4px; }
.stat .value { font-size: 24px; font-weight: 700; }
.stat .value.warn { color: var(--warn); }
.stat .value.good { color: var(--good); }

/* 使い方カード */
.usage-card {
  background: var(--card);
  border-left: 4px solid var(--accent);
  border-top: 1px solid var(--border);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  border-radius: 4px;
  padding: 14px 20px;
  margin-bottom: 12px;
}
.usage-card .who { font-size: 11px; letter-spacing: .1em; color: var(--accent); font-weight: 700; }
.usage-card .what { font-weight: 700; margin: 4px 0 8px; font-size: 16px; }
.usage-card .how { font-size: 13px; color: var(--fg); margin-bottom: 8px; }
.usage-card .points { background: #fdfbf6; padding: 10px 14px; border-radius: 4px; font-size: 13px; }
.usage-card .points ol { margin: 4px 0; padding-left: 20px; }
.usage-card .ref { font-size: 12px; color: var(--muted); margin-top: 6px; }

/* クラスタカード */
.cluster {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 18px 22px;
  margin-bottom: 14px;
}
.cluster .rank {
  display: inline-block;
  background: var(--fg);
  color: var(--bg);
  padding: 4px 10px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  margin-right: 8px;
}
.cluster.top1 .rank { background: var(--warn); }
.cluster .title { font-weight: 700; font-size: 17px; margin: 0; display: inline; }
.cluster .scores {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin: 12px 0;
}
.cluster .score {
  background: var(--code-bg);
  padding: 8px 12px;
  border-radius: 4px;
  text-align: center;
}
.cluster .score .label { font-size: 10px; letter-spacing: .05em; color: var(--muted); }
.cluster .score .value { font-size: 18px; font-weight: 700; }
.cluster .score.warn .value { color: var(--warn); }
.cluster .score.good .value { color: var(--good); }
.cluster .pain { background: #fff8ea; padding: 10px 14px; border-radius: 4px; font-size: 14px; margin-bottom: 10px; border-left: 3px solid #d4a72c; }
.cluster .episode { background: #fdf0eb; padding: 10px 14px; border-radius: 4px; font-size: 13px; font-style: italic; color: #5a2e1f; margin-bottom: 10px; }
.cluster .reason { font-size: 12px; color: var(--muted); margin-top: 6px; }
.cluster details { margin-top: 10px; }
.cluster details summary { cursor: pointer; font-size: 12px; color: var(--accent); }
.cluster .quotes { margin-top: 8px; }
.cluster .quote { background: #fdfbf6; padding: 8px 12px; border-radius: 4px; font-size: 13px; margin-bottom: 6px; border-left: 2px solid var(--border); }
.cluster .tag { display: inline-block; font-size: 10px; padding: 2px 6px; background: #efe5d2; color: #5a4a30; border-radius: 10px; margin-right: 4px; }

/* テーブル */
table { width: 100%; border-collapse: collapse; background: var(--card); border: 1px solid var(--border); font-size: 13px; }
th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; }
th { background: var(--code-bg); font-weight: 600; }
tr.has-low { background: #fff5f0; }
td.num { text-align: right; }
td.area { color: var(--muted); white-space: nowrap; }
td a { color: var(--accent); text-decoration: none; }
td a:hover { text-decoration: underline; }

/* 低評価レビューカード */
.review-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-left: 4px solid var(--warn);
  border-radius: 6px;
  padding: 18px 20px;
  margin-bottom: 14px;
}
.review-card .head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.review-card .place-name { font-weight: 700; font-size: 16px; }
.review-card .area-tag { display: inline-block; font-size: 11px; background: #efe5d2; padding: 2px 8px; border-radius: 10px; margin-right: 8px; color: #5a4a30; }
.review-card .group-tag { display: inline-block; font-size: 10px; padding: 2px 6px; border-radius: 10px; margin-right: 4px; font-weight: 700; }
.review-card .group-tag.friend { background: #eaf2f8; color: #2c4a73; }
.review-card .group-tag.tama { background: #f5ecf5; color: #5a3e60; }
.review-card .group-tag.other { background: var(--code-bg); color: var(--muted); }
.review-card .place-meta { color: var(--muted); font-size: 12px; }
.review-card .stars { color: var(--warn); font-size: 16px; letter-spacing: 1px; }
.review-card .text { white-space: pre-wrap; word-break: break-word; background: #fdfbf6; padding: 12px 14px; border-radius: 4px; font-size: 14px; }
.review-card .links { margin-top: 10px; font-size: 12px; }
.review-card .links a { color: var(--accent); text-decoration: none; margin-right: 12px; }

/* バーチャート */
.bars { background: var(--card); border: 1px solid var(--border); padding: 14px 16px; border-radius: 6px; }
.bar-row { display: grid; grid-template-columns: 130px 1fr 50px; align-items: center; gap: 10px; margin-bottom: 4px; }
.bar-row .name { font-size: 12px; }
.bar-row .name .group { font-size: 10px; color: var(--muted); display: block; }
.bar-row .bar { height: 14px; background: #f0e9dd; border-radius: 3px; overflow: hidden; }
.bar-row .bar > div { height: 100%; background: var(--warn); }
.bar-row .count { font-size: 12px; text-align: right; color: var(--muted); }

details { margin-bottom: 16px; }
details summary { cursor: pointer; padding: 6px 0; color: var(--muted); font-size: 13px; user-select: none; }
details[open] summary { color: var(--fg); font-weight: 600; }

.note { background: #fff8ea; border-left: 3px solid #d4a72c; padding: 10px 14px; margin: 16px 0; font-size: 13px; color: #5a4a1f; border-radius: 0 4px 4px 0; }
</style>
</head>
<body>
<div class="container">

<header>
  <h1>工務店レビュー収集 + 不満カテゴリ分析レポート</h1>
  <div class="meta">
    生成日: ${today} ／ 21 地域 (東京 13 区 + 多摩 9 市 のうち実測 ${uniqueAreas} 地域) ／
    取得店舗 ${uniquePlaces} ／ レビュー総数 ${totalReviews} (低評価 ${totalLow})
  </div>
</header>

<div class="toc">
  <strong>目次</strong>
  <ol>
    <li><a href="#usage">// 00 / 使い方 (誰が・どう使うか)</a></li>
    <li><a href="#summary">// 01 / サマリ</a></li>
    <li><a href="#clusters">// 02 / 動くべき度ランキング (7 クラスタ)</a></li>
    <li><a href="#areas">// 03 / エリア別ダッシュボード</a></li>
    <li><a href="#low">// 04 / 低評価レビュー全 ${totalLow} 件</a></li>
    <li><a href="#places">// 05 / 全店舗一覧 (${uniquePlaces} 店舗)</a></li>
    <li><a href="#all-reviews">// 06 / 全レビュー (${totalReviews} 件)</a></li>
    <li><a href="#howto">// 07 / データ取得方法 / 再現手順</a></li>
  </ol>
</div>

<!-- // 00 / 使い方 ===================================================== -->
<h2 id="usage">// 00 / 使い方 (誰が・どう使うか)</h2>

<p>このレポートは「<strong>主顧客 (IT 弱者の中小工務店オーナー / 現場監督) との対話の根拠データ</strong>」として設計されています。 用途別に 5 つのシーンを想定:</p>

<div class="usage-card">
  <div class="who">UC-A / ペライチ訴求の裏付け</div>
  <div class="what">中間業者・工務店オーナー向けペライチ 2 版に「実際の声」を引用</div>
  <div class="how">「アフター放置」 や「連絡途絶」 クラスタのエピソードを「他の工務店さんでこういう不満が出ています」 として訴求文に組み込む。 引用時は店舗名を伏せて「都内のある工務店」 表記推奨。</div>
  <div class="points">
    <strong>使うセクション:</strong>
    <ol>
      <li>// 04 低評価レビュー全件 (★3 以下) から引用候補を選ぶ</li>
      <li>// 02 クラスタの painSummary を訴求文の骨格に</li>
    </ol>
  </div>
</div>

<div class="usage-card">
  <div class="who">UC-B / 友人ヒアリング (現場監督) 仮説リスト</div>
  <div class="what">6 月予定の友人ヒアリングで「これを語らせたい」 論点を事前に並べる</div>
  <div class="how">「アフター放置」 「連絡途絶」 「個人情報・ハラスメント」 の各クラスタを「友人会社近隣の新宿区で実際に出ている不満」 として見せ、 「あなたの会社はどうしてる?」 と問う。 友人軸 4 区 (新宿/文京/豊島/中野) のデータが特に効く。</div>
  <div class="points">
    <strong>使うセクション:</strong>
    <ol>
      <li>// 04 低評価レビューを「新宿区」 でフィルタして見せる</li>
      <li>// 03 エリア別ダッシュボードで「あなたの会社の周りはこう」 と地理的に位置付ける</li>
      <li>// 02 クラスタの「動くべき度」 を見せて「ここに困ってる人多いんだよ」</li>
    </ol>
  </div>
</div>

<div class="usage-card">
  <div class="who">UC-C / SaaS 機能・価格戦略の根拠</div>
  <div class="what">4 価格パターンのうち、 どの機能パッケージから着手すべきかの根拠</div>
  <div class="how">// 02 のランキングで <strong>issue_score × solvability_score の積</strong>が高いものから着手。 「連絡途絶」 クラスタは solvability=75 で実装容易 + clusterSize=7 = CRM 簡易版が最速で MVP に。 「アフター放置」 クラスタは clusterSize=12 / issue_score=70 (即動けティア) で深い痛点 + solvability=55 = アフター管理 SaaS が中長期の本命。 ただし IT 弱者ターゲットの場合「入力ハードル」 が真の障壁で、 LINE 連携や紙併用設計が必要かは要検証 (北原氏 Q3-b)。</div>
  <div class="points">
    <strong>判断ルール:</strong>
    <ol>
      <li>solvability 70 以上 = 短期 MVP 候補</li>
      <li>clusterSize 10 以上 = 市場規模十分</li>
      <li>emotion 80 以上 = WTP 高い可能性</li>
      <li>3 つすべて満たす = 1 番目の SaaS にする</li>
    </ol>
  </div>
</div>

<div class="usage-card">
  <div class="who">UC-D / 受託提案スライド素材</div>
  <div class="what">B2B 受託営業時の「あなたの業界の不満トップ N」 スライド</div>
  <div class="how">// 02 のクラスタを TOP 3 + ロングテール、 // 03 のエリア別マップで「都心 vs 多摩 の傾向比較」 を入れる。 提案先がたましん圏なら多摩データを厚く、 都心系なら 13 区フルデータを使う。</div>
  <div class="points">
    <strong>スライド構成案 (5 枚):</strong>
    <ol>
      <li>表紙 (取得日・サンプル数 543 件)</li>
      <li>不満カテゴリ TOP 3 (動くべき度ランキング)</li>
      <li>エリア別頻度マップ</li>
      <li>具体エピソード 3 件 (匿名化)</li>
      <li>提案 (ペライチ 2 版)</li>
    </ol>
  </div>
</div>

<div class="usage-card">
  <div class="who">UC-E / たましん経由営業 (北原氏面談含む)</div>
  <div class="what">2026-05-22 北原氏 (東京創業ステーション) 面談で「市場分析の根拠」 として提示</div>
  <div class="how">// 02 のクラスタを A4 1 枚にダイジェスト。 multi-axis 表示 (issue_score × solvability_score の散布図) で「どの機能から作るべきか」 を一目で説明。 たましん圏 (立川/八王子/多摩) のデータが面談相手に響く根拠になる。</div>
  <div class="points">
    <strong>面談前の準備:</strong>
    <ol>
      <li>このレポートを印刷 or タブレットで表示</li>
      <li>// 02 のランキング → SaaS 4 パターンとの対応表を別途用意 (UC-C 用)</li>
      <li>「補助金活用余地は?」 と聞ける素材として subsidy_tags も持参</li>
    </ol>
  </div>
</div>

<div class="note">
  <strong>使い方の原則</strong>: このレポートは「データを見せる」 ためでなく「<strong>判断の根拠を共有する</strong>」 ためのもの。 そのまま PDF として商談相手に渡しても良いが、 1 シーンに対して 1 セクションを抜き出して使う方がインパクト出ます。
</div>

<!-- // 01 / サマリ ==================================================== -->
<h2 id="summary">// 01 / サマリ</h2>

<div class="summary-grid">
  <div class="stat"><div class="label">取得地域</div><div class="value">${uniqueAreas}</div></div>
  <div class="stat"><div class="label">取得店舗数</div><div class="value">${uniquePlaces}</div></div>
  <div class="stat"><div class="label">レビュー総数</div><div class="value">${totalReviews}</div></div>
  <div class="stat"><div class="label">平均評価</div><div class="value good">★${avgPlaceRating.toFixed(2)}</div></div>
  <div class="stat"><div class="label">低評価 (★3以下)</div><div class="value warn">${totalLow}</div></div>
  <div class="stat"><div class="label">抽出クラスタ</div><div class="value">${clusters.length}</div></div>
</div>

<h3>エリア別 低評価分布</h3>
<div class="bars">
${areaTable
  .map((row) => {
    const maxLow = Math.max(...areaTable.map((r) => r.low), 1);
    const pct = (row.low / maxLow) * 100;
    return `  <div class="bar-row"><div class="name">${escapeHtml(row.area)} <span class="group">${escapeHtml(row.group)}</span></div><div class="bar"><div style="width:${pct}%"></div></div><div class="count">${row.low}</div></div>`;
  })
  .join('\n')}
</div>

<!-- // 02 / 動くべき度ランキング ====================================== -->
<h2 id="clusters">// 02 / 動くべき度ランキング (${clusters.length} クラスタ)</h2>

<p>${totalReviews} 件の生レビューから抽出した不満カテゴリを「動くべき度」 (issueScore) でランキング。 score の意味:</p>

<ul>
  <li><strong>issue_score</strong>: 全体スコア。 clusterSize / samplingTotal × 1.5 + impactBonus + emotionAdjust</li>
  <li><strong>emotion_score</strong>: 怒り・絶望の強度 (0-100)</li>
  <li><strong>solvability_score</strong>: 既存技術 + SME 予算で解決可能か (0-100、 高いほど SaaS で解決しやすい)</li>
  <li><strong>cluster_size</strong>: このクラスタに含まれる引用数</li>
</ul>

${clusters
  .map((c, i) => {
    const isTop = i === 0;
    const tags = [
      ...(c.subsidy_tags || []),
      ...(c.industry_tags || []),
    ];
    const relatedQuotes = Array.isArray(c.related_quotes) ? c.related_quotes : [];
    return `<div class="cluster${isTop ? ' top1' : ''}">
  <div><span class="rank">RANK ${i + 1}</span><span class="title">${escapeHtml(c.title)}</span></div>
  <div class="scores">
    <div class="score warn"><div class="label">issue_score</div><div class="value">${c.issue_score}</div></div>
    <div class="score"><div class="label">emotion</div><div class="value">${c.emotion_score}</div></div>
    <div class="score good"><div class="label">solvability</div><div class="value">${c.solvability_score}</div></div>
    <div class="score"><div class="label">cluster_size</div><div class="value">${c.cluster_size ?? '-'}</div></div>
  </div>
  <div class="pain"><strong>痛点要約:</strong> ${escapeHtml(c.pain_summary)}</div>
  ${c.episode ? `<div class="episode"><strong>代表エピソード:</strong><br>${nl2br(c.episode)}</div>` : ''}
  <div class="reason">${escapeHtml(c.score_reason || '')}</div>
  <div style="margin-top:10px;">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join(' ')}</div>
  ${relatedQuotes.length > 0
    ? `<details>
    <summary>関連引用 ${relatedQuotes.length} 件を見る</summary>
    <div class="quotes">
${relatedQuotes.map((q) => `      <div class="quote">${escapeHtml(q.excerpt || '')}</div>`).join('\n')}
    </div>
  </details>`
    : ''}
</div>`;
  })
  .join('\n')}

<!-- // 03 / エリア別 ================================================== -->
<h2 id="areas">// 03 / エリア別ダッシュボード</h2>

<table>
  <thead><tr><th>エリア</th><th>軸</th><th class="num">店舗</th><th class="num">レビュー</th><th class="num">低評価</th><th class="num">平均★</th></tr></thead>
  <tbody>
${areaTable
  .map(
    (row) => `    <tr${row.low > 0 ? ' class="has-low"' : ''}>
      <td><strong>${escapeHtml(row.area)}</strong></td>
      <td class="area">${escapeHtml(row.group)}</td>
      <td class="num">${row.places}</td>
      <td class="num">${row.reviews}</td>
      <td class="num"><strong style="color:var(--warn);">${row.low}</strong></td>
      <td class="num">★${row.avgRating.toFixed(2)}</td>
    </tr>`
  )
  .join('\n')}
  </tbody>
</table>

<!-- // 04 / 低評価レビュー ============================================ -->
<h2 id="low">// 04 / 低評価レビュー全 ${totalLow} 件</h2>

<p style="color:var(--muted);font-size:13px;">★1〜3 のレビューを軸別タグ付きで表示。 ペライチ引用・友人ヒアリング素材として利用。</p>

${lowReviews
  .map((r) => {
    const group = getAreaGroup(r.place_area);
    const groupClass = group === '友人軸' ? 'friend' : group === 'ユーザー営業圏 (たましん圏)' ? 'tama' : 'other';
    return `<div class="review-card">
  <div class="head">
    <div>
      <span class="group-tag ${groupClass}">${escapeHtml(group)}</span>
      <span class="area-tag">${escapeHtml(r.place_area || '')}</span>
      <span class="place-name">${escapeHtml(r.place_name || '')}</span>
    </div>
    <div class="place-meta">店舗★${r.place_rating ?? '?'} (n=${r.place_user_rating_count ?? '?'})</div>
  </div>
  <div style="font-size:13px;color:var(--muted);margin-bottom:8px;">
    <span class="stars">${'★'.repeat(r.review_rating ?? 0)}${'☆'.repeat(5 - (r.review_rating ?? 0))}</span>
    <span style="margin-left:10px;">${escapeHtml(r.review_relative_time || '')}</span>
    ${r.review_author_name ? `<span style="margin-left:10px;">投稿: ${escapeHtml(r.review_author_name)}</span>` : ''}
  </div>
  <div class="text">${nl2br(r.review_text || '(本文なし)')}</div>
  <div class="links">
    ${r.place_google_maps_uri ? `<a href="${escapeHtml(r.place_google_maps_uri)}" target="_blank" rel="noopener">Googleマップで店舗を見る →</a>` : ''}
    ${r.place_website_uri ? `<a href="${escapeHtml(r.place_website_uri)}" target="_blank" rel="noopener">公式サイト →</a>` : ''}
  </div>
</div>`;
  })
  .join('\n')}

<!-- // 05 / 全店舗一覧 ================================================ -->
<h2 id="places">// 05 / 全店舗一覧 (${places.length} 店舗、 折りたたみ)</h2>
<details>
  <summary>クリックして展開</summary>
  <table style="margin-top:10px;">
    <thead><tr><th>店舗</th><th>エリア</th><th>軸</th><th class="num">店舗★</th><th class="num">n</th><th class="num">レビュー</th><th class="num">低評価</th><th>リンク</th></tr></thead>
    <tbody>
${places
  .map(
    (p) => `      <tr${p.lowCount > 0 ? ' class="has-low"' : ''}>
        <td>${escapeHtml(p.name || '')}</td>
        <td class="area">${escapeHtml(p.area || '')}</td>
        <td class="area">${escapeHtml(getAreaGroup(p.area))}</td>
        <td class="num">★${p.rating ?? '?'}</td>
        <td class="num">${p.userRatingCount ?? 0}</td>
        <td class="num">${p.reviews.length}</td>
        <td class="num">${p.lowCount > 0 ? `<strong style="color:var(--warn);">${p.lowCount}</strong>` : '0'}</td>
        <td>
          ${p.googleMapsUri ? `<a href="${escapeHtml(p.googleMapsUri)}" target="_blank" rel="noopener">マップ</a>` : ''}
          ${p.websiteUri ? ` / <a href="${escapeHtml(p.websiteUri)}" target="_blank" rel="noopener">HP</a>` : ''}
        </td>
      </tr>`
  )
  .join('\n')}
    </tbody>
  </table>
</details>

<!-- // 06 / 全レビュー ================================================ -->
<h2 id="all-reviews">// 06 / 全レビュー (${totalReviews} 件、 折りたたみ)</h2>
<p style="color:var(--muted);font-size:13px;">良いレビューにも「何を評価されたか」 のヒントが含まれる。 不満ポイントの裏返しが価値提案になる。</p>

<details>
  <summary>クリックして展開 (店舗別)</summary>
  <div style="margin-top:14px;">
${places
  .map(
    (p) => `    <div style="margin-bottom:24px;border:1px solid var(--border);background:var(--card);border-radius:6px;padding:14px 18px;">
      <div style="font-weight:700;margin-bottom:4px;">
        <span class="area-tag">${escapeHtml(p.area || '')}</span>
        ${escapeHtml(p.name || '')}
        <span style="color:var(--muted);font-weight:400;font-size:12px;margin-left:8px;">★${p.rating ?? '?'} (n=${p.userRatingCount ?? 0})</span>
      </div>
      <div style="color:var(--muted);font-size:12px;margin-bottom:10px;">${escapeHtml(p.address || '')}</div>
${p.reviews
  .map(
    (rev) => `      <div style="border-top:1px dashed var(--border);padding:8px 0;">
        <div style="font-size:12px;color:var(--muted);">${'★'.repeat(rev.review_rating ?? 0)}${'☆'.repeat(5 - (rev.review_rating ?? 0))} ${rev.review_author_name ? '/ ' + escapeHtml(rev.review_author_name) : ''} ${rev.review_relative_time ? '/ ' + escapeHtml(rev.review_relative_time) : ''}</div>
        <div style="white-space:pre-wrap;word-break:break-word;font-size:13px;margin-top:4px;">${nl2br(rev.review_text || '(本文なし)')}</div>
      </div>`
  )
  .join('\n')}
    </div>`
  )
  .join('\n')}
  </div>
</details>

<!-- // 07 / 再現手順 ================================================== -->
<h2 id="howto">// 07 / データ取得方法 / 再現手順</h2>

<h3>データソース</h3>
<ul>
  <li><strong>取得元</strong>: Google Places API (New) - <code>places:searchText</code> + <code>places/{id}</code></li>
  <li><strong>検索クエリ</strong>: <code>工務店 &lt;エリア名&gt;</code></li>
  <li><strong>取得項目</strong>: 店舗情報 + 各店舗の最新レビュー (最大 5 件)</li>
  <li><strong>保存先</strong>: Supabase KOBO プロジェクト (<code>amtwwscvhwkfdrqimgqm</code>)
    <ul>
      <li>Layer 1: <code>koumuten_reviews_raw</code> (個別レビュー 1 行 = 1 レコード)</li>
      <li>Layer 2: <code>if_issues</code> (クラスタ、 profile_id=komuten / role=施主 (顧客側))</li>
    </ul>
  </li>
</ul>

<h3>① レビュー追加取得 (Layer 1)</h3>
<pre># 友人軸 4 区
node --env-file=.env.local scripts/koumuten-review-collector.js \\
  --limit 20 \\
  --areas 新宿区,文京区,豊島区,中野区 \\
  --submit

# 多摩 9 市
node --env-file=.env.local scripts/koumuten-review-collector.js \\
  --limit 20 \\
  --areas 府中市,調布市,国立市,国分寺市,小金井市,三鷹市,武蔵野市,立川市,八王子市 \\
  --submit

# 個別エリアをスポット追加
node --env-file=.env.local scripts/koumuten-review-collector.js \\
  --limit 20 \\
  --areas 港区 \\
  --submit</pre>

<h3>② クラスタリング (Layer 2) を再実行</h3>
<pre># 未処理レビューを if_jobs にブリッジ
node --env-file=.env.local scripts/prepare-koumuten-cluster-job.js

# Claude Code セッションで:
/issue-finder process

# 完了後、 このレポートを再生成
node --env-file=.env.local scripts/render-koumuten-reviews-html.js</pre>

<h3>③ コスト目安</h3>
<table style="margin-top:8px;">
  <thead><tr><th>処理</th><th>API</th><th class="num">単価</th><th class="num">フル取得時</th></tr></thead>
  <tbody>
    <tr><td>Text Search</td><td>Google Places (New)</td><td class="num">≈ $0.032 / call</td><td class="num">$0.42 / 13 地域</td></tr>
    <tr><td>Place Details</td><td>Google Places (New)</td><td class="num">≈ $0.020 / call</td><td class="num">$5.20 / 260 店舗</td></tr>
    <tr><td>クラスタリング</td><td>Claude Code MAX 内蔵</td><td class="num">無料</td><td class="num">$0</td></tr>
    <tr><td>Supabase 保存</td><td>KOBO プロジェクト相乗り</td><td class="num">無料</td><td class="num">$0</td></tr>
  </tbody>
</table>

<h3>④ ファイルマップ</h3>
<table style="margin-top:8px;">
  <thead><tr><th>ファイル</th><th>役割</th></tr></thead>
  <tbody>
    <tr><td><code>scripts/koumuten-review-collector.js</code></td><td>取得 + raw INSERT</td></tr>
    <tr><td><code>scripts/prepare-koumuten-cluster-job.js</code></td><td>論点分解 + if_jobs ブリッジ</td></tr>
    <tr><td><code>scripts/render-koumuten-reviews-html.js</code></td><td>このレポートを生成</td></tr>
    <tr><td><code>supabase/migrations/20260513_koumuten_reviews_raw.sql</code></td><td>raw テーブル定義</td></tr>
    <tr><td><code>docs/design-brief-2026-05-13-koumuten-reviews-integration.html</code></td><td>設計ブリーフ (背景・原則)</td></tr>
  </tbody>
</table>

<div class="note" style="margin-top:24px;">
  <strong>このレポートを更新するタイミング</strong>: 新規エリアを取得した直後、 クラスタリングを再実行した直後、 友人ヒアリングや北原氏面談の前日 (最新版を持参するため)。
</div>

</div>
</body>
</html>
`;
}

async function main() {
  console.log('---- レポート HTML 生成 ----');
  const { reviews, clusters } = await fetchData();
  console.log(`Layer 1 (reviews): ${reviews.length} 件`);
  console.log(`Layer 2 (clusters): ${clusters.length} 個`);

  const html = renderHtml({ reviews, clusters });

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, html, 'utf8');

  console.log('');
  console.log(`生成しました: ${OUTPUT}`);
  console.log(`サイズ: ${(html.length / 1024).toFixed(1)} KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
