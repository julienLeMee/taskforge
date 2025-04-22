"use client"

import {
//   LayoutDashboard,
  FolderKanban,
  CheckSquare,
//   Calendar,
//   Settings,
//   Users,
  Menu,
  ArrowUpDown,
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { ThemeToggle } from "@/components/theme-toggle"

// Menu items
const items = [
//   {
//     title: "Tableau de bord",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
  {
    title: "Priorités",
    href: "/priorities",
    icon: ArrowUpDown,
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
//   {
//     title: "Calendrier",
//     href: "/calendar",
//     icon: Calendar,
//   },
//   {
//     title: "Équipe",
//     href: "/team",
//     icon: Users,
//   },
//   {
//     title: "Paramètres",
//     href: "/settings",
//     icon: Settings,
//   },
]

function NavigationMenu({ pathname }: { pathname: string }) {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
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
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5 hover:cursor-pointer" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Menu de navigation principal de l&apos;application TaskForge
          </SheetDescription>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold">
                  Task<span className="text-primary">Forge</span>
                </span>
              </Link>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <NavigationMenu pathname={pathname} />
              </SidebarGroupContent>
            </SidebarGroup>

            {session?.user && (
              <div className="flex items-center justify-end p-4 mt-auto">
                <ThemeToggle />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <SidebarProvider>
        <Sidebar className="hidden border-r lg:block" collapsible="icon">
          <SidebarContent>
            <div className="flex items-center justify-between pt-4 p-2">
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
                <NavigationMenu pathname={pathname} />
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
    </>
  )
}
