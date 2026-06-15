import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ISO 3166-1 numeric codes for visited countries
const VISITED = new Set([
  '826', // UK
  '372', // Ireland
  '250', // France
  '724', // Spain
  '620', // Portugal
  '380', // Italy
  '276', // Germany
  '528', // Netherlands
  '56',  // Belgium
  '756', // Switzerland
  '40',  // Austria
  '300', // Greece
  '203', // Czech Republic
  '616', // Poland
  '840', // USA
  '484', // Mexico
  '764', // Thailand
  '704', // Vietnam
  '392', // Japan
  '410', // South Korea
  '408', // North Korea
  '156', // China
  '702', // Singapore
  '458', // Malaysia
  '360', // Indonesia
  '608', // Philippines
  '356', // India
  '36',  // Australia
  '554', // New Zealand
  '784', // UAE
  '710', // South Africa
  '404', // Kenya
  '76',  // Brazil
  '32',  // Argentina
])

export default function Travel() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [tooltip, setTooltip] = useState('')

  return (
    <section id="travel" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text-primary mb-3">
            30+ Countries. Zero Regrets.
          </h2>
        </motion.div>

        {/* World Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl overflow-hidden border border-border mb-4"
          style={{ background: '#0d1526' }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 130, center: [15, 20] }}
            style={{ width: '100%', height: 'auto' }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const id = String(geo.id)
                  const visited = VISITED.has(id)
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={visited ? '#f59e0b' : '#1f2937'}
                      stroke="#0a0f1a"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: visited ? '#fbbf24' : '#374151' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => {
                        const name = geo.properties?.name as string | undefined
                        if (name) setTooltip(name)
                      }}
                      onMouseLeave={() => setTooltip('')}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
          {tooltip && (
            <div className="text-center py-2 text-xs text-text-secondary border-t border-border">
              {tooltip}
            </div>
          )}
        </motion.div>

        <p className="text-xs text-text-secondary mb-12 text-center">
          Amber = visited · Hover for country name
        </p>

        {/* Featured Adventure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl p-6 sm:p-8 border-l-4 border-l-accent border border-border"
          style={{ background: '#1a2235' }}
        >
          <p className="text-2xl mb-3">⚽</p>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-text-primary mb-4">
            The North Korea Match
          </h3>
          <p className="text-text-secondary leading-relaxed mb-4">
            In 2013, a Hong Kong amateur football team — the Spartans — travelled to Pyongyang
            to play against North Korean professional footballers. I was on that team.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            We played in front of a crowd in one of the most closed countries on earth,
            experienced a side of North Korea that almost no outsiders ever see, and lost
            the match (obviously).
          </p>
          <p className="text-text-secondary leading-relaxed mb-6">
            It remains one of the most extraordinary things I have ever done.
          </p>
          <a
            href="https://www.scmp.com/sport/hong-kong/article/1320253/hong-kong-amateur-soccer-team-take-north-korean-professionals"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-soft font-semibold transition-colors"
          >
            Read the SCMP story →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
