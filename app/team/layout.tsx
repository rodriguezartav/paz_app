"use client"

import { AppShell } from "@/components/app-shell"
import { SectionTabs } from "@/components/section-tabs"

const teamTabs = [
  { label: "Members", href: "/team" },
  { label: "Schedule", href: "/team/schedule" },
  { label: "Tasks", href: "/team/tasks" },
]

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground">Manage staff and schedules</p>
        </div>
        <SectionTabs tabs={teamTabs} />
        {children}
      </div>
    </AppShell>
  )
}
