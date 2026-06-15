import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const HOBBIES = [
  {
    icon: '🤹',
    title: 'Juggling & Circus Skills',
    desc: 'Started with 3 balls. Progressed to clubs, rings, and devil sticks. Circus skills are the perfect metaphor for life — keep multiple things in the air without dropping them.',
  },
  {
    icon: '🪄',
    title: 'Magic',
    desc: 'Sleight of hand. Close-up card magic. The kind that makes people genuinely confused. The best icebreaker in any meeting.',
  },
  {
    icon: '🥊',
    title: 'Boxing',
    desc: 'Not for fitness. For the discipline, the focus, and the honesty of a sport that tells you exactly where you stand.',
  },
  {
    icon: '🏂',
    title: 'Snowboarding',
    desc: 'Japan is home. Niseko, Hakuba, Rusutsu. If there\'s powder, I\'ll find it.',
  },
  {
    icon: '⛳',
    title: 'Golf',
    desc: 'The most frustrating game ever invented. Also the most social. Still playing. Handicap classified.',
  },
  {
    icon: '⚽',
    title: 'Football',
    desc: 'Played competitively across Asia for years. Once played a match in North Korea against a professional team. We lost. Worth every second.',
  },
]

export default function Hobbies() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="hobbies" className="py-24 px-6 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text-primary mb-3">
            Things I Actually Do
          </h2>
          <p className="text-text-secondary text-lg">
            Not interests. Not "enjoy in my spare time". Things I actually do.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOBBIES.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl p-6 border border-border hover:border-accent transition-colors group"
              style={{ background: '#1a2235' }}
            >
              <span className="text-3xl mb-3 block">{h.icon}</span>
              <h3 className="font-serif text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                {h.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
