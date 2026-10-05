import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { analyzingMessages } from "../data";

const STEP_MS = 700;
const TOTAL_MS = STEP_MS * analyzingMessages.length;

type Props = { onDone: () => void };

export default function Analyzing({ onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / TOTAL_MS, 1);
      // 最後に少し溜めてから 100% に到達させる
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress(Math.round(eased * 100));
      setIndex(Math.min(Math.floor((now - start) / STEP_MS), analyzingMessages.length - 1));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const done = window.setTimeout(onDone, TOTAL_MS + 700);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [onDone]);

  const isLast = index === analyzingMessages.length - 1;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <div className="relative mb-12 h-28 w-28">
        <motion.div
          className="absolute inset-0 rounded-full border border-white/10 border-t-accent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-3 rounded-full border border-white/5 border-b-violet"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl font-bold tabular-nums">
          {progress}
          <span className="ml-0.5 text-sm text-sub">%</span>
        </div>
      </div>

      <div className="h-16 w-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={isLast ? "text-base font-bold text-accent" : "text-base text-white/85"}
          >
            {analyzingMessages[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-4 h-1 w-full max-w-[280px] overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-violet"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-[11px] tracking-[0.25em] text-sub/60">ANALYZING</p>
    </div>
  );
}
