"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Tab {
  label: string
  href: string
}

interface SectionTabsProps {
  tabs: Tab[]
}

export function SectionTabs({ tabs }: SectionTabsProps) {
  const pathname = usePathname()

  return (
    <div className="border-b border-border mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <nav className="flex gap-0 min-w-max">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
