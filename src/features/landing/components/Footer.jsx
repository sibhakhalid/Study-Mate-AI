import Logo from "../../../components/ui/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "How it works", "Preview"],
  },
  {
    title: "Company",
    links: ["About", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <Logo />
            <p className="text-sm text-ink-muted mt-3 max-w-[220px] leading-relaxed">
              Study material, organized by AI so you can focus on learning it.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-ink mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-ink-muted hover:text-ink transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-10 pt-6 text-xs text-ink-faint text-center">
          © {new Date().getFullYear()} StudyMate AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
