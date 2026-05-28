#!/usr/bin/env bash
# UserPromptSubmit hook: 軸 A (masatoman.net) 関連の作業を検出して STRATEGY.md §3 の方針を reminder 注入する。
# 軸 B (工務店プロジェクト) は主軸なのでスルー。 block はしない (reminder のみ)。
# 失敗時は exit 0 で素通りさせて prompt を絶対に止めない。

set +e

INPUT="$(cat 2>/dev/null)"
if [[ -z "$INPUT" ]]; then
  exit 0
fi

PROMPT="$(echo "$INPUT" | jq -r '.prompt // .user_prompt // ""' 2>/dev/null)"
if [[ -z "$PROMPT" ]]; then
  exit 0
fi

# 軸 A (masatoman.net 自動運用化のため、 能動的に着手しようとしたら reminder)
if echo "$PROMPT" | grep -qiE '(masatoman\.net|軸 ?A|軸A|有料記事|メルマガ|SEO|新規記事|記事を書|英語化|Cursor 記事|Claude Code 記事|night-?writer|distribution[- ]experiment|sns-?automation を 修正|改善 記事)'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: "⚠️ AXIS-GUARD: このプロンプトは軸 A (masatoman.net) 関連の能動的着手に見えます。 STRATEGY.md §3 (2026-05-11 改訂) で軸 A は **自動運用のみ / 学習・既存改善停止 / 新規記事ノルマなし** に降格されています。 sns-automation + 既存 80 本 SEO に任せる方針。 進める前に「これは触らない方針と矛盾しないか」 を masatoman に確認することを推奨。"
    }
  }'
  exit 0
fi

# 凍結プロジェクト (recipe-ai / FreelanceGuard / ai-trend-site / indiedb / oshipush / arbitrage-saas-web / distribution experiment v1 / handson-course) への着手検出
if echo "$PROMPT" | grep -qiE '(recipe-?ai|FreelanceGuard|ai-?trend-?site|indiedb|OshiPush|web-?push|arbitrage-?saas|distribution[- ]experiment[- ]v1|handson-?course|ハンズオン講座|凍結.*再開)'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: "⚠️ AXIS-GUARD: 凍結プロジェクトへの再着手に見えます。 STRATEGY.md §7 / Appendix A の凍結リストを確認し、 再開判断 (軸 B 3 ヶ月後判定 = 2026-07-30) と矛盾しないか masatoman に確認することを推奨。"
    }
  }'
  exit 0
fi

# 軸 B 関連 or 中立 = 何も注入しない
exit 0
