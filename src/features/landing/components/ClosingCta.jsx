import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button";
import { fadeInUp, viewportOnce } from "../../../utils/motion";

export default function ClosingCta() {
  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="bg-primary-soft rounded-2xl px-8 py-14 text-center"
      >
        <h2 className="font-display text-3xl font-medium text-ink mb-3">
          Start studying smarter today
        </h2>
        <p className="text-ink-muted mb-8 max-w-sm mx-auto">
          Free to start. No credit card, just your first set of notes.
        </p>
        <Link to="/signup">
          <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            Get started free
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
