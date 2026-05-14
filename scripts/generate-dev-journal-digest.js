#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * dev_journal digest 生成 (Weekly / Monthly)
 *
 * Supabase dev_journal の指定期間エントリを集約して Obsidian 用の
 * 振り返り MD を生成する。 記事化候補も同時に抽出。
 *
 * 実行:
 *   # 今週分
 *   node --env-file=.env.local scripts/generate-dev-journal-digest.js --weekly
 *
 *   # 先週分
 *   node --env-file=.env.local scripts/generate-dev-journal-digest.js --weekly --offset=-1
 *
 *   # 今月分
 *   node --env-file=.env.local scripts/generate-dev-journal-digest.js --monthly
 *
 *   # 期間指定
 *   node --env-file=.env.local scripts/generate-dev-journal-digest.js --since=2026-05-01 --until=2026-05-14
 *
 * 出力:
 *   ~/.claude/projects/reports/digest/YYYY-Www-weekly.md
 *   ~/.claude/projects/reports/digest/YYYY-MM-monthly.md
 *   ~/.claude/projects/reports/digest/custom-YYYY-MM-DD_YYYY-MM-DD.md
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const OUTPUT_BASE = path.join(os.homedir(), '.claude/projects/reports/digest');
const DEV_JOURNAL_BASE = path.join(os.homedir(), '.claude/projects/reports/dev-journal');

function parseArgs(argv) {
  const out = { weekly: false, monthly: false, offset: 0, since: null, until: null };
  for (const a of argv) {
    if (a === '--weekly') out.weekly = true;
    else if (a === '--monthly') out.monthly = true;
    else if (a.startsWith('--offset=')) out.offset = Number(a.split('=')[1]);
    else if (a.startsWith('--since=')) out.since = a.split('=')[1];
    else if (a.startsWith('--until=')) out.until = a.split('=')[1];
    else if (a === '--help' || a === '-h') {
      console.log(`usage:
  node --env-file=.env.local scripts/generate-dev-journal-digest.js [options]

  --weekly             今週分の digest を生成
  --monthly            今月分の digest を生成
  --offset=N           週/月をずらす (例: --weekly --offset=-1 で先週分)
  --since=YYYY-MM-DD   期間 since
  --until=YYYY-MM-DD   期間 until
`);
      process.exit(0);
    }
  }
  return out;
}

function fmtDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function isoWeek(date) {
  // ISO 8601 week number
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / (7 * 24 * 3600 * 1000));
}

function determinePeriod(args) {
  if (args.since && args.until) {
    return {
      kind: 'custom',
      since: args.since,
      until: args.until,
      label: `${args.since} 〜 ${args.until}`,
      outputName: `custom-${args.since}_${args.until}.md`,
    };
  }
  if (args.weekly) {
    const today = new Date();
    today.setDate(today.getDate() + args.offset * 7);
    const day = today.getDay(); // 0=Sun, 1=Mon, ...
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7)); // ISO 月曜起点
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    const week = isoWeek(monday);
    const yyyy = monday.getFullYear();
    return {
      kind: 'weekly',
      since: fmtDate(monday),
      until: fmtDate(sunday),
      label: `${yyyy}-W${String(week).padStart(2, '0')} (${fmtDate(monday)} 〜 ${fmtDate(sunday)})`,
      outputName: `${yyyy}-W${String(week).padStart(2, '0')}-weekly.md`,
    };
  }
  if (args.monthly) {
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + args.offset, 1);
    const firstDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
    const yyyy = firstDay.getFullYear();
    const mm = String(firstDay.getMonth() + 1).padStart(2, '0');
    return {
      kind: 'monthly',
      since: fmtDate(firstDay),
      until: fmtDate(lastDay),
      label: `${yyyy}-${mm} (${fmtDate(firstDay)} 〜 ${fmtDate(lastDay)})`,
      outputName: `${yyyy}-${mm}-monthly.md`,
    };
  }
  // デフォルト = 今週
  return determinePeriod({ ...args, weekly: true });
}

