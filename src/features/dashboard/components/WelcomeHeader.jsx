import { motion } from "framer-motion";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function WelcomeHeader({ name }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <p className="text-sm text-ink-faint mb-1">{today}</p>
      <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink">
        {getGreeting()}, {name}
      </h1>
    </motion.div>
  );
}
