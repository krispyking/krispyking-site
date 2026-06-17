import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type Status = 'Live' | 'Beta' | 'Concept'

const STATUS_STYLES: Record<Status, string> = {
  Live:    'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  Beta:    'text-amber-400 border-amber-400/30 bg-amber-400/5',
  Concept: 'text-gray-400 border-gray-400/30 bg-gray-400/5',
}

const PROJECTS: {
  icon: string
  title: string
  desc: string
  url?: string
  badge: string
  status: Status
}[] = [
  {
    icon: '☕',
    title: 'Sijahtra',
    desc: 'Luxury wild Kopi Luwak sourced from the Gayo Highlands, Sumatra. Positioned at the very top end of the market. Full e-commerce with gift options.',
    url: 'https://www.sijahtra.com',
    badge: 'E-Commerce / Luxury',
    status: 'Live',
  },
  {
    icon: '🏠',
    title: 'Fractal Homes',
    desc: '3D real estate platform. Property search reimagined with immersive spatial experiences.',
    url: 'https://fractalhomes.app',
    badge: 'PropTech / 3D',
    status: 'Beta',
  },
  {
    icon: '🎮',
    title: 'theARgame',
    desc: 'Location-based augmented reality gaming. Decode your city. Connect 4 in the real world.',
    url: 'https://theargame.krispyking.com',
    badge: 'AR / Gaming',
    status: 'Beta',
  },
  {
    icon: '🐬',
    title: 'Dolphins Intuition',
    desc: "Using Google's DolphinGemma AI to decode dolphin vocalisations. Because why not try to talk to dolphins.",
    url: 'https://dolphinsintuition.krispyking.com',
    badge: 'AI / Research',
    status: 'Beta',
  },
  {
    icon: '🔍',
    title: 'LocateAMate',
    desc: 'AI-powered CRM platform. Full fleet of specialist agents running ops, support, legal, marketing, and analytics.',
    url: 'https://www.locateamate.com',
    badge: 'AI / CRM',
    status: 'Live',
  },
  {
    icon: '🥽',
    title: 'HoloDive',
    desc: 'AI underwater goggle concept. Real-time species identification, dive logging, and underwater navigation. Waitlist coming soon.',
    badge: 'AI / Hardware / Concept',
    status: 'Concept',
  },
  {
    icon: '🔒',
    title: 'MyPrivacyTool',
    desc: "Privacy awareness platform. Know what data you're giving away and who has it.",
    url: 'https://www.myprivacytool.io',
    badge: 'Privacy / Consumer',
    status: 'Beta',
  },
  {
    icon: '🥊',
    title: 'BoxingTOOL',
    desc: 'AI-powered boxing media production and video automation platform. Content pipeline, brand management, and market intelligence — all agent-run.',
    url: 'https://boxingtool.krispyking.com',
    badge: 'AI / Media / Sports',
    status: 'Beta',
  },
  {
    icon: '🏢',
    title: '12E Block 5',
    desc: 'AI-managed residential property at Park Island, Hong Kong. A dedicated agent handles tenant management, lease reviews, maintenance scheduling, and admin — fully autonomous, human-in-the-loop for key decisions.',
    badge: 'PropTech / AI Agent',
    status: 'Live',
  },
  {
    icon: '🧊',
    title: '14 The Cube',
    desc: 'Hong Kong property asset with a dedicated AI brand custodian. The agent maintains brand guidelines, manages all external-facing content, and keeps documentation current — no brief required.',
    badge: 'PropTech / AI Agent',
    status: 'Live',
  },
]

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="py-24 px-6 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text-primary mb-3">
            What I'm Building
          </h2>
          <p className="text-text-secondary text-lg">
            Passion projects, AI experiments, and businesses in various states of done.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-2xl p-6 border-t-2 border-t-accent border border-border hover:border-accent transition-colors group flex flex-col"
              style={{ background: '#1a2235' }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{p.icon}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${STATUS_STYLES[p.status]}`}>
                  {p.status}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-4">
                {p.desc}
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs px-3 py-1 rounded-full font-medium text-accent border border-accent/30 bg-accent/5">
                  {p.badge}
                </span>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-secondary hover:text-accent transition-colors shrink-0"
                  >
                    Visit →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
