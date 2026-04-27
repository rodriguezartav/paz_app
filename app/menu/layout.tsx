import { AppShell } from "@/components/app-shell"
import { SectionTabs } from "@/components/section-tabs"

const tabs = [
  { label: "Meals", href: "/menu" },
  { label: "Recipes", href: "/menu/recipes" },
  { label: "Ingredients", href: "/menu/ingredients" },
  { label: "Shopping List", href: "/menu/shopping" },
]

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Menu</h1>
          <p className="text-muted-foreground mt-1">
            Plan meals and manage ingredients for the community kitchen
          </p>
        </div>
        <SectionTabs tabs={tabs} />
        {children}
      </div>
    </AppShell>
  )
}
