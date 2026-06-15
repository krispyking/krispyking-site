import Hero from './components/Hero'
import About from './components/About'
import Hobbies from './components/Hobbies'
import Travel from './components/Travel'
import Projects from './components/Projects'
import AIJourney from './components/AIJourney'
import Connect from './components/Connect'
import Footer from './components/Footer'

export default function App() {
  return (
    <main className="bg-bg-primary text-text-primary">
      <Hero />
      <About />
      <Hobbies />
      <Travel />
      <Projects />
      <AIJourney />
      <Connect />
      <Footer />
    </main>
  )
}
