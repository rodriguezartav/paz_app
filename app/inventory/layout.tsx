"use client"

import { AppShell } from "@/components/app-shell"
import { SectionTabs } from "@/components/section-tabs"

const inventoryTabs = [
  { label: "Current Stock", href: "/inventory" },
  { label: "Low Stock", href: "/inventory/low-stock" },
  { label: "Waste Log", href: "/inventory/waste" },
]

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">Track stock levels and manage waste</p>
        </div>
        <SectionTabs tabs={inventoryTabs} />
        {children}
      </div>
    </AppShell>
  )
}
