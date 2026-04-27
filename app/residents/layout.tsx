import { AppShell } from "@/components/app-shell"
import { SectionTabs } from "@/components/section-tabs"

const tabs = [
  { label: "Current", href: "/residents" },
  { label: "Check-In", href: "/residents/check-in" },
  { label: "Details", href: "/residents/details" },
]

export default function ResidentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Residents</h1>
          <p className="text-muted-foreground mt-1">
            Manage guests and check-ins at Paz Corcovado
          </p>
        </div>
        <SectionTabs tabs={tabs} />
        {children}
      </div>
    </AppShell>
  )
}
