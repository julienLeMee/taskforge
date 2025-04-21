"use client"

import { useSession } from "next-auth/react"
import { UserNav } from "@/components/user-nav"

export function UserNavClient() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <UserNav
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      }}
    />
  )
}
