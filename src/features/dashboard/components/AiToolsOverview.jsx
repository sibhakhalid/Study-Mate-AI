import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NotebookPen, Bot, HelpCircle, Layers, CalendarDays, ArrowRight } from "lucide-react";
import Card from "../../../components/ui/Card";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

const ICONS = {
  notes: NotebookPen,
  tutor: Bot,
  quiz: HelpCircle,
  flashcards: Layers,
  planner: CalendarDays,
};

/**
 * Creative grid, not 5 identical cards: the first (featured) tool spans
 * two columns, matching the asymmetric bento pattern already established
 * on the landing page's Features section — one visual language, reused.
 */
export default function AiToolsOverview({ tools }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {tools.map((tool) => {
        const Icon = ICONS[tool.id] ?? NotebookPen;
        return (
          <motion.div
            key={tool.id}
            variants={fadeInUp}
            className={tool.featured ? "sm:col-span-2" : ""}
          >
            <Card as={Link} to={tool.to} variant="interactive" className="h-full block">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-soft mb-4">
                <Icon className="w-5 h-5 text-primary-hover" strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-base font-medium text-ink mb-1">
                {tool.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-3">
                {tool.description}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-hover">
                Open <ArrowRight size={12} strokeWidth={2} />
              </span>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