function slugify(s) {
  if (!s) return 'untitled';
  return String(s)
    .replace(/[\s\/\\<>:"|?*]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
    .toLowerCase();
}

function entryFilename(entry) {
  const date = new Date(entry.occurred_at || entry.created_at);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const idSuffix = String(entry.id).slice(0, 8);
  const slug = slugify(entry.title);
  return `${mm}-${dd}-${entry.type}-${slug}-${idSuffix}`;
}

function tryParseJson(s) {
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
}

function hasContentAngle(entry) {
  const parsed = tryParseJson(entry.body);
  return parsed && parsed.content_angle && parsed.content_angle.length > 10 && parsed.content_angle !== 'なし' && !parsed.content_angle.startsWith('なし');
}

function formatEntryLink(entry) {
  const date = new Date(entry.occurred_at || entry.created_at);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  // Obsidian [[link]] 形式 (拡張子なし)
  return `[[${entryFilename(entry)}|${entry.title}]]`;
}

function formatEntryWithContext(entry) {
  const parsed = tryParseJson(entry.body);
  const link = formatEntryLink(entry);
  let line = `- ${link}`;
  if (parsed?.context) {
    const ctx = parsed.context.length > 80 ? parsed.context.slice(0, 80) + '...' : parsed.context;
    line += `\n  - ${ctx}`;
  }
  return line;
}

function formatArticleCandidate(entry) {
  const parsed = tryParseJson(entry.body);
  const link = formatEntryLink(entry);
  let lines = [`- ${link}`];
  if (parsed?.content_angle) {
    lines.push(`  - 切り口: ${parsed.content_angle}`);
  }
  if (parsed?.topics && parsed.topics.length > 0) {
    lines.push(`  - topics: ${parsed.topics.map((t) => `#${t}`).join(' ')}`);
  }
  return lines.join('\n');
}

async function fetchEntries(supabase, since, until) {
  let query = supabase
    .from('dev_journal')
    .select('*')
    .gte('occurred_at', since)
    .lte('occurred_at', `${until}T23:59:59`)
    .order('occurred_at', { ascending: true });

  const all = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await query.range(from, from + pageSize - 1);
    if (error) throw new Error(`fetch error: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'unknown';
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

function countTopics(entries) {
  const counts = {};
  for (const e of entries) {
    const topics = e.topics || [];
    for (const t of topics) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function generateMarkdown(entries, period) {
  const byType = groupBy(entries, 'type');
  const topicCounts = countTopics(entries);
  const articleCandidates = entries.filter(
    (e) => e.type === 'learning' && e.severity === 'high' && !e.used_in_article && hasContentAngle(e)
  );

  const highDecisions = (byType.decision || []).filter((e) => e.severity === 'high');
  const highLearnings = (byType.learning || []).filter((e) => e.severity === 'high');
  const ideas = byType.idea || [];
  const highTasks = (byType.task_generated || []).filter((e) =>
    ['high', 'medium'].includes(e.severity)
  );

  const projectCounts = groupBy(entries, 'project');
  const projectStats = Object.entries(projectCounts)
    .map(([p, es]) => [p, es.length])
    .sort((a, b) => b[1] - a[1]);

  return `---
period: ${period.label}
kind: ${period.kind}
since: ${period.since}
until: ${period.until}
generated_at: ${new Date().toISOString()}
total_entries: ${entries.length}
---

# Dev Journal Digest: ${period.label}

## サマリ

| 項目 | 件数 |
|---|---|
| 総エントリ数 | ${entries.length} |
| 重要決定 (decision/high) | ${highDecisions.length} |
| 重要学び (learning/high) | ${highLearnings.length} |
| 新規アイデア (idea/全 severity) | ${ideas.length} |
| 生まれたタスク (task_generated/high+medium) | ${highTasks.length} |
| 記事化候補 (= 未記事化の高学び) | ${articleCandidates.length} |

## 主な決定 (severity=high)

${highDecisions.length > 0 ? highDecisions.map(formatEntryWithContext).join('\n') : '*なし*'}

## 主な学び (severity=high)

${highLearnings.length > 0 ? highLearnings.map(formatEntryWithContext).join('\n') : '*なし*'}

## 新規アイデア

${ideas.length > 0 ? ideas.map(formatEntryWithContext).join('\n') : '*なし*'}

## 生まれたタスク (severity=high+medium)

${highTasks.length > 0 ? highTasks.map(formatEntryLink).map((l) => `- ${l}`).join('\n') : '*なし*'}

## 頻出トピック (上位 15)

${topicCounts.slice(0, 15).map(([t, c]) => `- #${t} (${c} 件)`).join('\n')}

## プロジェクト別エントリ数

${projectStats.map(([p, c]) => `- ${p}: ${c} 件`).join('\n')}

## 記事化候補 (used_in_article=NULL & content_angle あり)

masatoman.net や Lab レポートに記事化する候補。 article-source-selector skill で絞り込んで article-writer skill で本文生成する流れの入口。

${articleCandidates.length > 0 ? articleCandidates.map(formatArticleCandidate).join('\n') : '*この期間の記事化候補はなし*'}

---

*このファイルは \`scripts/generate-dev-journal-digest.js\` で自動生成されました。 個別エントリの全文を見るには ${path.relative(path.join(os.homedir(), '.claude/projects'), DEV_JOURNAL_BASE)}/ 以下を参照。*
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const period = determinePeriod(args);

  console.log('---- dev_journal digest 生成 ----');
  console.log(`期間: ${period.label}`);
  console.log(`種別: ${period.kind}`);
  console.log('');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 未設定');
    process.exit(1);
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const entries = await fetchEntries(supabase, period.since, period.until);
  console.log(`対象エントリ: ${entries.length} 件`);

  if (entries.length === 0) {
    console.log('期間内にエントリなし。 終了。');
    return;
  }

  const md = generateMarkdown(entries, period);
  const outputPath = path.join(OUTPUT_BASE, period.outputName);

  fs.mkdirSync(OUTPUT_BASE, { recursive: true });
  fs.writeFileSync(outputPath, md, 'utf8');

  console.log('');
  console.log(`✅ 生成: ${outputPath}`);
  console.log(`サイズ: ${(md.length / 1024).toFixed(1)} KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
