#!/usr/bin/env bash
#
# generate-claude-snapshot.sh
#
# Claude Code (ローカル) と claude.ai の memory 同期用 snapshot.md を 生成する。
# 出力先: docs/claude-ai-snapshot.md (.gitignore 済、 ローカル only)
#
# 使い方:
#   bash scripts/generate-claude-snapshot.sh
#
# 出力後:
#   1. claude.ai web → Projects → 「Portfolio (軸 B 工務店)」
#   2. Knowledge → 古い claude-ai-snapshot.md 削除 → 新しいの drag&drop
#   3. mobile / desktop / web 全部 自動同期 (操作不要)
#

set -euo pipefail

# --- 設定 ---

MEMORY_DIR="${HOME}/.claude/projects/-Users-master-home-work-portfolio/memory"
STRATEGY_FILE="${HOME}/home_work/個人開発マネタイズプラットフォーム/STRATEGY.md"
CLAUDE_MD="${HOME}/home_work/portfolio/CLAUDE.md"
OUTPUT="${HOME}/home_work/portfolio/docs/claude-ai-snapshot.md"

# 除外パターン (第三者情報を含む memory ファイル)
# ファイル名が これらの prefix で 始まる ものは snapshot に 含めない
EXCLUDE_PATTERNS=(
  "friend-"
  "friend_"
  "tokyo-startup-"
  "tamashin-"
  "shinkin-"
  "user-living-"
  "koumuten-reviews-"
  "koumuten_reviews"
)

# --- ヘルパー ---

is_excluded() {
  local name="$1"
  for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    if [[ "$name" == "$pattern"* ]]; then
      return 0
    fi
  done
  return 1
}

# --- 入力ファイル 収集 ---

if [[ ! -d "$MEMORY_DIR" ]]; then
  echo "❌ Error: Memory directory not found: $MEMORY_DIR" >&2
  exit 1
fi

shopt -s nullglob
all_md=("${MEMORY_DIR}"/*.md)
shopt -u nullglob

if [[ ${#all_md[@]} -eq 0 ]]; then
  echo "❌ Error: No .md files in $MEMORY_DIR" >&2
  exit 1
fi

# ファイル名で ソート (LC_ALL=C で 安定)
IFS=$'\n' sorted=($(LC_ALL=C printf '%s\n' "${all_md[@]}" | sort))
unset IFS

included=()
excluded=()
memory_index=""

for f in "${sorted[@]}"; do
  name=$(basename "$f")
  if [[ "$name" == "MEMORY.md" ]]; then
    memory_index="$f"
    continue
  fi
  if is_excluded "$name"; then
    excluded+=("$name")
  else
    included+=("$f")
  fi
done

# MEMORY.md (index) は 最初に
if [[ -n "$memory_index" ]]; then
  included=("$memory_index" "${included[@]}")
fi

# --- 出力 ---

mkdir -p "$(dirname "$OUTPUT")"
now=$(date "+%Y-%m-%d %H:%M %Z")
included_count=${#included[@]}
excluded_count=${#excluded[@]}

# ヘッダ + frontmatter + 目次
{
  echo "---"
  echo "generated: $now"
  echo "source: ~/.claude/projects/-Users-master-home-work-portfolio/memory/ + STRATEGY.md + portfolio/CLAUDE.md"
  echo "included: $included_count files"
  echo "excluded: $excluded_count files (third-party-sensitive)"
  echo "purpose: claude.ai Project Knowledge upload (sync with Claude Code locally)"
  echo "---"
  echo ""
  echo "# masatoman 戦略 + memory スナップショット"
  echo ""
  echo "このファイルは **Claude Code (ローカル) と claude.ai を 同期** するために 自動生成された スナップショット。 最新の 戦略思考・自己フィードバック・プロジェクト状態 を 含む。"
  echo ""
  echo "**重要**: 第三者情報 (友人発言生メモ / 営業先 詳細 / 居住地 等) は **ローカル only** で、 このファイルには 含まれない。 claude.ai 側で「友人ヒアリングの 具体内容」 等を 質問しても 答えられない 想定。"
  echo ""
  echo "## 含まれる セクション"
  echo ""
  echo "1. **STRATEGY.md** — 全体戦略 (masatoman.net 軸 A + 工務店プロジェクト 軸 B)"
  echo "2. **portfolio/CLAUDE.md** — portfolio repo 作業指示"
  echo "3. **portfolio memory ($included_count 件)** — MEMORY.md index + 個別 memory ファイル"
  echo ""
  echo "## 除外された ファイル ($excluded_count 件、 ローカル only)"
  echo ""
  if [[ $excluded_count -eq 0 ]]; then
    echo "_(なし)_"
  else
    for name in "${excluded[@]}"; do
      echo "- \`$name\`"
    done
  fi
  echo ""
} > "$OUTPUT"

# STRATEGY.md
{
  echo ""
  echo "---"
  echo ""
  echo "# 📋 STRATEGY.md"
  echo ""
  echo "<!-- source: $STRATEGY_FILE -->"
  echo ""
  if [[ -f "$STRATEGY_FILE" ]]; then
    cat "$STRATEGY_FILE"
  else
    echo "_(STRATEGY.md が 見つかりません: $STRATEGY_FILE)_"
  fi
} >> "$OUTPUT"

# portfolio/CLAUDE.md
{
  echo ""
  echo "---"
  echo ""
  echo "# 📋 portfolio/CLAUDE.md"
  echo ""
  echo "<!-- source: $CLAUDE_MD -->"
  echo ""
  if [[ -f "$CLAUDE_MD" ]]; then
    cat "$CLAUDE_MD"
  else
    echo "_(CLAUDE.md が 見つかりません: $CLAUDE_MD)_"
  fi
} >> "$OUTPUT"

# memory ファイル
for f in "${included[@]}"; do
  name=$(basename "$f")
  {
    echo ""
    echo "---"
    echo ""
    echo "# 🧠 memory: $name"
    echo ""
    cat "$f"
  } >> "$OUTPUT"
done

# --- サマリ表示 ---

output_size=$(wc -c < "$OUTPUT" | tr -d ' ')
output_lines=$(wc -l < "$OUTPUT" | tr -d ' ')
output_size_kb=$((output_size / 1024))

echo ""
echo "✅ Snapshot generated"
echo "   Output: $OUTPUT"
echo "   Size:   ${output_size_kb} KB / ${output_lines} lines"
echo "   Included: $included_count memory files + STRATEGY.md + CLAUDE.md"
echo "   Excluded: $excluded_count memory files (third-party-sensitive)"
echo ""
echo "📋 次の ステップ:"
echo "   1. claude.ai web → Projects → 「Portfolio (軸 B 工務店)」 を 開く"
echo "      (初回は Create a project で 作成、 Custom Instructions も 設定)"
echo "   2. Knowledge → 古い claude-ai-snapshot.md を 削除"
echo "   3. 新しい claude-ai-snapshot.md を drag&drop で upload"
echo "   4. mobile / desktop / web 全部 自動同期 (操作不要)"
echo ""
