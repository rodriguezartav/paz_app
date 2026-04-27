"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, ShoppingCart, Package } from "lucide-react"
import { mockInventory, mockIngredients } from "@/lib/mock-data"
import Link from "next/link"

export default function LowStockPage() {
  const getIngredient = (ingredientId: string) => {
    return mockIngredients.find((i) => i.id === ingredientId)
  }

  const getStockPercentage = (item: typeof mockInventory[0]) => {
    const ingredient = getIngredient(item.ingredientId)
    if (!ingredient) return 0
    return Math.min(100, (item.quantity / ingredient.parLevel) * 100)
  }

  const lowStockItems = mockInventory
    .filter((item) => {
      const percentage = getStockPercentage(item)
      return percentage <= 50
    })
    .sort((a, b) => getStockPercentage(a) - getStockPercentage(b))

  const criticalItems = lowStockItems.filter(
    (item) => getStockPercentage(item) <= 25
  )

  return (
    <div className="flex flex-col gap-6">
      {criticalItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {criticalItems.map((item) => {
                const ingredient = getIngredient(item.ingredientId)
                const percentage = getStockPercentage(item)

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-medium">{ingredient?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} / {ingredient?.parLevel} {ingredient?.unit}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24">
                        <Progress value={percentage} className="h-2 bg-red-100" />
                      </div>
                      <Badge variant="destructive">{Math.round(percentage)}%</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Low Stock Items</h2>
          <p className="text-sm text-muted-foreground">
            {lowStockItems.length} items below 50% par level
          </p>
        </div>
        <Link href="/shopping">
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Create Shopping List
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lowStockItems.map((item) => {
          const ingredient = getIngredient(item.ingredientId)
          const percentage = getStockPercentage(item)
          const isCritical = percentage <= 25

          return (
            <Card key={item.id} className={isCritical ? "border-red-200" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{ingredient?.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {ingredient?.category}
                    </Badge>
                  </div>
                  {isCritical && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">
                      {item.quantity} {ingredient?.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Par Level</span>
                    <span>
                      {ingredient?.parLevel} {ingredient?.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Needed</span>
                    <span className="font-medium text-amber-600">
                      {(ingredient?.parLevel || 0) - item.quantity} {ingredient?.unit}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Stock Level</span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                  <Progress
                    value={percentage}
                    className={`h-2 ${isCritical ? "bg-red-100" : "bg-amber-100"}`}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {lowStockItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">All Stocked Up!</h3>
            <p className="text-muted-foreground">
              All inventory items are above 50% of their par levels.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
