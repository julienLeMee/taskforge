"use client";

import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

export function ThemeToggleWrapper() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center justify-end">
      <ThemeToggle />
    </div>
  );
}
