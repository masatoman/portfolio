#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * dev_journal (Supabase) → Obsidian Vault (~/.claude/projects/reports/dev-journal/) 同期
 *
 * セッションで蓄積された learning / decision / idea / task_generated を
 * Obsidian で全文検索・グラフビュー可能にする。
 *
 * 実行:
 *   node --env-file=.env.local scripts/sync-dev-journal-to-obsidian.js
 *   node --env-file=.env.local scripts/sync-dev-journal-to-obsidian.js --since=2026-05-01
 *   node --env-file=.env.local scripts/sync-dev-journal-to-obsidian.js --dry-run
 *
 * オプション:
 *   --since=YYYY-MM-DD    指定日以降のみ同期 (デフォルト: 全件)
 *   --dry-run             ファイル生成せず、 件数だけ表示
 *   --force               既存ファイル上書き (デフォルト: skip)
 *
 * 出力ファイル名:
 *   YYYY-MM/MM-DD-{type}-{slug}-{id8}.md
 *   例: 2026-05/05-14-decision-obsidian-vault-import-a1b2c3d4.md
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const OUTPUT_BASE = path.join(os.homedir(), '.claude/projects/reports/dev-journal');

function parseArgs(argv) {
  const out = { since: null, dryRun: false, force: false };
  for (const a of argv) {
    if (a.startsWith('--since=')) out.since = a.split('=')[1];
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--force') out.force = true;
    else if (a === '--help' || a === '-h') {
      console.log(`usage:
  node --env-file=.env.local scripts/sync-dev-journal-to-obsidian.js [options]

  --since=YYYY-MM-DD    指定日以降のみ
  --dry-run             件数だけ表示
  --force               既存ファイル上書き
`);
      process.exit(0);
    }
  }
  return out;
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

function entryToPath(entry) {
  const date = new Date(entry.occurred_at || entry.created_at);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const idSuffix = String(entry.id).slice(0, 8);
  const slug = slugify(entry.title);
  const dir = path.join(OUTPUT_BASE, `${yyyy}-${mm}`);
  const filename = `${mm}-${dd}-${entry.type}-${slug}-${idSuffix}.md`;
  return { dir, filename };
}

function tryParseJson(s) {
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function escapeYamlString(s) {
  if (s == null) return '';
  const str = String(s).replace(/"/g, '\\"');
  return `"${str}"`;
}

function entryToMarkdown(entry) {
  const parsedBody = tryParseJson(entry.body);
  const topics = entry.topics || (parsedBody?.topics) || [];

  // frontmatter
  const fm = [
    '---',
    `id: ${entry.id}`,
    `date: ${entry.occurred_at || entry.created_at}`,
    `type: ${entry.type}`,
    `severity: ${entry.severity || 'medium'}`,
    `project: ${entry.project || 'unknown'}`,
    `source: ${entry.source || 'unknown'}`,
    `title: ${escapeYamlString(entry.title)}`,
    `topics: [${topics.map((t) => `"${t}"`).join(', ')}]`,
    entry.used_in_article ? `used_in_article: ${escapeYamlString(entry.used_in_article)}` : null,
  ].filter(Boolean).join('\n') + '\n---';

  // body
  let body = '\n\n';
  body += `# ${entry.title}\n\n`;

  if (parsedBody && (parsedBody.context || parsedBody.detail || parsedBody.content_angle)) {
    if (parsedBody.context) {
      body += `## Context\n\n${parsedBody.context}\n\n`;
    }
    if (parsedBody.detail) {
      body += `## Detail\n\n${parsedBody.detail}\n\n`;
    }
    if (parsedBody.content_angle) {
      body += `## Content angle (記事化候補)\n\n${parsedBody.content_angle}\n\n`;
    }
  } else if (entry.body) {
    // JSON でない場合は素のまま
    body += `${entry.body}\n\n`;
  }

  if (topics.length > 0) {
    body += `## Topics\n\n${topics.map((t) => `#${t}`).join(' ')}\n\n`;
  }

  body += `---\n\n*${entry.type} / ${entry.severity || 'medium'} severity / ${entry.project || 'unknown'} / source: ${entry.source || 'unknown'}*\n`;

  return fm + body;
}

async function fetchEntries(supabase, since) {
  let query = supabase.from('dev_journal').select('*').order('occurred_at', { ascending: true });
  if (since) {
    query = query.gte('occurred_at', since);
  }

  // ページング (Supabase は 1 リクエスト 1000 行上限)
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

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 未設定');
    process.exit(1);
  }

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log('---- dev_journal → Obsidian 同期 ----');
  console.log(`出力先: ${OUTPUT_BASE}`);
  console.log(`オプション: since=${args.since || '全件'}, dry-run=${args.dryRun}, force=${args.force}`);
  console.log('');

  const entries = await fetchEntries(supabase, args.since);
  console.log(`対象エントリ: ${entries.length} 件`);

  if (args.dryRun) {
    console.log('');
    console.log('(dry-run / ファイル生成しない)');
    // 月別件数だけ表示
    const byMonth = {};
    for (const e of entries) {
      const date = new Date(e.occurred_at || e.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    }
    console.log('月別件数:');
    for (const [k, v] of Object.entries(byMonth).sort()) {
      console.log(`  ${k}: ${v} 件`);
    }
    return;
  }

  let created = 0;
  let skipped = 0;
  let overwritten = 0;

  for (const entry of entries) {
    const { dir, filename } = entryToPath(entry);
    const fullPath = path.join(dir, filename);

    if (fs.existsSync(fullPath) && !args.force) {
      skipped++;
      continue;
    }

    fs.mkdirSync(dir, { recursive: true });
    const md = entryToMarkdown(entry);
    fs.writeFileSync(fullPath, md, 'utf8');

    if (fs.existsSync(fullPath) && args.force) {
      overwritten++;
    } else {
      created++;
    }
  }

  console.log('');
  console.log('---- 完了 ----');
  console.log(`新規作成: ${created} 件`);
  console.log(`スキップ (既存): ${skipped} 件`);
  if (args.force) console.log(`上書き: ${overwritten} 件`);
  console.log('');
  console.log(`Obsidian で確認: reports/dev-journal/ フォルダ`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
