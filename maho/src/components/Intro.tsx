import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import PrimaryButton from "./PrimaryButton";

type Props = { onStart: () => void };

export default function Intro({ onStart }: Props) {
  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-16">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[11px] tracking-[0.3em] text-sub"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.6} />
          LOVE ANALYSIS
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-serif text-[34px] font-bold leading-[1.45] tracking-wide"
        >
          <span className="text-gradient">マホ</span>の理想の男、
          <br />
          勝手に調べました。
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-7 text-[15px] leading-loose text-sub"
        >
          AIと謎の恋愛データを駆使して、
          <br />
          マホと相性がいい男性を勝手に分析します。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-14 w-full max-w-[320px]"
        >
          <PrimaryButton onClick={onStart}>勝手に占う</PrimaryButton>
          <p className="mt-4 text-xs text-sub/70">本人の許可は取っていません</p>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="text-center text-[11px] text-sub/60"
      >
        ※信頼性については責任を負いません
      </motion.p>
    </div>
  );
}
