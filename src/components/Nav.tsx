import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Hobbies',  href: '#hobbies' },
  { label: 'Travel',   href: '#travel' },
  { label: 'AI',       href: '#ai-journey' },
  { label: 'Now',      href: '#now' },
  { label: 'Projects', href: '#projects' },
  { label: 'Connect',  href: '#connect' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10, 15, 26, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1f2937' : '1px solid transparent',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="#hero"
          className="font-serif font-bold text-text-primary text-lg hover:text-accent transition-colors"
        >
          KrispyKing
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span
            className="block h-0.5 w-5 bg-text-primary transition-all duration-200 origin-center"
            style={{ transform: open ? 'rotate(45deg) translateY(8px)' : 'none' }}
          />
          <span
            className="block h-0.5 w-5 bg-text-primary transition-opacity duration-200"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block h-0.5 w-5 bg-text-primary transition-all duration-200 origin-center"
            style={{ transform: open ? 'rotate(-45deg) translateY(-8px)' : 'none' }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden border-t border-border"
          style={{ background: 'rgba(10, 15, 26, 0.98)', backdropFilter: 'blur(12px)' }}
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-text-secondary hover:text-accent transition-colors text-sm font-medium py-2.5 border-b border-border/40 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
