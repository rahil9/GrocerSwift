import type React from "react"
import { Navbar } from "@/components/navbar"
import { MobileNavigation } from "@/components/mobile-navigation"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNavigation />
    </div>
  )
}

