import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, CreditCard, Globe, LogOut, Shield, User } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

const NAV_ITEMS = [
  { key: 'account', label: 'Account', icon: User },
  { key: 'domains', label: 'Domains', icon: Globe },
  { key: 'subscription', label: 'Subscription', icon: CreditCard },
  { key: 'security', label: 'Security', icon: Shield },
]

// Matches the always-dark builder chrome (TopNav, NavDrawer) rather than the
// template-theme CSS vars — this dialog is app UI, not part of the live
// portfolio preview, so it shouldn't shift with the template's own theme.
const OUTLINE_BUTTON_CLASS = 'border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white'

function Divider() {
  return <div className="h-px bg-white/10" />
}

function AccountPanel() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <div className="mt-3 mb-4 h-px bg-white/10" />
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback className="bg-white/10 text-sm text-white">P</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-white">Your Name</p>
            <p className="text-xs text-white/50">you@example.com</p>
          </div>
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="text-lg font-semibold text-white">System</h2>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">Sign out from this device</p>
            <p className="text-xs text-white/50">You are signed in as you@example.com</p>
          </div>
          <Button variant="outline" size="sm" className={OUTLINE_BUTTON_CLASS}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </section>
    </div>
  )
}

function DomainsPanel() {
  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">Base domain</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Connected
          </span>
        </div>
        <p className="mt-2 text-xs text-white/50">
          This is your current Pearl link. You can change your username anytime (if it's available).
        </p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex h-9 flex-1 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-3">
            <input
              defaultValue="yourname"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none"
            />
            <span className="shrink-0 text-sm text-white/40">.pearl.dev</span>
          </div>
          <Button variant="outline" className={OUTLINE_BUTTON_CLASS}>
            Change username
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Published &amp; optimized
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            Updated 8 days ago
          </span>
        </div>
      </section>

      <Divider />

      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">Custom domain</h2>
          <span className="rounded-full bg-[#FF553E] px-2 py-0.5 text-xs font-semibold text-white">PRO</span>
        </div>
        <p className="mt-2 text-xs text-white/50">Use your own domain — make your portfolio truly yours</p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            placeholder="www.site.com"
            className="h-9 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/30"
          />
          <Button className="bg-white text-[#0a0a0a] hover:bg-white/90">Add domain</Button>
        </div>
      </section>
    </div>
  )
}

function SubscriptionPanel() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-white">Plan &amp; Billing</h2>
        <div className="mt-3 mb-4 h-px bg-white/10" />
        <div className="divide-y divide-white/10 rounded-lg border border-white/10">
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-white/50">Plan</span>
            <span className="font-medium text-white">Lifetime</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-white/50">Status</span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Active
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-white/50">Renews on</span>
            <span className="font-medium text-white">Dec 10, 2027</span>
          </div>
        </div>
      </section>

      <Divider />

      <p className="text-sm text-white/50">
        Questions?{' '}
        <a href="mailto:support@pearl.dev" className="text-white underline underline-offset-2 hover:text-white/80">
          support@pearl.dev
        </a>
      </p>
    </div>
  )
}

function SecurityPanel() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">Danger zone</h2>
      <p className="mt-1 text-xs text-white/50">Delete your account and account data. This can't be undone.</p>
      <Button className="mt-4 bg-red-600 text-white hover:bg-red-500">Delete account</Button>
    </section>
  )
}

function PanelBody({ activeTab }) {
  if (activeTab === 'account') return <AccountPanel />
  if (activeTab === 'domains') return <DomainsPanel />
  if (activeTab === 'subscription') return <SubscriptionPanel />
  return <SecurityPanel />
}

function DesktopNav({ activeTab, onSelect }) {
  return (
    <div className="flex w-48 shrink-0 flex-col gap-1 border-r border-white/10 p-3">
      <p className="px-2 pb-2 text-xs font-semibold tracking-wide text-white/40 uppercase">Settings</p>
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={
            'relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm font-medium ' +
            (activeTab === key ? 'text-white' : 'text-white/60 hover:text-white')
          }
        >
          {activeTab === key && (
            <motion.div
              layoutId="settings-nav-indicator"
              className="absolute inset-0 rounded-md bg-white/10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            />
          )}
          <Icon className="relative z-10 size-4" />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  )
}

function MobileNavStrip({ activeTab, onSelect }) {
  return (
    <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-white/10 px-4 py-2">
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={
            'relative flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ' +
            (activeTab === key ? 'text-white' : 'text-white/60 hover:text-white')
          }
        >
          {activeTab === key && (
            <motion.div
              layoutId="settings-nav-indicator"
              className="absolute inset-0 rounded-md bg-white/10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            />
          )}
          <Icon className="relative z-10 size-3.5" />
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </div>
  )
}

export default function AccountSettingsModal({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState('account')
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="flex h-[85vh] flex-col gap-0 rounded-t-xl border-white/10 bg-[#18181b] p-0 text-white [&>button]:text-white/60 [&>button]:hover:text-white"
        >
          <SheetHeader className="border-b border-white/10 p-4">
            <SheetTitle className="text-white">Settings</SheetTitle>
            <SheetDescription className="sr-only">
              Manage your account, domain, subscription and security settings.
            </SheetDescription>
          </SheetHeader>
          <MobileNavStrip activeTab={activeTab} onSelect={setActiveTab} />
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <PanelBody activeTab={activeTab} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeClassName="text-white/60 hover:text-white"
        className="flex h-[600px] w-full max-w-3xl gap-0 overflow-hidden rounded-lg border-white/10 bg-[#18181b] p-0 text-white sm:max-w-3xl"
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your account, domain, subscription and security settings.
        </DialogDescription>
        <DesktopNav activeTab={activeTab} onSelect={setActiveTab} />
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <PanelBody activeTab={activeTab} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
