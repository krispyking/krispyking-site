import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const STATS = [
  { value: '52', label: 'AI Agents in my fleet' },
  { value: '40', label: 'Countries visited' },
  { value: '20+', label: 'Years in APAC tech' },
  { value: '1', label: 'Football match in North Korea' },
]

function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl p-6 border border-border"
      style={{ background: '#1a2235' }}
    >
      <p className="font-serif text-4xl font-bold text-accent mb-1">{value}</p>
      <p className="text-sm text-text-secondary leading-snug">{label}</p>
    </motion.div>
  )
}

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="about" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text-primary mb-6">
              About
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                I've spent two decades selling enterprise technology across Asia Pacific —
                from Hong Kong to Tokyo, Singapore to Sydney. I've closed landmark deals,
                built high-performing teams, and learned that the best things in life
                happen when you stay curious and say yes to the unexpected.
              </p>
              <p>
                These days I'm semi-retired by design. I run a fleet of 52 AI agents,
                build passion projects at the intersection of tech and real life, and
                spend my time doing things I actually enjoy.
              </p>
              <p>
                Want the professional story?{' '}
                <a
                  href="https://www.chrisransford.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-soft underline underline-offset-2 transition-colors"
                >
                  → chrisransford.com
                </a>
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
