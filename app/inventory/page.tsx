"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Minus, AlertTriangle, Package } from "lucide-react"
import { mockInventory, mockIngredients } from "@/lib/mock-data"
import type { InventoryItem } from "@/lib/types"

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null)
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0)

  const getIngredient = (ingredientId: string) => {
    return mockIngredients.find((i) => i.id === ingredientId)
  }

  const categories = [...new Set(mockIngredients.map((i) => i.category))]

  const filteredInventory = inventory.filter((item) => {
    const ingredient = getIngredient(item.ingredientId)
    if (!ingredient) return false

    const matchesSearch = ingredient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || ingredient.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const getStockStatus = (item: InventoryItem) => {
    const ingredient = getIngredient(item.ingredientId)
    if (!ingredient) return "unknown"

    const percentage = (item.quantity / ingredient.parLevel) * 100
    if (percentage <= 25) return "critical"
    if (percentage <= 50) return "low"
    if (percentage <= 75) return "moderate"
    return "good"
  }

  const handleAdjustStock = () => {
    if (!adjustingItem) return

    setInventory(
      inventory.map((item) =>
        item.id === adjustingItem.id
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + adjustmentAmount),
              lastUpdated: new Date().toISOString(),
            }
          : item
      )
    )

    setAdjustingItem(null)
    setAdjustmentAmount(0)
  }

  const totalItems = inventory.length
  const lowStockItems = inventory.filter(
    (item) => getStockStatus(item) === "low" || getStockStatus(item) === "critical"
  ).length
  const totalValue = inventory.reduce((sum, item) => {
    const ingredient = getIngredient(item.ingredientId)
    return sum + item.quantity * (ingredient?.costPerUnit || 0)
  }, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Par Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const ingredient = getIngredient(item.ingredientId)
                const status = getStockStatus(item)

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {ingredient?.name || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ingredient?.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity} {ingredient?.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      {ingredient?.parLevel} {ingredient?.unit}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === "good"
                            ? "default"
                            : status === "moderate"
                            ? "secondary"
                            : status === "low"
                            ? "outline"
                            : "destructive"
                        }
                        className={
                          status === "low"
                            ? "border-amber-500 text-amber-600"
                            : status === "critical"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : ""
                        }
                      >
                        {status === "critical" && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAdjustingItem(item)}
                          >
                            Adjust
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Adjust Stock: {ingredient?.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col gap-4 py-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Current quantity:
                              </span>
                              <span className="font-medium">
                                {item.quantity} {ingredient?.unit}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  setAdjustmentAmount(adjustmentAmount - 1)
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={adjustmentAmount}
                                onChange={(e) =>
                                  setAdjustmentAmount(parseInt(e.target.value) || 0)
                                }
                                className="text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  setAdjustmentAmount(adjustmentAmount + 1)
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                New quantity:
                              </span>
                              <span className="font-medium">
                                {Math.max(0, item.quantity + adjustmentAmount)}{" "}
                                {ingredient?.unit}
                              </span>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setAdjustingItem(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAdjustStock}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
