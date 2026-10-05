import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { forwardRef } from "react";
import type { Trait } from "../../data";

type Props = { trait: Trait; index: number };

const TraitCard = forwardRef<HTMLDivElement, Props>(function TraitCard({ trait, index }, ref) {
  const no = String(index + 1).padStart(2, "0");

  if (trait.special) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl bg-gradient-to-br from-accent via-[#c04dff] to-violet p-px shadow-[0_0_60px_-15px_rgba(255,77,141,0.7)]"
      >
        <div className="relative overflow-hidden rounded-[23px] bg-[#1a1220] px-6 py-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />
          <div className="flex items-center justify-between">
            <span className="font-serif text-sm font-bold tracking-widest text-accent">{no}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-accent">
              <Crown className="h-3 w-3" strokeWidth={2} />
              決定的な特徴
            </span>
          </div>
          <h3 className="mt-4 font-serif text-[24px] font-bold leading-snug">
            {/* 「作 / る男」 のような変な位置で折り返さないよう、 意味の切れ目で改行 */}
            {trait.title.replace(/(.+?ために)/, "$1\n")
              .split("\n")
              .map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
          </h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-4 text-lg text-white/90"
          >
            {trait.description}
          </motion.p>
          <p className="mt-6 border-t border-white/10 pt-4 text-[11px] tracking-wider text-accent/90">
            {trait.narrowing}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-white/[0.06] bg-card px-6 py-6"
    >
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-sm font-bold tracking-widest text-accent/80">{no}</span>
        <h3 className="font-serif text-xl font-bold leading-snug">{trait.title}</h3>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-sub">{trait.description}</p>
      <p className="mt-4 text-[11px] tracking-wider text-sub/60">{trait.narrowing}</p>
    </motion.div>
  );
});

export default TraitCard;
