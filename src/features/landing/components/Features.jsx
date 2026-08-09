import { motion } from "framer-motion";
import { NotebookPen, HelpCircle, Layers, Bot, CalendarDays, TrendingUp } from "lucide-react";
import Card from "../../../components/ui/Card";
import { fadeInUp, viewportOnce } from "../../../utils/motion";

const FEATURES = [
  {
    icon: NotebookPen,
    title: "AI Notes Summarizer",
    description:
      "Drop in messy notes and get a clear, structured summary in seconds — organized the way you'd wish you'd taken them the first time.",
    span: "md:col-span-2",
  },
  {
    icon: Bot,
    title: "AI Tutor",
    description: "Ask questions, get explained through — like office hours, any hour.",
    span: "",
  },
  {
    icon: HelpCircle,
    title: "Quiz Generator",
    description: "Auto-built quizzes from your own material, not generic question banks.",
    span: "",
  },
  {
    icon: Layers,
    title: "Flashcards",
    description: "Spaced-repetition decks generated for you, ready to review.",
    span: "",
  },
  {
    icon: CalendarDays,
    title: "Study Planner",
    description:
      "A realistic schedule built around your deadlines, not a generic calendar template.",
    span: "md:col-span-2",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "See what's actually sticking, and what needs another pass.",
    span: "",
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-5 md:px-8 py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl font-medium text-ink mb-3">
          Everything you need, nothing you don't
        </h2>
        <p className="text-ink-muted max-w-md mx-auto">
          Six tools that work together, built around how studying actually happens.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUp}
            transition={{ delay: 0.06 * i }}
            className={feature.span}
          >
            <Card variant="default" className="h-full">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-soft mb-4">
                <feature.icon className="w-5 h-5 text-primary-hover" strokeWidth={1.75} />
              </span>
              <h3 className="font-display text-lg font-medium text-ink mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {feature.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
