import { motion } from "framer-motion";

export default function ResultHero() {
  return (
    <section className="pt-16 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-[11px] font-medium tracking-[0.5em] text-accent"
      >
        RESULT
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-5 text-[15px] text-sub"
      >
        マホと相性がいい男性は……
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 1.1 }}
        className="mt-5 font-serif text-[28px] font-bold leading-[1.5]"
      >
        身近にいる、
        <br />
        <span className="text-gradient">ちょっと変わった年上男性</span>
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1 }}
        className="mt-6 text-xs tracking-widest text-sub/70"
      >
        詳しい特徴を見ていきます
      </motion.p>
    </section>
  );
}
