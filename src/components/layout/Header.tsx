// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  // Ne pas afficher l'en-tête sur les pages d'authentification
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background px-4">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            Task<span className="text-primary">Forge</span>
          </Link>

          {/* Navigation principale */}
          {session && (
            <nav className="hidden md:flex ml-8 space-x-4">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                Tableau de bord
              </Link>
              <Link
                href="/projects"
                className="text-muted-foreground hover:text-foreground"
              >
                Projets
              </Link>
              <Link
                href="/tasks"
                className="text-muted-foreground hover:text-foreground"
              >
                Tâches
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">
                {session.user?.name || session.user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Inscription
                </Button>
              </Link>
            </div>
          )}
        <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
