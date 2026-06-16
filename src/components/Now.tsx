import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const NOW_ITEMS = [
  {
    label: 'Building',
    text: 'Expanding the OpenClaw agent fleet — 52 AI agents running across 8 businesses. Current focus: autonomous revenue generation and cross-agent collaboration.',
  },
  {
    label: 'Experimenting',
    text: "Dolphins Intuition — using DolphinGemma AI to decode cetacean vocalisations. Genuinely don't know if this will work. That's the point.",
  },
  {
    label: 'Shipping',
    text: 'theARgame v2. Location-based AR with real-world puzzle mechanics. Rolling out across Hong Kong.',
  },
  {
    label: 'Reading',
    text: 'Everything I can find on multi-agent orchestration, AI memory architectures, and what it actually means to run a business with no employees.',
  },
]

export default function Now() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="now" className="py-24 px-6 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-baseline gap-4 mb-3">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text-primary">
              Right Now
            </h2>
            <span className="text-xs text-text-secondary border border-border rounded-full px-3 py-1">
              June 2026
            </span>
          </div>
          <p className="text-text-secondary text-lg">
            What's actually on my desk this month.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {NOW_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-4 rounded-2xl p-5 border border-border"
              style={{ background: '#1a2235' }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-accent pt-0.5 w-20 shrink-0">
                {item.label}
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
