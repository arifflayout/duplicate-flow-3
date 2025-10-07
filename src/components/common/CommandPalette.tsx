import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Command } from "cmdk"
import { useAuth } from "@/contexts/AuthContext"
import { useProject } from "@/contexts/ProjectContext"
import { cn } from "@/lib/utils"
import { Search, LayoutDashboard, MapPin, FileText, Users, Hammer, FileCheck, Construction, DollarSign, ClipboardCheck, MessageSquare, Bell, User, Plus, LogOut } from "lucide-react"

// Global Command Palette (Cmd/Ctrl+K)
// - Navigate quickly across app views and routes
// - Trigger common actions (new project, profile, sign out)

const isTypingElement = (el: EventTarget | null) => {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName?.toLowerCase()
  return (
    tag === "input" ||
    tag === "textarea" ||
    (el as HTMLElement).isContentEditable
  )
}

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { projects } = useProject()

  // Hotkeys: Cmd/Ctrl+K to toggle; Esc to close
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        if (isTypingElement(e.target)) return
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const close = () => {
    setOpen(false)
    setValue("")
  }

  const navigateView = (viewId: string) => {
    // Broadcast to Index page to switch its internal view
    // Using CustomEvent keeps it decoupled from routing
    const evt = new CustomEvent<string>("app:navigateView", { detail: viewId })
    window.dispatchEvent(evt)
    // Ensure we are on the home route where the views live
    navigate("/")
    close()
  }

  const go = (path: string) => {
    navigate(path)
    close()
  }

  const signOut = () => {
    logout()
    navigate("/login")
    close()
  }

  if (!open) return null

  return (
    <div aria-hidden className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={close} />

      {/* Palette */}
      <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-2xl">
        <div className="rounded-xl border border-border/60 bg-card text-card-foreground shadow-2xl overflow-hidden">
          <Command label="Global Search" shouldFilter value={value} onValueChange={setValue} className="w-full">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60 bg-surface-50/60">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Command.Input
                placeholder="Search projects, people, and actions..."
                autoFocus
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground/70 text-sm py-2"
              />
              <kbd className="ml-auto text-[10px] text-muted-foreground/70">ESC</kbd>
            </div>

            <Command.List className="max-h-[60vh] overflow-y-auto py-2">
              <Command.Empty className="px-4 py-6 text-sm text-muted-foreground">No results found.</Command.Empty>

              <Command.Group heading="Navigate" className="px-2">
                <CommandItem onSelect={() => navigateView("dashboard")} icon={<LayoutDashboard className="h-4 w-4" />}>Dashboard</CommandItem>
                <CommandItem onSelect={() => navigateView("projects")} icon={<FileText className="h-4 w-4" />}>Projects</CommandItem>
                <CommandItem onSelect={() => navigateView("land-marketplace")} icon={<MapPin className="h-4 w-4" />}>Land Marketplace</CommandItem>
                <CommandItem onSelect={() => navigateView("consultants")} icon={<Users className="h-4 w-4" />}>Consultants</CommandItem>
                <CommandItem onSelect={() => navigateView("contractors")} icon={<Hammer className="h-4 w-4" />}>Contractors</CommandItem>
                <CommandItem onSelect={() => navigateView("design-approval")} icon={<FileCheck className="h-4 w-4" />}>Design & Approval</CommandItem>
                <CommandItem onSelect={() => navigateView("cpm")} icon={<Construction className="h-4 w-4" />}>Project Managers</CommandItem>
                <CommandItem onSelect={() => navigateView("financing")} icon={<DollarSign className="h-4 w-4" />}>Financing</CommandItem>
                <CommandItem onSelect={() => navigateView("compliance")} icon={<ClipboardCheck className="h-4 w-4" />}>Compliance</CommandItem>
                <CommandItem onSelect={() => navigateView("messages")} icon={<MessageSquare className="h-4 w-4" />}>Messages</CommandItem>
                <CommandItem onSelect={() => navigateView("notifications")} icon={<Bell className="h-4 w-4" />}>Notifications</CommandItem>
              </Command.Group>

              {projects.length > 0 && (
                <>
                  <Command.Separator className="my-2" />
                  <Command.Group heading="Projects" className="px-2">
                    {projects.slice(0, 5).map((project) => (
                      <CommandItem 
                        key={project.id}
                        onSelect={() => go(`/project/${project.id}`)} 
                        icon={<Building2 className="h-4 w-4" />}
                      >
                        {project.title}
                      </CommandItem>
                    ))}
                  </Command.Group>
                </>
              )}

              <Command.Separator className="my-2" />

              <Command.Group heading="Actions" className="px-2">
                <CommandItem onSelect={() => navigateView("project-brief")} icon={<Plus className="h-4 w-4" />}>New Project</CommandItem>
                <CommandItem onSelect={() => go("/profile")} icon={<User className="h-4 w-4" />}>Open Profile</CommandItem>
                {user ? (
                  <CommandItem onSelect={signOut} icon={<LogOut className="h-4 w-4" />}>Sign Out</CommandItem>
                ) : null}
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      </div>
    </div>
  )
}

function CommandItem({ onSelect, icon, children }: { onSelect: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={cn(
        "group flex items-center gap-3 w-full cursor-pointer select-none rounded-md px-3 py-2 text-sm",
        "aria-selected:bg-accent aria-selected:text-accent-foreground",
        "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <div className="text-muted-foreground group-aria-selected:text-foreground">
        {icon}
      </div>
      <span className="truncate">{children}</span>
    </Command.Item>
  )
}
