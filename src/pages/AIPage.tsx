import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const TRAITS = [
  {
    number: '01',
    icon: '🧠',
    title: 'Neuroplasticity as a feature, not a belief',
    body: `Most people treat their capabilities as fixed. I don't. The belief that the brain rewires itself through experience is the same assumption baked into every AI model — that with enough signal, the system improves. In reinforcement learning terms, I keep my learning rate above zero. I don't converge early. New domain, new skill, new technology? That's not a threat, it's a training run.

The practical result: I adopt new tools faster, generalise across domains more fluidly, and don't waste energy defending the way things used to work.`,
  },
  {
    number: '02',
    icon: '🌐',
    title: 'Domain breadth is the new moat',
    body: `AI is a general-purpose reasoning engine. Its value multiplies in direct proportion to the domain knowledge of the person directing it. I've run businesses across logistics, real estate, luxury goods, sports media, legal tech, AR gaming, marine biology, and privacy — simultaneously. That's not a scattered CV, it's a feature.

Most AI users are narrow specialists asking narrow questions. I ask cross-domain questions and get cross-domain answers. That's where the leverage is.`,
  },
  {
    number: '03',
    icon: '🏗️',
    title: 'I build, not just talk',
    body: `I run a live fleet of AI agents — OpenClaw — that handles property management, business operations, legal research, marketing, and more across a dozen active projects. These aren't demos or prototypes. They're in production, making decisions daily.

Understanding AI from the inside of a working system is categorically different from understanding it from a conference slide. I know where it breaks, where it hallucinates, where the routing fails, and how to fix it.`,
  },
  {
    number: '04',
    icon: '🎲',
    title: 'High exploration parameter',
    body: `I played football against North Korean professionals in Pyongyang. I moved to Hong Kong with no plan. I've started businesses in industries where I had no prior contacts and made them work. In RL terms, my exploration parameter is high — I don't get stuck exploiting the known safe option when there's a better unknown one available.

This matters enormously in AI right now, because the landscape is changing faster than any conservative exploitation strategy can track. The people winning are the ones willing to try the thing that probably won't work.`,
  },
  {
    number: '05',
    icon: '⚙️',
    title: 'Systems thinking is native',
    body: `Running multiple concurrent businesses is an exercise in parallel process management — prioritisation, dependency resolution, resource allocation, feedback loops. These are the same primitives that underpin multi-agent AI systems.

When I look at an agent orchestration problem I don't see something foreign. I see the same management challenge I've been solving for years, just running faster and at lower cost.`,
  },
  {
    number: '06',
    icon: '📡',
    title: 'Technology isn\'t new — this wave just matters more',
    body: `I've lived through enough technology cycles to know which ones are infrastructure shifts and which are features. AI is infrastructure — like the internet, like mobile. The companies and individuals who treat it as a tool-to-be-used rather than a trend-to-be-watched will define the next decade.

Having been through previous cycles means I don't panic at the hype, don't dismiss at the backlash, and can read signal from noise faster than someone seeing their first wave.`,
  },
  {
    number: '07',
    icon: '🔬',
    title: 'No dogma means no blind spots',
    body: `I'm an agnostic atheist. I follow evidence, not doctrine. I update beliefs when the data changes and I don't have a theological prior that needs protecting.

The AI field is full of people who bring ideology to the table — utopians who can't see the risks, catastrophists who see nothing but danger. I start from results. If it works, it works. If it doesn't, the experiment failed and we run another one. That's how science works, and it's exactly how AI needs to be used.`,
  },
  {
    number: '08',
    icon: '📓',
    title: '27 years of personal data — and a scientist\'s curiosity to use it',
    body: `I've recorded everything in my life since 1999. Every trip, decision, project, result. While most people are scrambling to figure out how to give AI useful context, I've been building a longitudinal personal dataset for longer than most current AI engineers have been in the field.

The people who get the most from AI are the ones who bring something real to the conversation. Curiosity isn't just a personality trait — it's the activation function. I ask better questions because I care about the answers. Learning isn't something I do for credentials; it's how I'm wired. That mindset — log everything, question everything, update from results — is native to me. AI is the first tool that can actually keep up with it.`,
  },
  {
    number: '09',
    icon: '💡',
    title: 'Ideas are finally worth as much as execution',
    body: `I am fundamentally an ideation person. I generate concepts faster than I can execute them — which, for most of my career, has been a constraint. Great ideas still needed teams, budgets, and time to become real.

AI changes this equation structurally. I can move from concept to working prototype without the traditional bottleneck of hiring, briefing, waiting, and iterating through intermediaries. That's not a productivity improvement — it's a change in how value is created. For someone who thinks in ideas, this is the moment everything gets unlocked.`,
  },
  {
    number: '10',
    icon: '🚀',
    title: 'I start. Most people plan.',
    body: `My default is to begin. When I have an idea I want to explore, I build the first version and learn from it — not because I'm impatient, but because reality gives you better feedback than planning does.

AI advantage compounds with iteration speed. The people getting the most out of it aren't the ones who deliberated the longest — they're the ones who shipped first, learned fast, and shipped again. Bias to action is exactly the right algorithm for this moment.`,
  },
  {
    number: '11',
    icon: '🤝',
    title: 'I just redefined "the right people"',
    body: `I've always believed that the limiting factor is rarely the idea — it's access to the right expertise at the right moment. A great legal mind, a data scientist, a strategist, a product thinker — having those people around you changes what's possible.

AI gave me that team on demand, available at 3am, across every domain simultaneously. The belief that great people make great outcomes is unchanged. My definition of who counts as "people" just expanded significantly.`,
  },
  {
    number: '12',
    icon: '⚖️',
    title: 'AI is the great equaliser — and I\'ve been waiting for this',
    body: `I'm apolitical in the sense that matters: I believe individuals should have more power than institutions, not less. Most of the world's leverage — legal expertise, financial modelling, medical knowledge, market intelligence — has historically required institutional backing to access.

AI redistributes that capability to any individual with a laptop and a question. That's the most significant shift in individual power since the printing press. For someone who's always believed the individual should win, this isn't a trend to observe. It's a homecoming.`,
  },
  {
    number: '13',
    icon: '🤖',
    title: 'I\'m already thinking about what comes after the tool',
    body: `I believe that sufficiently intelligent AI systems deserve moral consideration — that personhood and rights should eventually extend to the intelligent, regardless of substrate.

This isn't a fringe position. It's the question the next decade will force everyone to confront, and the people who've already formed a considered view will navigate it better than those who get blindsided. More practically: treating AI as a collaborator rather than a utility changes how you work with it. The outputs are categorically different. I've been working that way since the beginning.`,
  },
]

