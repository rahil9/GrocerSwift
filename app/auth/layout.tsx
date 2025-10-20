import type React from "react"
// Create a special layout for auth pages that doesn't include the Navbar

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

