import { motion } from "framer-motion";
import { HelpCircle, Layers, NotebookPen, Bot } from "lucide-react";
import Card from "../../../components/ui/Card";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

const TYPE_ICON = {
  quiz: HelpCircle,
  flashcards: Layers,
  notes: NotebookPen,
  tutor: Bot,
};

export default function RecentActivity({ items }) {
  return (
    <Card variant="default">
      <h3 className="font-display text-base font-medium text-ink mb-4">
        Recent activity
      </h3>
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="space-y-1"
      >
        {items.map((item, i) => {
          const Icon = TYPE_ICON[item.type] ?? NotebookPen;
          const isLast = i === items.length - 1;
          return (
            <motion.li key={item.id} variants={fadeInUp} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-soft shrink-0">
                  <Icon className="w-[15px] h-[15px] text-primary-hover" strokeWidth={1.75} />
                </span>
                {!isLast && <span className="w-px flex-1 bg-border my-1" />}
              </div>
              <div className="pb-4">
                <p className="text-sm text-ink">{item.label}</p>
                <p className="text-xs text-ink-faint mt-0.5">{item.time}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </Card>
  );
}
