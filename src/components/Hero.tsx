import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ROTATING_LINES = [
  'Entrepreneur',
  'AI Builder',
  'Juggler (literally)',
  'Recovering Workaholic',
  'Permanently Curious',
  'Went to North Korea. On purpose.',
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % ROTATING_LINES.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1526 50%, #0a0f1a 100%)' }}
    >
      {/* Subtle animated blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            width: 600,
            height: 600,
            top: '-10%',
            left: '-15%',
            background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
            animationDuration: '6s',
          }}
        />
        <div
          className="absolute rounded-full opacity-5 blur-3xl animate-pulse"
          style={{
            width: 500,
            height: 500,
            bottom: '-10%',
            right: '-10%',
            background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
            animationDuration: '9s',
            animationDelay: '2s',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-6xl sm:text-7xl md:text-8xl font-bold text-text-primary mb-4"
        >
          KrispyKing
        </motion.h1>

        <div className="h-10 sm:h-12 mb-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-xl sm:text-2xl font-sans font-medium text-accent"
            >
              {ROTATING_LINES[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Hong Kong. 20+ years building things that matter across Asia.
          Now building AI agents, passion projects, and the occasional
          circus trick.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#about"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-accent text-bg-primary font-semibold text-base hover:bg-accent-soft transition-colors"
          >
            Explore ↓
          </a>
          <a
            href="https://www.chrisransford.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-accent text-accent font-semibold text-base hover:bg-accent hover:text-bg-primary transition-colors"
          >
            chrisransford.com ↗
          </a>
        </motion.div>
      </div>
    </section>
  )
}
