import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const PROBLEM_COLUMNS = [
  {
    title: 'Celebrities',
    body: '$50K–$5M. 8-week lead time. Legal team required.',
  },
  {
    title: 'AI Avatars',
    body: 'Generic. Uncanny. Nobody believes them.',
  },
  {
    title: 'Deepfakes',
    body: 'Illegal. Reputationally toxic. Career-ending.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Perform',
    body: 'Real humans — actors, performers, models — apply to join the roster. They are fully captured: likeness, voice, movement. They consent, contract, and earn a royalty on every render.',
  },
  {
    number: '02',
    title: 'Categorise',
    body: 'Every Understudy is catalogued by archetype — not by celebrity resemblance. The Visionary. The Rebel. The Sage. The Strategist. This is not impersonation. This is a creative character type.',
  },
  {
    number: '03',
    title: 'Deliver',
    body: 'Clients call the API. Specify archetype, tone, and use case. Receive a licensed, watermarked render — ready for production.',
  },
]

const USE_CASES = [
  { icon: '🎬', title: 'Film & Production', body: 'Populate supporting roles and background cast with archetype-matched performers. Reduce talent booking costs by 60–80%.' },
  { icon: '📱', title: 'Creator Content', body: 'Add cinematic, culturally resonant faces to YouTube explainers, TikTok videos, and podcast content.' },
  { icon: '📣', title: 'Marketing Campaigns', body: 'Cast the "charismatic activist" or "visionary founder" archetype for a campaign without a 6-week talent negotiation.' },
  { icon: '🎮', title: 'Gaming', body: 'NPC faces, voices, and movement — licensed for global distribution. No right-of-publicity exposure.' },
  { icon: '🏢', title: 'Corporate Training', body: 'Relatable archetype characters for e-learning — the mentor, the challenger, the new hire — that feel real.' },
  { icon: '💰', title: 'Social Advertising', body: 'Dynamic ad creative with licensed face variants. Personalisation at scale without legal exposure.' },
]

const ARCHETYPES = [
  { name: 'The Visionary', line: 'The person in the room who sees ten years ahead.' },
  { name: 'The Maverick', line: 'The one who rewrites the rules while everyone else is still reading them.' },
  { name: 'The Sage', line: 'The one everyone eventually comes to for the real answer.' },
  { name: 'The Rebel', line: 'The one who says what everyone else is thinking but won’t.' },
  { name: 'The Architect', line: 'The one who makes complicated things look inevitable.' },
  { name: 'The Champion', line: 'The one who shows up every time, for everyone.' },
]

const TIERS = [
  { name: 'Creator', price: '$49/mo', body: 'Individual creators, small productions' },
  { name: 'Pro', price: '$249/mo', body: 'Agencies, regular campaigns' },
  { name: 'Enterprise', price: 'Custom', body: 'Studios, platforms, volume licensees' },
]

const WAITLIST_MAILTO =
  'mailto:cransford@gmail.com?subject=Understudy%20Labs%20—%20waitlist'

// "The Digital Frame" — per the brand spec: a minimalist, incomplete square with a
// biometric fingerprint ridge integrated into the corner. Stroke-only, Platinum Silver,
// monoline and geometric. Inline (no external asset) so it scales cleanly at any size.
function DigitalFrameMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      stroke="#e5e4e2"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* Incomplete square — the frame, deliberately open at the bottom-right corner */}
      <path d="M4 10V4h6" />
      <path d="M28 10V4h-6" />
      <path d="M4 22v6h6" />
      <path d="M22 4h6v6" />
      {/* Fingerprint ridge — 3 concentric arcs, evenly spaced so they read as
          distinct rings rather than merging at small (header) sizes */}
      <path d="M19.5 19.5c0 1.5 1.2 2.7 2.7 2.7" opacity="1" />
      <path d="M21 21c0 2.5 2 4.5 4.5 4.5" opacity="0.75" />
      <path d="M22.5 22.5c0 3.5 2.8 6.3 6.3 6.3" opacity="0.5" />
    </svg>
  )
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, delay },
  }
}

