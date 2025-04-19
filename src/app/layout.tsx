// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

// Chargement de la police Inter
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskForge - Gestion de Projets Personnels',
  description: 'Application de gestion de projets et tâches personnelles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className
      )}>
        {children}
      </body>
    </html>
  );
}
