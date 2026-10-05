import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export default function PrimaryButton({ children, onClick }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className="relative flex h-16 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff4d8d] to-[#a64dff] text-lg font-bold tracking-wider text-white shadow-[0_10px_40px_-10px_rgba(255,77,141,0.6)]"
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
      {children}
    </motion.button>
  );
}
