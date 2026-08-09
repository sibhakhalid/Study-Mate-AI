import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import Button from "../../../components/ui/Button";

/**
 * Hero visual is a grounded product mockup — a real notes snippet
 * transforming into a flashcard — not an abstract AI gradient orb.
 * This is what "ground it in the subject" means for this brief.
 */
export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <span className="inline-flex items-center gap-1.5 bg-primary-soft text-ink text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Sparkles size={13} strokeWidth={2} />
          AI-powered studying
        </span>

        <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] font-medium text-ink mb-5">
          Turn your notes into <span className="text-primary-hover">mastery</span>, not more work.
        </h1>

        <p className="text-ink-muted text-base sm:text-lg leading-relaxed mb-8 max-w-md">
          Upload your study material and StudyMate AI turns it into clean
          summaries, quizzes, and flashcards — so you spend your time
          learning, not organizing.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/signup">
            <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
              Start studying free
            </Button>
          </Link>
          <Button variant="ghost" size="lg" icon={PlayCircle}>
            See how it works
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        className="relative"
      >
        {/* "Before" — raw notes */}
        <div className="bg-surface border border-border rounded-2xl shadow-soft p-5 max-w-xs">
          <p className="text-xs font-medium text-ink-faint mb-2">Your notes</p>
          <div className="space-y-2">
            <div className="h-2.5 bg-border rounded-full w-full" />
            <div className="h-2.5 bg-border rounded-full w-5/6" />
            <div className="h-2.5 bg-border rounded-full w-full" />
            <div className="h-2.5 bg-border rounded-full w-3/4" />
          </div>
        </div>

        {/* "After" — flashcard, offset + floating, arrives after the notes card */}
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: [0, -6, 0], x: 0 }}
          transition={{
            opacity: { duration: 0.5, delay: 0.55 },
            x: { duration: 0.5, delay: 0.55 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.1 },
          }}
          className="absolute -bottom-8 -right-4 sm:-right-10 bg-primary-soft border border-primary/40 rounded-2xl shadow-lift p-5 w-52"
        >
          <p className="text-xs font-medium text-ink-faint mb-2">Flashcard</p>
          <p className="text-sm font-medium text-ink mb-3">
            What is the powerhouse of the cell?
          </p>
          <p className="text-xs text-ink-muted border-t border-primary/30 pt-2">
            Mitochondria
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
