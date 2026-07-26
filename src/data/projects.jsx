import DashboardMockup from '../components/DashboardMockup'
import DazzleCard from '../components/cards/DazzleCard'
import HealthcareCard from '../components/cards/HealthcareCard'
import InfographicCard from '../components/cards/InfographicCard'
import AppPluginCard from '../components/cards/AppPluginCard'

// The featured project's mockup isn't self-contained like the grid cards
// (DazzleCard etc. already wrap themselves in their own rounded/sized box) —
// this wrapper gives it the same treatment so every entry's `Card` can be
// dropped in anywhere (project grid, project page) with identical markup.
function FeaturedMockupCard() {
  return (
    <div className="group cursor-none rounded-2xl bg-[var(--card)] h-[360px] flex items-center justify-center px-8 overflow-hidden transition-colors duration-500">
      <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
        <DashboardMockup />
      </div>
    </div>
  )
}

// Single source of truth for every project — the home page's Projects
// section and the /projects/:slug case-study page both read from this, so
// there's exactly one place that knows a project's title, client, and slug.
export const PROJECTS = [
  {
    slug: 'fintech-dello-banking-app',
    client: 'Booking Corp.',
    title: 'Fintech Dello Banking App',
    Card: FeaturedMockupCard,
    featured: true,
  },
  {
    slug: 'dazzle-branding',
    client: 'Dazzle Inc.',
    title: 'Dazzle © Branding',
    Card: DazzleCard,
  },
  {
    slug: 'healthcare-mobile-app',
    client: 'CareSunset',
    title: 'Healthcare Mobile App',
    Card: HealthcareCard,
  },
  {
    slug: 'technical-infographic',
    client: 'Tech Bank Client',
    title: 'Technical Infographic',
    Card: InfographicCard,
  },
  {
    slug: 'app-plugin-extend-support',
    client: 'Notex',
    title: 'Extend & Support - App Plugin',
    Card: AppPluginCard,
  },
]

export const FEATURED_PROJECT = PROJECTS.find((p) => p.featured)
export const GRID_PROJECTS = PROJECTS.filter((p) => !p.featured)

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug)
}
