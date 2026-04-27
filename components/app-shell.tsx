"use client"

import { ReactNode } from "react"
import { SidebarNav } from "./sidebar-nav"
import { MobileBottomNav } from "./mobile-bottom-nav"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <SidebarNav />
      
      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  )
}
