"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Users, 
  UtensilsCrossed, 
  Calendar, 
  Package, 
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, UsersRound, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const mainNavItems = [
  { label: "Residents", href: "/residents", icon: Users },
  { label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { label: "Planner", href: "/planner", icon: Calendar },
  { label: "Inventory", href: "/inventory", icon: Package },
]

const moreNavItems = [
  { label: "Shopping", href: "/shopping", icon: ShoppingCart },
  { label: "Team", href: "/team", icon: UsersRound },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  
  const isMoreActive = moreNavItems.some(item => pathname.startsWith(item.href))

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-pb">
      <ul className="flex">
        {mainNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-2 text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  isActive && "text-primary"
                )} />
                {item.label}
              </Link>
            </li>
          )
        })}
        
        {/* More Menu */}
        <li className="flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-2 text-[10px] font-medium transition-colors w-full",
                  isMoreActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <MoreHorizontal className={cn(
                  "w-5 h-5",
                  isMoreActive && "text-primary"
                )} />
                More
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mb-2">
              {moreNavItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  )
}
