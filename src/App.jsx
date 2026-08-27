import { Route, Routes } from 'react-router-dom'
import BuilderShell from './components/builder/BuilderShell'
import HomePage from './components/HomePage'
import ProjectPage from './components/ProjectPage'
import LandingPage from './components/LandingPage'
import BlogPage from './components/BlogPage'
import BlogPostPage from './components/BlogPostPage'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import SignupPage from './components/SignupPage'
import ScrollToTop from './components/ScrollToTop'
import CursorTrail from './components/CursorTrail'
import { CursorProvider } from './context/CursorContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="*"
          element={
            <BuilderShell>
              <CursorProvider>
                <CursorTrail />

                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects/:slug" element={<ProjectPage />} />
                </Routes>
              </CursorProvider>
            </BuilderShell>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}
