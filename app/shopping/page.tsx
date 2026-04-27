"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, ShoppingCart, Download, Send, Sparkles } from "lucide-react"
import { mockShoppingList, mockIngredients, mockSuppliers } from "@/lib/mock-data"
import type { ShoppingItem } from "@/lib/types"

export default function ShoppingPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(mockShoppingList)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState({
    ingredientId: "",
    quantity: 0,
    supplierId: "",
  })

  const getIngredient = (ingredientId: string) => {
    return mockIngredients.find((i) => i.id === ingredientId)
  }

  const getSupplier = (supplierId: string) => {
    return mockSuppliers.find((s) => s.id === supplierId)
  }

  const handleToggleItem = (itemId: string) => {
    setShoppingList(
      shoppingList.map((item) =>
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      )
    )
  }

  const handleAddItem = () => {
    if (!newItem.ingredientId || newItem.quantity <= 0) return

    const ingredient = getIngredient(newItem.ingredientId)
    const item: ShoppingItem = {
      id: `shop-${Date.now()}`,
      ingredientId: newItem.ingredientId,
      quantity: newItem.quantity,
      unit: ingredient?.unit || "units",
      supplierId: newItem.supplierId || undefined,
      purchased: false,
      estimatedCost: newItem.quantity * (ingredient?.costPerUnit || 0),
    }

    setShoppingList([...shoppingList, item])
    setNewItem({ ingredientId: "", quantity: 0, supplierId: "" })
    setIsAddingItem(false)
  }

  const handleGenerateFromInventory = () => {
    // This would generate shopping items based on low inventory
    console.log("Generating from inventory...")
  }

  const totalItems = shoppingList.length
  const purchasedItems = shoppingList.filter((i) => i.purchased).length
  const totalCost = shoppingList.reduce((sum, i) => sum + i.estimatedCost, 0)
  const remainingCost = shoppingList
    .filter((i) => !i.purchased)
    .reduce((sum, i) => sum + i.estimatedCost, 0)

  // Group by supplier
  const groupedBySupplier = shoppingList.reduce((acc, item) => {
    const supplierId = item.supplierId || "unassigned"
    if (!acc[supplierId]) {
      acc[supplierId] = []
    }
    acc[supplierId].push(item)
    return acc
  }, {} as Record<string, ShoppingItem[]>)

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
              Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {purchasedItems} / {totalItems}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              ${remainingCost.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Shopping Item</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Ingredient</label>
                <Select
                  value={newItem.ingredientId}
                  onValueChange={(v) => setNewItem({ ...newItem, ingredientId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ingredient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockIngredients.map((ing) => (
                      <SelectItem key={ing.id} value={ing.id}>
                        {ing.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="Enter quantity"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Supplier (optional)</label>
                <Select
                  value={newItem.supplierId}
                  onValueChange={(v) => setNewItem({ ...newItem, supplierId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((sup) => (
                      <SelectItem key={sup.id} value={sup.id}>
                        {sup.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={handleGenerateFromInventory}>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate from Inventory
        </Button>

        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export List
        </Button>

        <Button variant="outline">
          <Send className="h-4 w-4 mr-2" />
          Send to Suppliers
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {Object.entries(groupedBySupplier).map(([supplierId, items]) => {
          const supplier =
            supplierId === "unassigned" ? null : getSupplier(supplierId)
          const groupTotal = items.reduce((sum, i) => sum + i.estimatedCost, 0)
          const groupPurchased = items.filter((i) => i.purchased).length

          return (
            <Card key={supplierId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {supplier?.name || "Unassigned"}
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">
                      {groupPurchased}/{items.length} items
                    </Badge>
                    <span className="font-medium">${groupTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col divide-y">
                  {items.map((item) => {
                    const ingredient = getIngredient(item.ingredientId)

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-4 py-3 ${
                          item.purchased ? "opacity-50" : ""
                        }`}
                      >
                        <Checkbox
                          checked={item.purchased}
                          onCheckedChange={() => handleToggleItem(item.id)}
                        />
                        <div className="flex-1">
                          <div
                            className={`font-medium ${
                              item.purchased ? "line-through" : ""
                            }`}
                          >
                            {ingredient?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit}
                          </div>
                        </div>
                        <Badge variant="outline">{ingredient?.category}</Badge>
                        <span className="font-medium">
                          ${item.estimatedCost.toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
