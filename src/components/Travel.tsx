import { motion, useInView } from 'framer-motion'
import { useRef, useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ISO 3166-1 numeric code → year first visited (null = pre-passport data, always shown)
const COUNTRY_FIRST_YEAR: Record<string, number | null> = {
  '250': null,  // France
  '380': null,  // Italy
  '528': null,  // Netherlands
  '72':  1993,  // Botswana
  '508': 1993,  // Mozambique
  '710': 1993,  // South Africa
  '894': 1993,  // Zambia
  '504': 1995,  // Morocco
  '356': 1999,  // India
  '404': 1999,  // Kenya
  '454': 1999,  // Malawi
  '764': 1999,  // Thailand
  '834': 1999,  // Tanzania
  '36':  2000,  // Australia
  '68':  2000,  // Bolivia
  '152': 2000,  // Chile
  '258': 2000,  // French Polynesia
  '360': 2000,  // Indonesia
  '418': 2000,  // Laos
  '458': 2000,  // Malaysia
  '604': 2000,  // Peru
  '702': 2000,  // Singapore
  '780': 2000,  // Trinidad & Tobago
  '826': 2000,  // United Kingdom
  '840': 2000,  // United States
  '192': 2004,  // Cuba
  '646': 2004,  // Rwanda
  '800': 2004,  // Uganda
  '344': 2008,  // Hong Kong
  '156': 2008,  // China
  '392': 2008,  // Japan
  '446': 2008,  // Macau
  '608': 2008,  // Philippines
  '158': 2008,  // Taiwan
  '116': 2009,  // Cambodia
  '704': 2009,  // Vietnam
  '716': 1995,  // Zimbabwe
  '410': 2011,  // South Korea
  '408': 2013,  // North Korea
  '76':  2014,  // Brazil
}

const COUNTRY_NAMES: Record<string, string> = {
  '250': 'France', '380': 'Italy', '528': 'Netherlands',
  '72': 'Botswana', '508': 'Mozambique', '710': 'South Africa',
  '894': 'Zambia', '504': 'Morocco',
  '356': 'India', '404': 'Kenya', '454': 'Malawi',
  '764': 'Thailand', '834': 'Tanzania',
  '36': 'Australia', '68': 'Bolivia', '152': 'Chile',
  '258': 'French Polynesia', '360': 'Indonesia', '418': 'Laos',
  '458': 'Malaysia', '604': 'Peru', '702': 'Singapore',
  '780': 'Trinidad & Tobago', '826': 'United Kingdom', '840': 'United States',
  '192': 'Cuba', '646': 'Rwanda', '800': 'Uganda',
  '344': 'Hong Kong', '156': 'China', '392': 'Japan',
  '446': 'Macau', '608': 'Philippines', '158': 'Taiwan',
  '116': 'Cambodia', '704': 'Vietnam', '716': 'Zimbabwe',
  '410': 'South Korea', '408': 'North Korea', '76': 'Brazil',
}

// Number of recorded visits per country (from passport records + Excel)
const COUNTRY_VISIT_COUNT: Record<string, number> = {
  '250': 2,  '380': 1,  '528': 1,
  '72':  1,  '508': 1,  '710': 5,  '894': 1,  '504': 1,
  '716': 3,  '356': 2,  '404': 1,  '454': 1,
  '764': 13, '834': 1,
  '36':  1,  '68':  1,  '152': 2,  '258': 1,  '360': 9,
  '418': 3,  '458': 12, '604': 1,  '702': 3,  '780': 1,
  '826': 1,  '840': 9,
  '192': 1,  '646': 1,  '800': 1,
  '344': 2,  '156': 4,  '392': 3,  '446': 15, '608': 9,
  '158': 2,  '116': 1,  '704': 2,  '410': 3,  '408': 1,  '76': 1,
}

function visitColor(count: number): string {
  if (count >= 10) return '#78350f'  // 10+ visits — very dark amber
  if (count >= 4)  return '#b45309'  // 4–9 visits — dark amber
  if (count >= 2)  return '#d97706'  // 2–3 visits — medium amber
  return '#f59e0b'                    // 1 visit — standard amber
}

const MILESTONES: Record<number, string> = {
  1993: 'Southern Africa',
  1995: 'Morocco · Zimbabwe',
  1999: 'India · East Africa',
  2000: '+12 countries — SE Asia & Americas',
  2004: 'Cuba · East Africa',
  2008: 'East Asia · China',
  2009: 'Indochina',
  2011: 'South Korea',
  2013: '🇰🇵 Pyongyang',
  2014: 'Brazil',
}

const MIN_YEAR = 1993
const MAX_YEAR = 2026

export default function Travel() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedYear, setSelectedYear] = useState(MAX_YEAR)
  const [tooltip, setTooltip] = useState<{ name: string; year: number | null; visits: number } | null>(null)

  const visitedCodes = useMemo(() => {
    const codes = new Set<string>()
    for (const [iso, yr] of Object.entries(COUNTRY_FIRST_YEAR)) {
      if (yr === null || yr <= selectedYear) codes.add(iso)
    }
    return codes
  }, [selectedYear])

  const newThisYear = useMemo(() => {
    const codes = new Set<string>()
    for (const [iso, yr] of Object.entries(COUNTRY_FIRST_YEAR)) {
      if (yr === selectedYear) codes.add(iso)
    }
    return codes
  }, [selectedYear])

  const trackPct = ((selectedYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
  const milestone = MILESTONES[selectedYear]

  return (
    <section id="travel" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text-primary mb-3">
            40 Countries. Zero Regrets.
          </h2>
          <p className="text-text-secondary text-lg">
            Drag the timeline to watch the map fill up.
          </p>
        </motion.div>

        {/* Year Slider */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-border p-6 mb-6"
          style={{ background: '#1a2235' }}
        >
          <div className="flex items-baseline justify-between mb-5">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-5xl font-bold text-accent">{selectedYear}</span>
              <span className="text-text-secondary text-sm">
                {selectedYear === MAX_YEAR ? '— all time' : ''}
              </span>
            </div>
            <div className="text-right">
              <span className="font-serif text-4xl font-bold text-text-primary">
                {visitedCodes.size}
              </span>
              <span className="text-text-secondary text-sm ml-1">countries</span>
            </div>
          </div>

          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${trackPct}%, #374151 ${trackPct}%, #374151 100%)`,
            }}
          />

          <div className="flex justify-between mt-2 text-xs text-text-secondary select-none">
            <span>{MIN_YEAR}</span>
            {milestone && (
              <span className="text-accent font-medium text-center px-2">{milestone}</span>
            )}
            <span>Now</span>
          </div>

          {newThisYear.size > 0 && (
            <p className="mt-4 text-sm text-accent border-t border-border/50 pt-4">
              +{newThisYear.size} new in {selectedYear}:{' '}
              <span className="text-text-secondary">
                {[...newThisYear].map(iso => COUNTRY_NAMES[iso]).filter(Boolean).join(' · ')}
              </span>
            </p>
          )}
        </motion.div>

        {/* World Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl overflow-hidden border border-border mb-3"
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
                  const visited = visitedCodes.has(id)
                  const isNew = newThisYear.has(id)
                  const visits = COUNTRY_VISIT_COUNT[id] ?? 1
                  const fill = isNew ? '#fde68a' : visited ? visitColor(visits) : '#1f2937'
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="#0a0f1a"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: 'none' },
                        hover: {
                          outline: 'none',
                          fill: visited ? '#fde68a' : '#374151',
                          cursor: visited ? 'pointer' : 'default',
                        },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => {
                        if (!visited) return
                        const name =
                          COUNTRY_NAMES[id] ||
                          (geo.properties?.name as string | undefined) ||
                          id
                        setTooltip({ name, year: COUNTRY_FIRST_YEAR[id] ?? null, visits })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
          <div className="border-t border-border py-2 px-4 min-h-[32px] flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              {tooltip ? (
                <>
                  <span className="text-text-primary">{tooltip.name}</span>
                  {tooltip.year ? ` · first visited ${tooltip.year}` : ' · visited (pre-records)'}
                  {tooltip.visits > 1 ? ` · ${tooltip.visits} visits recorded` : ''}
                </>
              ) : (
                'Hover a country for details'
              )}
            </span>
            <span className="text-xs text-text-secondary flex items-center gap-3 select-none">
              <span>Visits:</span>
              <span><span style={{ color: '#f59e0b' }}>■</span> 1</span>
              <span><span style={{ color: '#d97706' }}>■</span> 2–3</span>
              <span><span style={{ color: '#b45309' }}>■</span> 4–9</span>
              <span><span style={{ color: '#78350f' }}>■</span> 10+</span>
            </span>
          </div>
        </motion.div>

        <p className="text-xs text-text-secondary mb-12 text-center">
          Data from passport records · Lighter = first visited at selected year
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
