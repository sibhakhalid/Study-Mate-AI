/**
 * Shared scroll-reveal variant. Used via whileInView across every landing
 * section so all "appear on scroll" motion is visually identical and
 * defined once — not reinvented per section.
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export const viewportOnce = { once: true, amount: 0.3 };
