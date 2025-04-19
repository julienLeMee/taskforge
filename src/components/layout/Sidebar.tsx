"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Settings,
  Users,
} from "lucide-react";

const sidebarItems = [
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
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-16 border-r bg-background">
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
