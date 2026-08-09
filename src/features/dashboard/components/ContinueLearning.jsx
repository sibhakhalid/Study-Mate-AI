import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "../../../components/ui/Badge";
import { fadeInUp, staggerContainer, viewportOnce } from "../../../utils/motion";

export default function ContinueLearning({ items }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={fadeInUp} className="snap-start shrink-0">
          <Link
            to={item.to}
            className="block w-64 bg-surface border border-border rounded-2xl p-4 shadow-soft hover:shadow-lift transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Badge variant="secondary" className="mb-3">{item.type}</Badge>
            <h4 className="text-sm font-medium text-ink mb-3 leading-snug">
              {item.title}
            </h4>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <p className="text-xs text-ink-faint mt-1.5">{item.progress}% complete</p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
