import { ArrowUpDown, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'

// Shared icon/label map for builder hover-toolbar actions — used by both
// EditableSection (whole page sections) and EditableItem (individual items
// nested inside a section, e.g. one project card). A caller can override a
// resolved action's label by passing `{ key, label }` instead of the bare
// string key (e.g. 'hide' reads as "Hide section" at the section level but
// just "Hide" for a single item).
export const ACTION_CONFIG = {
  edit: { icon: Pencil, label: 'Edit' },
  add: { icon: Plus, label: 'Add' },
  hide: { icon: EyeOff, label: 'Hide section' },
  rearrange: { icon: ArrowUpDown, label: 'Rearrange' },
  delete: { icon: Trash2, label: 'Delete' },
}

export function resolveAction(action) {
  const key = typeof action === 'string' ? action : action.key
  const overrides = typeof action === 'string' ? null : action
  return { ...ACTION_CONFIG[key], key, ...overrides }
}
