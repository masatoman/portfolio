import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Analyzing from "./components/Analyzing";
import Backdrop from "./components/Backdrop";
import Intro from "./components/Intro";
import Result from "./components/Result";
import Reveal from "./components/Reveal";

type Phase = "intro" | "analyzing" | "result" | "reveal";

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  const toResult = useCallback(() => setPhase("result"), []);

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <Backdrop dim={phase === "reveal"} />
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: phase === "reveal" ? 1 : 0.5 }}
        >
          {phase === "intro" && <Intro onStart={() => setPhase("analyzing")} />}
          {phase === "analyzing" && <Analyzing onDone={toResult} />}
          {phase === "result" && <Result onReveal={() => setPhase("reveal")} />}
          {phase === "reveal" && <Reveal onRestart={() => setPhase("intro")} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
