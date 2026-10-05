import { useEffect, useRef, useState } from "react";
import { traits } from "../data";
import MatchScore from "./result/MatchScore";
import ResultHero from "./result/ResultHero";
import RevealButton from "./result/RevealButton";
import TraitCard from "./result/TraitCard";

// 特徴カードは一気に出さず、1 枚ずつ時間差で出す
const FIRST_DELAY_MS = 2800;
const STEP_MS = 1600;
// 最後の「本人カード」の前だけ少し溜める
const SPECIAL_EXTRA_MS = 1200;
const SCORE_DELAY_MS = 2600;
const BUTTON_DELAY_MS = 2800;

type Props = { onReveal: () => void };

export default function Result({ onReveal }: Props) {
  const [shown, setShown] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const lastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: number[] = [];
    let t = FIRST_DELAY_MS;
    traits.forEach((trait, i) => {
      if (trait.special) t += SPECIAL_EXTRA_MS;
      timers.push(window.setTimeout(() => setShown(i + 1), t));
      t += STEP_MS;
    });
    t += SCORE_DELAY_MS - STEP_MS;
    timers.push(window.setTimeout(() => setShowScore(true), t));
    t += BUTTON_DELAY_MS;
    timers.push(window.setTimeout(() => setShowButton(true), t));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  // 新しく出てきた要素が画面外ならそっと寄せる
  useEffect(() => {
    if (shown === 0 && !showScore) return;
    const el = lastRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 24) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [shown, showScore, showButton]);

  return (
    <div className="mx-auto w-full max-w-[440px] px-5">
      <ResultHero />

      <div className="mt-12 flex flex-col gap-5">
        {traits.slice(0, shown).map((trait, i) => (
          <TraitCard
            key={trait.title}
            ref={i === shown - 1 && !showScore ? lastRef : undefined}
            trait={trait}
            index={i}
          />
        ))}
      </div>

      {showScore && (
        <div ref={!showButton ? lastRef : undefined} className="mt-14">
          <MatchScore />
        </div>
      )}

      {showButton && (
        <div ref={lastRef} className="mt-10">
          <RevealButton onReveal={onReveal} />
        </div>
      )}
    </div>
  );
}
