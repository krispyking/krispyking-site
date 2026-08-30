import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Hobbies from './components/Hobbies'
import Travel from './components/Travel'
import AIJourney from './components/AIJourney'
import Now from './components/Now'
import Projects from './components/Projects'
import Connect from './components/Connect'
import Footer from './components/Footer'
import AIPage from './pages/AIPage'
import UnderstudyLabsPage from './pages/UnderstudyLabsPage'
import GentlemanPage from './pages/GentlemanPage'
import GentlemanResultsPage from './pages/GentlemanResultsPage'

function HomePage() {
  return (
    <main className="bg-bg-primary text-text-primary">
      <Hero />
      <About />
      <Hobbies />
      <Travel />
      <AIJourney />
      <Now />
      <Projects />
      <Connect />
      <Footer />
    </main>
  )
}

// The KrispyKing personal-site nav shouldn't appear on /understudylabs or /gentleman —
// each is its own brand identity, not a section of this site — so both are routed as
// siblings with no shared layout rather than nested under the Nav-wrapped routes below.
function MainSite() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai" element={<AIPage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/understudylabs" element={<UnderstudyLabsPage />} />
        <Route path="/gentleman" element={<GentlemanPage />} />
        <Route path="/gentleman/results" element={<GentlemanResultsPage />} />
        <Route path="/*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  )
}
