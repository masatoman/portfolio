import { animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MATCH_RATE } from "../../data";

const SIZE = 220;
const STROKE = 8;
const R = (SIZE - STROKE) / 2;

export default function MatchScore() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, MATCH_RATE, {
      duration: 2.2,
      delay: 0.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center rounded-3xl border border-white/[0.06] bg-card/70 px-6 py-10 backdrop-blur"
    >
      <p className="text-[11px] tracking-[0.4em] text-sub">MATCH RATE</p>
      <p className="mt-2 font-serif text-lg font-bold">条件一致率</p>

      <div className="relative mt-8" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF4D8D" />
              <stop offset="100%" stopColor="#9B5CFF" />
            </linearGradient>
          </defs>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="rgba(255,255,255,0.07)" strokeWidth={STROKE} fill="none" />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke="url(#ring)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: MATCH_RATE / 100 }}
            transition={{ duration: 2.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: "drop-shadow(0 0 10px rgba(255,77,141,0.55))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-[56px] font-black tabular-nums leading-none">
            {value.toFixed(1)}
          </span>
          <span className="ml-1 mt-5 font-serif text-xl font-bold text-accent">%</span>
        </div>
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-sub/80">
        統計的にありえない一致率です
      </p>
    </motion.section>
  );
}
