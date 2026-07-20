import { useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedProject from './components/FeaturedProject'
import ProjectGrid from './components/ProjectGrid'
import AboutMe from './components/AboutMe'
import WorkExperience from './components/WorkExperience'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import CursorTrail from './components/CursorTrail'
import { CursorProvider } from './context/CursorContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  const [footerHeight, setFooterHeight] = useState(0)
  const handleFooterHeight = useCallback((height) => setFooterHeight(height), [])

  return (
    <ThemeProvider>
      <CursorProvider>
        <CursorTrail />
        <Navbar />

        <SmoothScroll extraScroll={footerHeight}>
          <div className="pt-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <Hero />
              <FeaturedProject />
              <ProjectGrid />

              <AboutMe />

              <WorkExperience />

              <Testimonials />
            </div>
          </div>
        </SmoothScroll>

        <Footer onHeightChange={handleFooterHeight} />
      </CursorProvider>
    </ThemeProvider>
  )
}
