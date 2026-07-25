import { BarChart3, Briefcase, ExternalLink, LayoutGrid, Palette, Wand2 } from 'lucide-react'
import SparkleIcon from './SparkleIcon'

export const LEFT_NAV_ITEMS = [
  { icon: LayoutGrid, label: 'Portfolio Builder', active: true },
  { icon: Briefcase, label: 'Jobs', active: false },
  { icon: Wand2, label: 'AI Tools', active: false },
]

export const TOP_NAV_ACTIONS = [
  { icon: SparkleIcon, label: 'Upgrade' },
  { icon: Palette, label: 'Themes' },
  { icon: BarChart3, label: 'Insights' },
  { icon: ExternalLink, label: 'Open site' },
]
