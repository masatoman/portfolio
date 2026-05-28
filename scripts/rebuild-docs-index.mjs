#!/usr/bin/env node
//
// rebuild-docs-index.mjs
//
// docs/*.html を ls して、 各 HTML から meta (title / 日付 / 要約) を抽出し、
// docs/index.html の `/* ENTRIES_START */ ... /* ENTRIES_END */` を rebuild する。
//
// 使い方:
//   node scripts/rebuild-docs-index.mjs
//
// 対象:
//   - docs/ 直下 + サブディレクトリ (business/, service/, meeting/ 等) の *.html
//   - index.html 自身は除外
//

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..', 'docs');
const INDEX_FILE = join(DOCS_DIR, 'index.html');

const DIR_CATEGORY_MAP = {
  business:   { id: 'business',   label: '事業計画' },
  service:    { id: 'service',    label: 'サービス設計' },
  meeting:    { id: 'meeting',    label: 'ヒアリング・商談' },
  'v8.0':     { id: 'v8',        label: 'v8.0' },
  design:     { id: 'design',     label: 'デザインブリーフ' },
  channel:    { id: 'channel',    label: '工務店戦略' },
  operations: { id: 'operations', label: '運用・計画' },
  technical:  { id: 'technical',  label: '技術' },
  tamashin:   { id: 'tamashin',   label: 'たましん・補助金' },
};

function categorize(filename, subdir) {
  if (subdir && DIR_CATEGORY_MAP[subdir]) return DIR_CATEGORY_MAP[subdir];
  if (/^business-(plan|summary)/.test(filename)) return { id: 'business', label: '事業計画' };
  if (/^design-brief/.test(filename)) return { id: 'design', label: 'デザインブリーフ' };
  if (/^(komuten|koumuten)/.test(filename)) return { id: 'channel', label: '工務店戦略' };
  if (/^(consultation|friend-hearing|tamashin)/.test(filename)) return { id: 'meeting', label: 'ヒアリング・商談' };
  if (/^(calendar|cowork|integrated|routines)/.test(filename)) return { id: 'operations', label: '運用・計画' };
  if (/^(saas-pricing|may-action|remaining-tasks|voice-pipeline)/.test(filename)) return { id: 'operations', label: '運用・計画' };
  if (/^(index-|claude-code-features)/.test(filename)) return { id: 'meta', label: '履歴・メタ' };
  return { id: 'other', label: 'その他' };
}

function extractTitle(html, filename) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (m) return m[1].trim().replace(/\s+/g, ' ');
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return h1[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  return filename.replace(/\.html$/, '');
}

function extractDescription(html) {
  const meta = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (meta) return meta[1].trim();
  const lead = html.match(/<p\s+class=["'](?:lead|meta|description)["'][^>]*>([\s\S]*?)<\/p>/i);
  if (lead) return lead[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ').slice(0, 160);
  const firstP = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (firstP) return firstP[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ').slice(0, 160);
  return '';
}

function extractDate(filename, mtime) {
  const m = filename.match(/(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  return new Date(mtime).toISOString().slice(0, 10);
}

function toYMD(d) {
  return new Date(d).toISOString().slice(0, 10);
}

const REPO_ROOT = join(__dirname, '..');

function gitFirstCommitISO(relativePath) {
  try {
    const out = execSync(
      `git log --diff-filter=A --follow --format=%aI -- "${relativePath}"`,
      { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim();
    if (!out) return null;
    const lines = out.split('\n').filter(Boolean);
    return lines[lines.length - 1]; // 最古 (= 初コミット時刻、 ISO 8601)
  } catch {
    return null;
  }
}

function ensureCreatedMeta(filepath, filename, html, fallbackMtime) {
  const existing = html.match(/<meta\s+name=["']created["']\s+content=["']([^"']+)["']/i);
  if (existing) {
    return { html, created: existing[1], injected: false };
  }
  const created = gitFirstCommitISO(`docs/${filename}`) || new Date(fallbackMtime).toISOString();
  const indent = '  ';
  const newMeta = `${indent}<meta name="created" content="${created}">\n`;
  let newHtml;
  if (/<\/head>/i.test(html)) {
    newHtml = html.replace(/<\/head>/i, `${newMeta}</head>`);
  } else {
    // <head> が無い HTML には先頭に挿入
    newHtml = newMeta + html;
  }
  writeFileSync(filepath, newHtml);
  return { html: newHtml, created, injected: true };
}

function gitLastCommitISO(relativePath) {
  try {
    const out = execSync(
      `git log -1 --format=%aI -- "${relativePath}"`,
      { cwd: REPO_ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim();
    return out || null;
  } catch {
    return null;
  }
}

let injectedCount = 0;

function extractMeta(filepath, filename, subdir) {
  let html = readFileSync(filepath, 'utf8');
  const st = statSync(filepath);
  const relPath = subdir ? `docs/${subdir}/${filename}` : `docs/${filename}`;
  const { html: updatedHtml, created, injected } = ensureCreatedMeta(filepath, filename, html, st.mtime);
  if (injected) injectedCount++;
  html = updatedHtml;
  const updated = gitLastCommitISO(relPath) || new Date(st.mtime).toISOString();
  const displayFilename = subdir ? `${subdir}/${filename}` : filename;
  return {
    filename: displayFilename,
    title: extractTitle(html, filename),
    description: extractDescription(html),
    date: extractDate(filename, st.mtime),
    created,
    updated,
    category: categorize(filename, subdir),
    size: st.size,
  };
}

function rebuild() {
  if (!existsSync(INDEX_FILE)) {
    console.error(`❌ ${INDEX_FILE} が見つかりません`);
    process.exit(1);
  }

  const entries = [];

  const rootFiles = readdirSync(DOCS_DIR)
    .filter(f => /\.html$/.test(f) && f !== 'index.html');
  for (const f of rootFiles) {
    entries.push(extractMeta(join(DOCS_DIR, f), f, null));
  }

  const subdirs = readdirSync(DOCS_DIR)
    .filter(d => {
      const full = join(DOCS_DIR, d);
      return statSync(full).isDirectory() && !['legacy', 'issue-finder'].includes(d);
    });
  for (const sub of subdirs) {
    const subPath = join(DOCS_DIR, sub);
    const subFiles = readdirSync(subPath).filter(f => /\.html$/.test(f));
    for (const f of subFiles) {
      entries.push(extractMeta(join(subPath, f), f, sub));
    }
  }

  entries.sort((a, b) => b.date.localeCompare(a.date));

  const index = readFileSync(INDEX_FILE, 'utf8');
  const entriesText = entries.length === 0
    ? ''
    : entries.map(e => '      ' + JSON.stringify(e)).join(',\n');
  const newIndex = index.replace(
    /\/\* ENTRIES_START \*\/[\s\S]*?\/\* ENTRIES_END \*\//,
    `/* ENTRIES_START */\n${entriesText}${entriesText ? '\n      ' : '      '}/* ENTRIES_END */`
  );

  writeFileSync(INDEX_FILE, newIndex);

  const byCat = entries.reduce((acc, e) => {
    acc[e.category.label] = (acc[e.category.label] || 0) + 1;
    return acc;
  }, {});

  console.log(`✅ ${entries.length} 件 を ${INDEX_FILE} に rebuild しました`);
  console.log('   カテゴリ別:', Object.entries(byCat).map(([k, v]) => `${k}=${v}`).join(' / '));
  if (injectedCount > 0) {
    console.log(`   ℹ️  ${injectedCount} 件に <meta name="created"> を新規注入しました (git 初コミット時刻ベース)`);
  }
}

rebuild();
