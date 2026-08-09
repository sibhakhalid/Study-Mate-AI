import { motion } from "framer-motion";
import { LayoutDashboard, NotebookPen, Layers, TrendingUp } from "lucide-react";
import { fadeInUp, viewportOnce } from "../../../utils/motion";

/**
 * Not a static screenshot image (nothing to screenshot yet, and a fake
 * image would need updating every time the real dashboard changes).
 * Instead: a lightweight, honest mockup built from the same tokens as
 * the real app, inside a simple browser-chrome frame for context.
 */
export default function ProductPreview() {
  return (
    <section id="preview" className="max-w-6xl mx-auto px-5 md:px-8 py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl font-medium text-ink mb-3">
          A calm home for your studying
        </h2>
        <p className="text-ink-muted max-w-md mx-auto">
          Everything in one place — no clutter, no noise.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-2xl border border-border shadow-lift overflow-hidden bg-surface"
      >
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-background">
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
        </div>

        {/* mock app */}
        <div className="flex h-[340px] sm:h-[400px]">
          <div className="hidden sm:flex w-44 shrink-0 border-r border-border flex-col gap-1 p-3 bg-surface">
            {[
              { icon: LayoutDashboard, label: "Dashboard", active: true },
              { icon: NotebookPen, label: "Notes" },
              { icon: Layers, label: "Flashcards" },
              { icon: TrendingUp, label: "Progress" },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium ${
                  item.active ? "bg-primary-soft text-ink" : "text-ink-faint"
                }`}
              >
                <item.icon size={14} strokeWidth={1.75} />
                {item.label}
              </div>
            ))}
          </div>

          <div className="flex-1 p-5 bg-background">
            <div className="h-3 w-32 bg-border rounded-full mb-5" />
            <div className="grid grid-cols-3 gap-3 mb-4">
              {["bg-primary-soft", "bg-secondary-soft", "bg-accent-soft"].map((c, i) => (
                <div key={i} className={`h-16 rounded-xl ${c}`} />
              ))}
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
              <div className="h-2.5 bg-border rounded-full w-full" />
              <div className="h-2.5 bg-border rounded-full w-4/5" />
              <div className="h-2.5 bg-border rounded-full w-2/3" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
