"use client"

import { AppShell } from "@/components/app-shell"
import { SectionTabs } from "@/components/section-tabs"

const shoppingTabs = [
  { label: "Current List", href: "/shopping" },
  { label: "Suppliers", href: "/shopping/suppliers" },
  { label: "Order History", href: "/shopping/history" },
]

export default function ShoppingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shopping</h1>
          <p className="text-muted-foreground">Manage shopping lists and suppliers</p>
        </div>
        <SectionTabs tabs={shoppingTabs} />
        {children}
      </div>
    </AppShell>
  )
}
