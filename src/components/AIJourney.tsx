import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const CARDS = [
  {
    title: 'The Idea',
    body: 'I got access to Claude and thought: what if I built not just one AI assistant, but an entire fleet? Each with its own identity, memory, and purpose. OpenClaw was born.',
  },
  {
    title: 'The Build',
    body: "52 agents. Each has a soul file — their identity, values, tone, and operating rules. They have memory. They have tasks. They talk to each other (through the router, obviously). Running on DigitalOcean in Singapore.",
  },
  {
    title: "What I've Learned",
    body: "AI is not magic. It's plumbing. The hard part is not the model — it's the architecture, the memory, the decision-making rules, and knowing when to let the agent act and when to ask a human first.",
  },
  {
    title: "What's Next",
    body: 'Autonomous revenue generation. Agents that close deals, manage customer relationships, and report back. The goal is a business that runs while I sleep.',
  },
]

export default function AIJourney() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="ai-journey" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text-primary mb-3">
            The AI Experiment
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl">
            What happens when a semi-retired enterprise sales guy builds 52 AI agents.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-6 border border-border"
              style={{ background: '#1a2235' }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-serif text-xl font-bold text-text-primary mb-3">
                {card.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-sm">{card.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <a
            href="https://www.chrisransford.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-soft font-semibold transition-colors"
          >
            Curious about the fleet? → chrisransford.com
          </a>
        </motion.div>
      </div>
    </section>
  )
}
