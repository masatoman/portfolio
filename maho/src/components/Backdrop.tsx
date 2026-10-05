import { motion } from "framer-motion";

type Props = { dim?: boolean };

export default function Backdrop({ dim = false }: Props) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <motion.div
        className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-accent blur-[140px]"
        animate={{ opacity: dim ? 0.06 : 0.18 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute -bottom-48 -right-32 h-[420px] w-[420px] rounded-full bg-violet blur-[150px]"
        animate={{ opacity: dim ? 0.04 : 0.14 }}
        transition={{ duration: 1.2 }}
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}