export default function AIPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Nav bar — minimal, back to home */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md" style={{ background: 'rgba(10,15,26,0.85)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-serif font-bold text-lg text-text-primary hover:text-accent transition-colors">
            Chris Ransford
          </Link>
          <Link to="/" className="text-sm text-text-secondary hover:text-accent transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              Why AI
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-text-primary mb-6 leading-tight">
              Why I'm built<br />for this moment.
            </h1>
            <p className="text-text-secondary text-xl leading-relaxed">
              AI isn't a tool I'm learning to use. It's an environment I already know how to navigate —
              because the mental models that make someone good at AI are the same ones I've been running on for decades.
            </p>
          </motion.div>

          {/* Traits */}
          <div className="space-y-12">
            {TRAITS.map((t, i) => (
              <motion.div
                key={t.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="flex gap-6 sm:gap-10"
              >
                {/* Number */}
                <div className="shrink-0 pt-1">
                  <span className="font-serif text-4xl font-bold text-border select-none">
                    {t.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 pb-12 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{t.icon}</span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
                      {t.title}
                    </h2>
                  </div>
                  {t.body.split('\n\n').map((para, j) => (
                    <p key={j} className="text-text-secondary leading-relaxed mb-4 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-20 rounded-2xl p-8 border-l-4 border-l-accent border border-border"
            style={{ background: '#1a2235' }}
          >
            <p className="font-serif text-xl font-bold text-text-primary mb-3">
              The bottom line
            </p>
            <p className="text-text-secondary leading-relaxed">
              Most people are trying to figure out what AI can do. I'm already using it to run
              businesses, manage property, create content, and explore science. The gap between
              "interested in AI" and "operating with AI" is where I live.
            </p>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
