import { useCallback, useState } from 'react'
import EditableSection from './builder/EditableSection'
import Navbar from './Navbar'
import Hero from './Hero'
import FeaturedProject from './FeaturedProject'
import ProjectGrid from './ProjectGrid'
import AboutMe from './AboutMe'
import WorkExperience from './WorkExperience'
import Testimonials from './Testimonials'
import Footer from './Footer'
import SmoothScroll from './SmoothScroll'

export default function HomePage() {
  const [footerHeight, setFooterHeight] = useState(0)
  const handleFooterHeight = useCallback((height) => setFooterHeight(height), [])

  return (
    <>
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
              actions={[{ key: 'add', label: 'Add project' }, 'hide', 'rearrange']}
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
    </>
  )
}
