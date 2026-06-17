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

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai" element={<AIPage />} />
      </Routes>
    </BrowserRouter>
  )
}
