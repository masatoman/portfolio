#!/usr/bin/env node
//
// rebuild-tooling-index.mjs
//
// docs/tooling-updates/ 配下の YYYY-MM-DD-tooling-update.html を ls して、
// 各 HTML から meta (日付 / カテゴリ件数 / 上位サマリ) を抽出し、
// docs/tooling-updates/index.html の `/* ENTRIES_START */ ... /* ENTRIES_END */` を rebuild する。
//
// 使い方:
//   node scripts/rebuild-tooling-index.mjs
//
// 呼び出し元: tooling-update-watch routine が新規 HTML 生成 → commit 前に実行。

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOOLING_DIR = join(__dirname, '..', 'docs', 'tooling-updates');
const INDEX_FILE = join(TOOLING_DIR, 'index.html');

function countMatches(html, regex) {
  return (html.match(regex) || []).length;
}

function extractTopSummary(html, cls) {
  const re = new RegExp(`<div class="update-item ${cls}">[\\s\\S]*?<strong>([^<]+)</strong>`);
  const m = html.match(re);
  return m ? m[1].trim() : '';
}

function extractMeta(htmlPath, filename) {
  const html = readFileSync(htmlPath, 'utf8');
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : filename;

  const cats = {
    b: countMatches(html, /class="update-item applicable-b"/g),
    obsidian: countMatches(html, /class="update-item applicable-obsidian"/g),
    ref: countMatches(html, /class="update-item reference-only"/g),
    fail: /<h2[^>]*>\s*取得失敗/.test(html) ? 1 : 0,
  };

  return {
    date,
    filename,
    cats,
    topB: extractTopSummary(html, 'applicable-b'),
    topObsidian: extractTopSummary(html, 'applicable-obsidian'),
  };
}

function rebuild() {
  if (!existsSync(INDEX_FILE)) {
    console.error(`❌ ${INDEX_FILE} が見つかりません`);
    process.exit(1);
  }

  const files = readdirSync(TOOLING_DIR)
    .filter(f => /^\d{4}-\d{2}-\d{2}.*\.html$/.test(f) && f !== 'index.html')
    .sort()
    .reverse();

  const entries = files.map(f => extractMeta(join(TOOLING_DIR, f), f));

  const index = readFileSync(INDEX_FILE, 'utf8');
  const entriesText = entries.length === 0
    ? ''
    : entries.map(e => '      ' + JSON.stringify(e)).join(',\n');
  const newIndex = index.replace(
    /\/\* ENTRIES_START \*\/[\s\S]*?\/\* ENTRIES_END \*\//,
    `/* ENTRIES_START */\n${entriesText}${entriesText ? '\n      ' : '      '}/* ENTRIES_END */`
  );

  writeFileSync(INDEX_FILE, newIndex);
  console.log(`✅ ${entries.length} 件 を ${INDEX_FILE} に rebuild しました`);
  if (entries.length > 0) {
    console.log('   最新:', entries[0].date, entries[0].filename);
  }
}

rebuild();
