import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const LEGAL_SHIELDS = [
  {
    icon: '✓',
    title: 'C2PA Verification',
    body: 'Every render carries cryptographic proof of authenticity and performer consent. Clients can verify the chain of custody.',
  },
  {
    icon: '🛡️',
    title: 'Archetype Protection',
    body: 'You are not playing a celebrity. You are playing an archetype. Zero right-of-publicity exposure. Your archetype, your rules.',
  },
  {
    icon: '⛔',
    title: 'Automated Veto',
    body: 'Set prohibited use cases in your contract. Political campaigns? Deepfake detection tests? Denied. You control every render.',
  },
]

const ARCHETYPES = [
  { name: 'The Visionary', line: 'The person in the room who sees ten years ahead.' },
  { name: 'The Maverick', line: 'The one who rewrites the rules while everyone else is still reading them.' },
  { name: 'The Sage', line: 'The one everyone eventually comes to for the real answer.' },
  { name: 'The Rebel', line: 'The one who says what everyone else is thinking but won\'t.' },
  { name: 'The Architect', line: 'The one who makes complicated things look inevitable.' },
  { name: 'The Champion', line: 'The one who shows up every time, for everyone.' },
]

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
      <path d="M4 10V4h6" />
      <path d="M28 10V4h-6" />
      <path d="M4 22v6h6" />
      <path d="M22 4h6v6" />
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
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState('performer')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('understudy_waitlist')
        .insert([
          {
            email,
            user_type: userType,
            created_at: new Date().toISOString(),
          },
        ])
      if (error) throw error
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 4000)
    } catch (err) {
      console.error('Waitlist submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ul-charcoal text-ul-platinum font-ul-body">
      {/* Header */}
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
        {/* Hero — Performer-Focused Pivot */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.p
            {...fadeUp()}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-ul-cyan mb-6"
          >
            Your likeness. Your terms. Your revenue.
          </motion.p>
          <motion.h1
            {...fadeUp(0.1)}
            className="font-ul-heading font-semibold text-5xl sm:text-7xl leading-[1.05] mb-6"
          >
            Own your<br />digital performance.
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg sm:text-xl text-ul-platinum/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Get discovered. Get contracted. Get paid for every render. No impersonation. No deepfakes. You control every use.
          </motion.p>

          {/* Waitlist Form */}
          <motion.form {...fadeUp(0.3)} onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-full bg-ul-navy/40 text-ul-platinum placeholder-ul-platinum/40 border border-ul-platinum/20 focus:outline-none focus:border-ul-cyan"
            />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="px-4 py-3 rounded-full bg-ul-navy/40 text-ul-platinum border border-ul-platinum/20 focus:outline-none focus:border-ul-cyan"
            >
              <option value="performer">Performer</option>
              <option value="client">Client</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-ul-cyan text-ul-charcoal font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Apply Now'}
            </button>
          </motion.form>

          {submitted && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-ul-cyan">
              ✓ Welcome to the roster!
            </motion.p>
          )}

          <motion.p {...fadeUp(0.4)} className="text-xs text-ul-platinum/40">
            No FAKES Act compliant · C2PA watermarked · Consent-first verified
          </motion.p>
        </section>

        {/* Legal Shield Grid — Three-Column */}
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-ul-navy/60">
          <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold text-center mb-12">
            You are protected.
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {LEGAL_SHIELDS.map((shield, i) => (
              <motion.div
                key={shield.title}
                {...fadeUp(0.1 + i * 0.08)}
                className="rounded-xl border border-ul-navy bg-ul-navy/20 p-8 text-center"
              >
                <div className="text-4xl mb-3">{shield.icon}</div>
                <h3 className="font-ul-heading font-semibold text-lg mb-2">{shield.title}</h3>
                <p className="text-sm text-ul-platinum/60 leading-relaxed">{shield.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-ul-navy/60">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <h2 className="font-ul-heading text-3xl sm:text-4xl font-semibold mb-3">The Understudy Path</h2>
            <p className="text-ul-platinum/60">From application to recurring royalty in 4 steps.</p>
          </motion.div>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Apply', desc: 'Tell us your archetype and your limits.' },
              { num: '02', title: 'Capture', desc: 'Full likeness, voice, and movement session.' },
              { num: '03', title: 'Contract', desc: 'Sign your consent & prohibited-use agreement.' },
              { num: '04', title: 'Earn', desc: '30–40% royalty on every render, automatically.' },
            ].map((step, i) => (
              <motion.div key={step.num} {...fadeUp(0.1 + i * 0.08)}>
                <span className="font-ul-heading text-3xl text-ul-cyan/70">{step.num}</span>
                <h3 className="font-ul-heading font-semibold text-base mt-2 mb-1.5">{step.title}</h3>
                <p className="text-sm text-ul-platinum/60 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Archetypes */}
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-ul-navy/60">
          <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold text-center mb-12">
            Which archetype are you?
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ARCHETYPES.map((a, i) => (
              <motion.div key={a.name} {...fadeUp(0.05 + i * 0.05)} className="rounded-xl border border-ul-navy bg-ul-navy/10 p-6">
                <p className="font-ul-heading font-semibold text-ul-cyan mb-2">{a.name}</p>
                <p className="text-sm text-ul-platinum/60 leading-relaxed italic">{a.line}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Understudy */}
        <section className="border-t border-ul-navy/60 bg-ul-navy/20">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold mb-6">
              Not a deepfake. Not a celebrity. You.
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="text-ul-platinum/70 leading-relaxed">
              You choose to be here. You set your terms. You get paid. The clients know who they're hiring — a real performer with a distinctive archetype and verified consent. No hidden identity. No legal exposure. Just recurring royalty on your own likeness, your way.
            </motion.p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-16 border-t border-ul-navy/60 text-center">
          <motion.h2 {...fadeUp()} className="font-ul-heading text-2xl sm:text-3xl font-semibold mb-4">
            Ready to perform?
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-ul-platinum/60 mb-8 leading-relaxed">
            Apply now. The roster is invitation-only during this phase, but every application gets reviewed.
          </motion.p>
          <motion.button
            {...fadeUp(0.2)}
            onClick={() => {
              document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-block px-6 py-3 rounded-full bg-ul-cyan text-ul-charcoal font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Apply to the Roster
          </motion.button>
        </section>

        <footer className="border-t border-ul-navy/60">
          <div className="max-w-4xl mx-auto px-6 py-10 text-center">
            <p className="text-xs text-ul-platinum/40 leading-relaxed max-w-xl mx-auto">
              All content rendered via Understudy Labs carries C2PA verification and performer consent metadata. Performers maintain full control over prohibited use cases via automated veto. Understudy does not create AI-generated faces or operate without explicit performer agreement.
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