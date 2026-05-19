import { motion } from "framer-motion";

type Props = {
  value: number;
  total: number;
  className?: string;
};

export function ProgressBar({ value, total, className = "" }: Props) {
  const pct = total <= 0 ? 0 : Math.max(0, Math.min(1, value / total));
  const pctStr = `${Math.round(pct * 100)}%`;

  return (
    <div
      className={`w-full h-1.5 bg-purple-lt rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progression ${pctStr}`}
    >
      <motion.div
        className="h-full bg-purple rounded-full"
        initial={false}
        animate={{ width: pctStr }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </div>
  );
}