export default function UnderstudyLabsPage() {
  return (
    <div className="min-h-screen bg-ul-charcoal text-ul-platinum font-ul-body">
      {/* Standalone header — Understudy Labs is a distinct brand, not a KrispyKing section.
          16px inline padding keeps the mark off the viewport edge on narrow screens. */}
      <header className="border-b border-ul-navy/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <DigitalFrameMark />
            <span className="hidden md:inline font-ul-heading text-xl font-semibold tracking-wide text-ul-platinum">
              Understudy Labs
            </span>
          </span>
          <Link to="/" className="text-sm text-ul-platinum/60 hover:text-ul-cyan transition-colors">
            ← krispyking.com
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.p
            {...fadeUp()}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-ul-cyan mb-6"
          >
            Concept preview
          </motion.p>
          <motion.h1
            {...fadeUp(0.1)}
            className="font-ul-heading font-semibold text-5xl sm:text-7xl leading-[1.05] mb-6"
          >
            Real people.
            <br />
            Licensed performance.
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg sm:text-xl text-ul-platinum/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A consent-based marketplace of real human performers — categorised by
            archetype, delivered by API. For film, advertising, gaming, and creator
            content.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={WAITLIST_MAILTO}
              className="px-6 py-3 rounded-full bg-ul-cyan text-ul-charcoal font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Join the waitlist
            </a>
            <a
              href={WAITLIST_MAILTO}
              className="px-6 py-3 rounded-full border border-ul-platinum/30 text-ul-platinum text-sm hover:border-ul-cyan hover:text-ul-cyan transition-colors"
            >
              Apply as a performer
            </a>
          </motion.div>
          <motion.p {...fadeUp(0.4)} className="text-xs text-ul-platinum/40 mt-4">
            No public waitlist form yet — the links above open an email to the team.
          </motion.p>

          {/* Trust badges — text-only per the spec's minimal aesthetic, no icons yet */}
          <motion.p
            {...fadeUp(0.5)}
            className="font-ul-body text-sm text-ul-platinum/70 mt-10 tracking-[0.05em]"
          >
            No FAKES Act compliant · C2PA watermarked · Consent-first verified
          </motion.p>
        </section>

        {/* Problem */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-ul-navy/60">
          <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold text-center mb-10 max-w-2xl mx-auto">
            The gap between "I need that face" and "I can afford that face" is enormous.
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {PROBLEM_COLUMNS.map((c, i) => (
              <motion.div key={c.title} {...fadeUp(0.1 + i * 0.08)} className="rounded-xl border border-ul-navy p-6">
                <p className="font-ul-heading font-semibold text-lg mb-2">{c.title}</p>
                <p className="text-sm text-ul-platinum/60 leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp(0.4)} className="text-center italic text-ul-platinum/50">
            There's a fourth option. It was always real.
          </motion.p>
        </section>

        {/* Product reveal */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-ul-navy/60">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <h2 className="font-ul-heading text-3xl sm:text-4xl font-semibold mb-3">Understudy Labs</h2>
            <p className="text-ul-platinum/60">A marketplace of real performers. Consented. Contracted. Available by API.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.number} {...fadeUp(0.1 + i * 0.1)}>
                <span className="font-ul-heading text-3xl text-ul-cyan/70">{s.number}</span>
                <h3 className="font-ul-heading text-xl font-semibold mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-ul-platinum/60 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-ul-navy/60">
          <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold text-center mb-10">
            What gets made with Understudy
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {USE_CASES.map((u, i) => (
              <motion.div
                key={u.title}
                {...fadeUp(0.05 + i * 0.05)}
                className="rounded-xl border-t-2 border-t-ul-cyan bg-ul-navy/30 p-5"
              >
                <span className="text-2xl">{u.icon}</span>
                <h3 className="font-ul-heading font-semibold text-base mt-2 mb-1.5">{u.title}</h3>
                <p className="text-sm text-ul-platinum/60 leading-relaxed">{u.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Archetypes teaser */}
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-ul-navy/60">
          <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold text-center mb-3">
            The roster
          </motion.h2>
          <motion.p {...fadeUp(0.05)} className="text-center text-ul-platinum/50 mb-10">
            A preview of the archetype library. Full roster available post-launch.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ARCHETYPES.map((a, i) => (
              <motion.div key={a.name} {...fadeUp(0.05 + i * 0.05)} className="rounded-xl border border-ul-navy p-5">
                <p className="font-ul-heading font-semibold text-ul-cyan mb-1.5">{a.name}</p>
                <p className="text-sm text-ul-platinum/60 leading-relaxed">{a.line}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Differentiation */}
        <section className="border-t border-ul-navy/60 bg-ul-navy/20">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold mb-6">
              Not AI-generated. Not scraped. Not a deepfake.
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="text-ul-platinum/70 leading-relaxed">
              Every performer on the Understudy roster is a real human who chose to be
              here. They signed a full consent contract. They control their prohibited
              use list. They receive 30–40% of every render fee — automatically, per
              usage. The technology is just delivery. The performance was always real.
            </motion.p>
          </div>
        </section>

        {/* Pricing preview */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-ul-navy/60">
          <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold text-center mb-10">
            Start at $49/month. Scale to enterprise.
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TIERS.map((t, i) => (
              <motion.div key={t.name} {...fadeUp(0.1 + i * 0.08)} className="rounded-xl border border-ul-navy p-6 text-center">
                <p className="font-ul-heading font-semibold text-lg mb-1">{t.name}</p>
                <p className="font-ul-heading text-2xl text-ul-cyan mb-2">{t.price}</p>
                <p className="text-sm text-ul-platinum/60">{t.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Performer CTA */}
        <section className="max-w-3xl mx-auto px-6 py-16 border-t border-ul-navy/60 text-center">
          <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold mb-4">
            Are you an Understudy?
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-ul-platinum/60 mb-8 leading-relaxed">
            If you've been told you carry a certain energy — a founder, a rebel, a sage —
            we want to talk. Join the roster. Set your terms. Earn on every render.
          </motion.p>
          <motion.a
            {...fadeUp(0.2)}
            href={WAITLIST_MAILTO}
            className="inline-block px-6 py-3 rounded-full bg-ul-cyan text-ul-charcoal font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Apply to perform
          </motion.a>
        </section>

        <footer className="border-t border-ul-navy/60">
          <div className="max-w-4xl mx-auto px-6 py-10 text-center">
            <p className="text-xs text-ul-platinum/40 leading-relaxed max-w-xl mx-auto">
              All content rendered via Understudy Labs is digitally watermarked and carries
              licensed performer metadata. Understudy Labs does not create AI-generated
              faces or operate without performer consent.
            </p>
            <Link to="/" className="inline-block mt-6 text-sm text-ul-platinum/50 hover:text-ul-cyan transition-colors">
              ← Back to krispyking.com
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}
