import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

type Props = { onRestart: () => void };

const fade = (delay: number, duration = 1) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Reveal({ onRestart }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8 py-16 text-center">
      <motion.p {...fade(0.8)} className="font-serif text-lg text-sub">
        ちなみに、
      </motion.p>

      <motion.p {...fade(2.4)} className="mt-8 font-serif text-xl font-bold leading-[1.8]">
        この診断を作った人が
        <br />
        かなり条件に当てはまっています。
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 4.6, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-14"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-accent blur-[60px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 4.9, duration: 1.5 }}
        />
        <h2 className="text-gradient whitespace-nowrap font-serif text-[clamp(64px,19vw,96px)] font-black leading-none tracking-tight">
          俺です。
        </h2>
      </motion.div>

      <motion.p {...fade(6.6)} className="mt-14 text-xs leading-loose text-sub/80">
        調査結果には個人的な願望が
        <br />
        若干含まれている可能性があります。
      </motion.p>

      <motion.button
        {...fade(8)}
        type="button"
        onClick={onRestart}
        whileTap={{ scale: 0.95 }}
        className="mt-12 inline-flex h-12 items-center gap-2 rounded-full border border-white/10 px-6 text-sm text-sub"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={1.6} />
        もう一回占う
      </motion.button>
    </div>
  );
}
