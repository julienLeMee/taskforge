"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/user-nav';
import { useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">
            Task<span className="text-primary">Forge</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {session?.user ? (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserNav user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image
              }} />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="hidden space-x-4 sm:flex">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="default" size="sm">Inscription</Button>
                </Link>
              </div>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
