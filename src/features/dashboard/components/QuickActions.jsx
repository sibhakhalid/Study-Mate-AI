import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Sparkles, Layers, Bot, ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

const ICONS = {
  "upload-notes": Upload,
  "new-quiz": Sparkles,
  "review-cards": Layers,
  "ask-tutor": Bot,
};

export default function QuickActions({ actions }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      {actions.map((action) => {
        const Icon = ICONS[action.id] ?? Sparkles;
        return (
          <motion.div key={action.id} variants={fadeInUp}>
            <Link
              to={action.to}
              className="group flex flex-col gap-3 bg-surface border border-border rounded-2xl p-4 shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary-soft">
                <Icon className="w-[18px] h-[18px] text-primary-hover" strokeWidth={1.75} />
              </span>
              <span className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{action.label}</span>
                <ArrowRight
                  size={14}
                  strokeWidth={2}
                  className="text-ink-faint group-hover:translate-x-0.5 transition-transform"
                />
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
