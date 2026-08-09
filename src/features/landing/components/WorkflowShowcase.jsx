import { motion } from "framer-motion";
import { FileText, Sparkles, BookOpen, HelpCircle, Layers, ArrowRight } from "lucide-react";
import { fadeInUp, viewportOnce } from "../../../utils/motion";

const OUTPUTS = [
  { icon: BookOpen, label: "Summary", color: "bg-primary-soft text-primary-hover" },
  { icon: HelpCircle, label: "Quiz", color: "bg-secondary-soft text-secondary-hover" },
  { icon: Layers, label: "Flashcards", color: "bg-accent-soft text-accent-hover" },
];

/**
 * This is the brief's signature moment: the product's actual value,
 * shown as a real flow rather than described in a paragraph.
 * One input -> one processing step -> three tangible outputs.
 */
export default function WorkflowShowcase() {
  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="text-center mb-14"
      >
        <h2 className="font-display text-3xl font-medium text-ink mb-3">
          One upload. Three ways to learn it.
        </h2>
        <p className="text-ink-muted max-w-md mx-auto">
          Here's exactly what happens the moment you add study material.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
        {/* Step 1: input */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="flex flex-col items-center gap-2 shrink-0"
        >
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border shadow-soft flex items-center justify-center">
            <FileText className="w-6 h-6 text-ink-muted" strokeWidth={1.75} />
          </div>
          <span className="text-xs font-medium text-ink-muted">Study material</span>
        </motion.div>

        <ArrowRight className="hidden md:block w-5 h-5 text-ink-faint shrink-0" strokeWidth={1.5} />
        <div className="md:hidden w-px h-6 bg-border" />

        {/* Step 2: processing — the pulse is the one place motion communicates "AI at work" */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="flex flex-col items-center gap-2 shrink-0"
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-soft"
          >
            <Sparkles className="w-6 h-6 text-ink" strokeWidth={1.75} />
          </motion.div>
          <span className="text-xs font-medium text-ink-muted">AI processing</span>
        </motion.div>

        <ArrowRight className="hidden md:block w-5 h-5 text-ink-faint shrink-0" strokeWidth={1.5} />
        <div className="md:hidden w-px h-6 bg-border" />

        {/* Step 3: three outputs, staggered */}
        <div className="flex gap-3">
          {OUTPUTS.map((output, i) => (
            <motion.div
              key={output.label}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${output.color}`}>
                <output.icon className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <span className="text-xs font-medium text-ink-muted">{output.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
