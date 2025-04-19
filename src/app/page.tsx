// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Task<span className="text-primary">Forge</span>
        </h1>
        <p className="text-xl text-center max-w-lg">
          Application de gestion de projets personnels pour organiser efficacement vos tâches et projets.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/signin">
            <Button variant="default" size="lg">Connexion</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" size="lg">Inscription</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
