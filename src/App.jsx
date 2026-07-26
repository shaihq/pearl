import { useCallback, useState } from 'react'
import BuilderShell from './components/builder/BuilderShell'
import EditableSection from './components/builder/EditableSection'
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
      <BuilderShell>
        <CursorProvider>
          <CursorTrail />

          <Navbar />

          <SmoothScroll extraScroll={footerHeight}>
            <div className="pt-24">
              <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <EditableSection sectionKey="hero" label="Hero" actions={['edit']}>
                  <Hero />
                </EditableSection>

                <EditableSection
                  sectionKey="projects"
                  label="Projects"
                  actions={['edit', { key: 'add', label: 'Add project' }, 'hide', 'rearrange']}
                >
                  <FeaturedProject />
                  <ProjectGrid />
                </EditableSection>

                <EditableSection sectionKey="about" label="About Me" actions={['edit', 'hide']}>
                  <AboutMe />
                </EditableSection>

                <EditableSection sectionKey="work" label="Work Experience" actions={['edit', 'hide', 'rearrange']}>
                  <WorkExperience />
                </EditableSection>

                <EditableSection sectionKey="testimonials" label="Testimonials" actions={['edit', 'hide', 'rearrange']}>
                  <Testimonials />
                </EditableSection>
              </div>
            </div>
          </SmoothScroll>

          <EditableSection
            sectionKey="footer"
            label="Footer"
            actions={['edit']}
            wrapperClassName="fixed inset-x-0 bottom-0 z-0"
          >
            <Footer onHeightChange={handleFooterHeight} />
          </EditableSection>
        </CursorProvider>
      </BuilderShell>
    </ThemeProvider>
  )
}
