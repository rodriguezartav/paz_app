"use client"

import { AppShell } from "@/components/app-shell"
import { SectionTabs } from "@/components/section-tabs"

const plannerTabs = [
  { label: "Weekly View", href: "/planner" },
  { label: "Templates", href: "/planner/templates" },
]

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meal Planner</h1>
          <p className="text-muted-foreground">Plan meals and manage serving counts</p>
        </div>
        <SectionTabs tabs={plannerTabs} />
        {children}
      </div>
    </AppShell>
  )
}
