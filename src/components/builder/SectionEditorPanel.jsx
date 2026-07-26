import { useState } from 'react'
import { GripVertical, Plus, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import PanelHeader from './PanelHeader'

// Field values are uncontrolled (defaultValue) — nothing reads them back out
// yet (this panel is a shell, not wired to the live template), so tracking
// every keystroke in state would be indirection with no observable effect.
// Only list *structure* (which items exist, in what order) is real state,
// since add/remove changes what renders.
const FIELD_CLASS = 'border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-white/20'

let idCounter = 0
function nextId() {
  idCounter += 1
  return `field-${idCounter}`
}

function Field({ label, textarea, className, ...props }) {
  const Comp = textarea ? Textarea : Input
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-white/50">{label}</span>
      <Comp className={`${FIELD_CLASS} ${className ?? ''}`} {...props} />
    </label>
  )
}

function FieldGroup({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      {title && <p className="text-xs font-semibold tracking-wide text-white/30 uppercase">{title}</p>}
      {children}
    </div>
  )
}

function ImagePreview({ src, alt }) {
  return (
    <div className="flex items-center gap-3">
      <img src={src} alt={alt} className="h-14 w-14 shrink-0 rounded-lg border border-white/10 object-cover" />
      <button
        type="button"
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        Replace photo
      </button>
    </div>
  )
}

