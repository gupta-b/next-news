"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, UserCog, Contact, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"

const routes = [
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/admin/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
    color: "text-violet-500",
  },
  {
    label: "Roles",
    icon: UserCog,
    href: "/admin/roles",
    color: "text-pink-700",
  },
  {
    label: "Contacts",
    icon: Contact,
    href: "/admin/contacts",
    color: "text-orange-500",
  },
  {
    label: "Posts",
    icon: FileText,
    href: "admin/posts",
    color: "text-emerald-500",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle, close } = useSidebar()

  return (
    <>
      <div className={cn("fixed inset-0 z-20 bg-black/50 lg:hidden", isOpen ? "block" : "hidden")} onClick={close} />
      <aside
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 flex-col bg-card shadow-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={close}>
            <BarChart3 className="h-6 w-6" />
            <span>Admin Dashboard</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={close}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className={cn("h-5 w-5", route.color)} />
                <span>{route.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

