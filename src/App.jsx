import { Route, Routes } from 'react-router-dom'
import BuilderShell from './components/builder/BuilderShell'
import HomePage from './components/HomePage'
import ProjectPage from './components/ProjectPage'
import CursorTrail from './components/CursorTrail'
import { CursorProvider } from './context/CursorContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <BuilderShell>
        <CursorProvider>
          <CursorTrail />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
          </Routes>
        </CursorProvider>
      </BuilderShell>
    </ThemeProvider>
  )
}