function ChipList({ items, onChange }) {
  const [draft, setDraft] = useState('')

  function addChip() {
    const value = draft.trim()
    if (!value) return
    onChange([...items, value])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-1 rounded-full bg-white/10 py-1 pr-1.5 pl-3 text-xs text-white"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="rounded-full p-0.5 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addChip()
            }
          }}
          placeholder="Add a role…"
          className={`h-8 text-xs ${FIELD_CLASS}`}
        />
        <button
          type="button"
          onClick={addChip}
          className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 text-white/60 hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function ListEditor({ items, onChange, addLabel, makeItem, renderItem }) {
  function removeItem(id) {
    onChange(items.filter((item) => item.id !== id))
  }
  function addItem() {
    onChange([...items, makeItem()])
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <GripVertical className="h-3.5 w-3.5 cursor-grab text-white/30" />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="rounded-md p-1 text-white/40 hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2.5">{renderItem(item)}</div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 py-2.5 text-xs font-medium text-white/50 transition-colors hover:border-white/30 hover:text-white/70"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  )
}

function HeroFields() {
  const [roles, setRoles] = useState(['Designer', 'Developer', 'Storyteller'])

  return (
    <div className="flex flex-col gap-5">
      <FieldGroup title="Photo">
        <ImagePreview src="/faizur.jpg" alt="Matt" />
      </FieldGroup>

      <FieldGroup>
        <Field label="Eyebrow" defaultValue="Branding · Product Design" />
        <Field label="Headline" defaultValue="Hi, I'm Matt." />
      </FieldGroup>

      <FieldGroup title="Rotating roles">
        <ChipList items={roles} onChange={setRoles} />
      </FieldGroup>

      <FieldGroup>
        <Field
          label="Subtext"
          textarea
          rows={3}
          defaultValue="I specialize in crafting engaging digital experiences that elevate brands and drive results."
        />
      </FieldGroup>

      <FieldGroup title="Button">
        <Field label="Label" defaultValue="Contact me" />
        <Field label="Email" placeholder="you@email.com" />
      </FieldGroup>
    </div>
  )
}

function ProjectsFields() {
  const [projects, setProjects] = useState([
    { id: nextId(), client: 'Dazzle Inc.', title: 'Dazzle © Branding' },
    { id: nextId(), client: 'CareSunset', title: 'Healthcare Mobile App' },
    { id: nextId(), client: 'Tech Bank Client', title: 'Technical Infographic' },
    { id: nextId(), client: 'Notex', title: 'Extend & Support - App Plugin' },
  ])

  return (
    <div className="flex flex-col gap-5">
      <FieldGroup title="Featured project">
        <Field label="Client" defaultValue="Booking Corp." />
        <Field label="Title" defaultValue="Fintech Dello Banking App" />
      </FieldGroup>

      <FieldGroup title="Grid projects">
        <ListEditor
          items={projects}
          onChange={setProjects}
          addLabel="Add project"
          makeItem={() => ({ id: nextId(), client: '', title: '' })}
          renderItem={(item) => (
            <>
              <Field label="Client" defaultValue={item.client} />
              <Field label="Title" defaultValue={item.title} />
            </>
          )}
        />
      </FieldGroup>
    </div>
  )
}

function AboutFields() {
  return (
    <div className="flex flex-col gap-5">
      <FieldGroup title="Photo">
        <ImagePreview src="/workme.webp" alt="Matt at his desk" />
      </FieldGroup>

      <FieldGroup>
        <Field label="Heading" defaultValue="About me" />
      </FieldGroup>

      <FieldGroup title="Paragraphs">
        <Field
          textarea
          rows={4}
          label="Paragraph 1"
          defaultValue="I'm a dedicated product designer with a passion for creating fun and intuitive experiences. Over the last 7 years I've worked across many industries — from mobile applications to web products — translating ideas into effective, highly-crafted solutions."
        />
        <Field
          textarea
          rows={3}
          label="Paragraph 2"
          defaultValue="My approach is grounded in research and collaboration. I believe the best results come from understanding the end-user and working closely with the team, with clear communication and an open mind."
        />
        <Field
          textarea
          rows={3}
          label="Paragraph 3"
          defaultValue="Outside of work, I enjoy staying up to date with the latest design trends and tools — I'm always learning, which helps me bring fresh ideas to every project."
        />
      </FieldGroup>
    </div>
  )
}

function WorkFields() {
  const [roles, setRoles] = useState([
    {
      id: nextId(),
      company: 'Google',
      role: 'Senior Product Designer',
      period: '2022 — Present',
      description:
        'Leading design for core search experiences, partnering closely with engineering and research to ship features used by billions of people daily.',
      tags: 'Design Systems, Research, Search',
    },
    {
      id: nextId(),
      company: 'Meta',
      role: 'Product Designer',
      period: '2019 — 2022',
      description: 'Designed cross-platform social features for Instagram, focusing on creator tools and community engagement.',
      tags: 'Mobile, Social, Prototyping',
    },
    {
      id: nextId(),
      company: 'Airbnb',
      role: 'UX Designer',
      period: '2017 — 2019',
      description: 'Shaped end-to-end booking flows and trust & safety experiences, running dozens of user research studies along the way.',
      tags: 'UX Research, Booking Flows, Trust & Safety',
    },
    {
      id: nextId(),
      company: 'Apple',
      role: 'Design Intern',
      period: '2016 — 2017',
      description: 'Contributed to visual design explorations for iOS system apps as part of the Human Interface team.',
      tags: 'iOS, Visual Design, HIG',
    },
  ])

  return (
    <ListEditor
      items={roles}
      onChange={setRoles}
      addLabel="Add role"
      makeItem={() => ({ id: nextId(), company: '', role: '', period: '', description: '', tags: '' })}
      renderItem={(item) => (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Company" defaultValue={item.company} />
            <Field label="Period" defaultValue={item.period} />
          </div>
          <Field label="Role" defaultValue={item.role} />
          <Field label="Description" textarea rows={3} defaultValue={item.description} />
          <Field label="Tags (comma separated)" defaultValue={item.tags} />
        </>
      )}
    />
  )
}

function TestimonialsFields() {
  const [testimonials, setTestimonials] = useState([
    {
      id: nextId(),
      name: 'Alex Rivera',
      role: 'Creative Director',
      company: 'Dazzle Inc.',
      quote:
        'Working with Matt completely transformed our brand identity. The attention to detail and creative vision exceeded everything we imagined.',
    },
    {
      id: nextId(),
      name: 'Priya Nandan',
      role: 'Head of Product',
      company: 'CareSunset',
      quote: 'Our appointment booking flow finally feels effortless. Patient engagement is up, and our support tickets have dropped significantly.',
    },
    {
      id: nextId(),
      name: 'Jordan Lee',
      role: 'VP of Design',
      company: 'Tech Bank Client',
      quote: 'The infographic work made a genuinely complex product feel simple to understand. Our sales team uses it in every pitch now.',
    },
    {
      id: nextId(),
      name: 'Sam Okafor',
      role: 'Founder',
      company: 'Notex',
      quote: "Matt didn't just design a plugin, he rethought the entire onboarding experience. Our activation rate nearly doubled.",
    },
  ])

  return (
    <ListEditor
      items={testimonials}
      onChange={setTestimonials}
      addLabel="Add testimonial"
      makeItem={() => ({ id: nextId(), name: '', role: '', company: '', quote: '' })}
      renderItem={(item) => (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Name" defaultValue={item.name} />
            <Field label="Company" defaultValue={item.company} />
          </div>
          <Field label="Role" defaultValue={item.role} />
          <Field label="Quote" textarea rows={3} defaultValue={item.quote} />
        </>
      )}
    />
  )
}

function LinkListEditor({ items, onChange, addLabel }) {
  return (
    <ListEditor
      items={items}
      onChange={onChange}
      addLabel={addLabel}
      makeItem={() => ({ id: nextId(), label: '', href: '' })}
      renderItem={(item) => (
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Label" defaultValue={item.label} />
          <Field label="Link" defaultValue={item.href} />
        </div>
      )}
    />
  )
}

function FooterFields() {
  const [navLinks, setNavLinks] = useState([
    { id: nextId(), label: 'Work', href: '#work' },
    { id: nextId(), label: 'About', href: '#about' },
    { id: nextId(), label: 'Contact', href: '#contact' },
  ])
  const [socialLinks, setSocialLinks] = useState([
    { id: nextId(), label: 'Dribbble', href: '#dribbble' },
    { id: nextId(), label: 'Instagram', href: '#instagram' },
  ])

  return (
    <div className="flex flex-col gap-5">
      <FieldGroup>
        <Field label="Heading" textarea rows={2} defaultValue="Let's build something cool together" />
      </FieldGroup>

      <FieldGroup title="Nav links">
        <LinkListEditor items={navLinks} onChange={setNavLinks} addLabel="Add link" />
      </FieldGroup>

      <FieldGroup title="Social links">
        <LinkListEditor items={socialLinks} onChange={setSocialLinks} addLabel="Add social" />
      </FieldGroup>

      <FieldGroup>
        <Field label="Button label" defaultValue="Let's talk" />
      </FieldGroup>
    </div>
  )
}

const SECTION_FIELDS = {
  hero: HeroFields,
  projects: ProjectsFields,
  about: AboutFields,
  work: WorkFields,
  testimonials: TestimonialsFields,
  footer: FooterFields,
}

export default function SectionEditorPanel({ sectionKey, label, onClose, hideHeader = false }) {
  const Fields = SECTION_FIELDS[sectionKey]

  return (
    // min-w matches BuilderShell's THEMES_MIN_PX — same reasoning as
    // ThemesPanel: the side panel animates its own width, so this needs a
    // stable floor to be revealed via clipping rather than squished.
    <div className="flex h-full min-w-[260px] flex-col bg-[#18181b] text-white">
      {!hideHeader && <PanelHeader title={`Edit ${label}`} onClose={onClose} />}
      <div className="flex-1 overflow-y-auto px-4 py-4">{Fields && <Fields />}</div>
    </div>
  )
}
