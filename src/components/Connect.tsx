import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const SOCIALS = [
  {
    label: 'LinkedIn',
    icon: '💼',
    url: 'https://www.linkedin.com/in/chrisransford',
  },
  {
    label: 'X / Twitter',
    icon: '𝕏',
    url: 'https://x.com/krispyking',
  },
  {
    label: 'Instagram',
    icon: '📷',
    url: 'https://instagram.com/krispyking',
  },
  {
    label: 'GitHub',
    icon: '⌨️',
    url: 'https://github.com/krispyking',
  },
  {
    label: 'Email',
    icon: '✉️',
    url: 'mailto:cransford@gmail.com',
  },
]

export default function Connect() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="connect" className="py-24 px-6 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text-primary mb-3">
            Say Hello
          </h2>
          <p className="text-text-secondary text-lg">
            No cold pitches. No decks. No synergies. But yes to interesting humans.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 text-text-secondary leading-relaxed"
          >
            <p>
              I'm not looking for my next job. I'm not available for consulting retainers.
              But I am genuinely interested in curious people doing interesting things.
            </p>
            <p>If you've read this far, you're probably one of them.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {SOCIALS.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.url}
                target={s.url.startsWith('mailto') ? undefined : '_blank'}
                rel={s.url.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-border hover:border-accent hover:bg-accent/5 transition-all group"
                style={{ background: '#1a2235' }}
              >
                <span className="text-xl">{s.icon}</span>
                <span className="font-medium text-text-secondary group-hover:text-accent transition-colors text-sm">
                  {s.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
