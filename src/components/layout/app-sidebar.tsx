"use client"

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Settings,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
//   SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { ThemeToggle } from "@/components/theme-toggle"

// Menu items
const items = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projets",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Tâches",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Calendrier",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Équipe",
    href: "/team",
    icon: Users,
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <SidebarProvider>
      <Sidebar className="hidden border-r lg:block" collapsible="icon">
        <SidebarContent>
          <div className="flex items-center justify-between p-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold group-data-[collapsible=icon]:hidden pl-2">
                Task<span className="text-primary">Forge</span>
              </span>
            </Link>
            <SidebarTrigger />
          </div>
          <SidebarGroup>
            {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center space-x-3",
                            isActive && "text-primary"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {session?.user && (
            <div className="flex items-center justify-end p-2 mt-auto">
              <ThemeToggle />
            </div>
          )}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
