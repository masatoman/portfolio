import { motion } from "framer-motion";
import PrimaryButton from "../PrimaryButton";

type Props = { onReveal: () => void };

export default function RevealButton({ onReveal }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="pb-20 pt-6 text-center"
    >
      <p className="font-serif text-xl font-bold">心当たりはありますか？</p>
      <div className="mx-auto mt-8 w-full max-w-[320px]">
        <PrimaryButton onClick={onReveal}>……あるかも</PrimaryButton>
      </div>
    </motion.section>
  );
}
