import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
// import { Header } from '@/components/header';
import { SessionProvider } from 'next-auth/react';
import { auth } from '../../auth';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskForge - Gestion de Projets Personnels',
  description: 'Application de gestion de projets et tâches personnelles',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className
      )}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange
          >
            <div className="relative min-h-screen">
              {/* <Header /> */}
              <SidebarProvider>
                <div className="flex flex-1">
                  <AppSidebar />
                  {session ? (
                    <main className="flex-1 p-4">
                      <div className="flex items-center justify-end">
                        <ThemeToggle />
                      </div>
                      {children}
                    </main>
                  ) : (
                    <main className="flex-1">
                      {children}
                    </main>
                  )}
                </div>
              </SidebarProvider>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
