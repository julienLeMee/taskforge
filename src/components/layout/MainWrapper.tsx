"use client";

import { useSession } from "next-auth/react";

interface MainWrapperProps {
  children: React.ReactNode;
}

export function MainWrapper({ children }: MainWrapperProps) {
  const { data: session } = useSession();

  return (
    <main className={`${session ? 'flex-1 p-4' : 'flex-1'}`}>
      {children}
    </main>
  );
}
