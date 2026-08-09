import { motion } from "framer-motion";
import { Upload, Wand2, GraduationCap } from "lucide-react";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your material",
    description: "Paste notes, upload a PDF, or type in a topic you're studying.",
  },
  {
    number: "02",
    icon: Wand2,
    title: "AI does the organizing",
    description: "StudyMate generates a summary, quiz, and flashcards from it.",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "You actually learn it",
    description: "Review, quiz yourself, and track what's sticking over time.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface border-y border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl font-medium text-ink mb-3">
            How it works
          </h2>
          <p className="text-ink-muted">Three steps. That's the whole process.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid sm:grid-cols-3 gap-10"
        >
          {STEPS.map((step) => (
            <motion.div key={step.number} variants={fadeInUp} className="text-center">
              <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-soft mb-4">
                <step.icon className="w-6 h-6 text-primary-hover" strokeWidth={1.75} />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink text-background text-[11px] font-medium flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-lg font-medium text-ink mb-1.5">
                {step.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed max-w-[220px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
