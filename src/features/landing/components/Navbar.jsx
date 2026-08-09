import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../../components/ui/Logo";
import Button from "../../../components/ui/Button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#preview", label: "Preview" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-sm border-b border-border">
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-16 px-5 md:px-8">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-ink-muted hover:text-ink transition-colors px-2"
          >
            Log in
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="md">Get started</Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-ink-muted"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                className="py-2.5 text-sm font-medium text-ink"
              >
                Log in
              </Link>
              <Link to="/signup" className="pt-2">
                <Button variant="primary" className="w-full">Get started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
