export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border bg-bg-secondary text-center">
      <p className="font-serif text-xl font-bold text-text-primary mb-2">KrispyKing.com</p>
      <p className="text-sm text-text-secondary mb-4">
        Hong Kong · Built with curiosity, caffeine, and approximately 52 AI agents.
      </p>
      <p className="text-xs text-text-secondary mb-4">© 2026 Chris Ransford</p>
      <a
        href="https://www.chrisransford.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-accent hover:text-accent-soft transition-colors"
      >
        chrisransford.com
      </a>
    </footer>
  )
}
