"use client"

import { useState } from "react"
import { ingredients as initialIngredients } from "@/lib/mock-data"
import { IngredientCard } from "@/components/menu/ingredient-card"
import { IngredientTypeBadge } from "@/components/menu/badges"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Package } from "lucide-react"
import type { Ingredient, IngredientType, Measurement } from "@/lib/types"

const ingredientTypes: IngredientType[] = [
  "staple", "protein", "vegetable", "fruit", "condiment", "dairy", "cleaning", "other"
]

const measurements: Measurement[] = ["kg", "unit", "ml", "tbsp"]

export default function IngredientsPage() {
  const [ingredients] = useState(initialIngredients)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filter, setFilter] = useState<IngredientType | "all">("all")

  const filteredIngredients = filter === "all" 
    ? ingredients 
    : ingredients.filter(i => i.type === filter)

  // Group by type
  const groupedIngredients = filteredIngredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.type]) {
      acc[ingredient.type] = []
    }
    acc[ingredient.type].push(ingredient)
    return acc
  }, {} as Record<IngredientType, Ingredient[]>)

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filteredIngredients.length} ingredients
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={filter} onValueChange={(v) => setFilter(v as IngredientType | "all")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {ingredientTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Ingredient</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Ingredient Name</FieldLabel>
                    <Input placeholder="e.g., Tomatoes" />
                  </Field>
                  <Field>
                    <FieldLabel>Type</FieldLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredientTypes.map((type) => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Measurement</FieldLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select measurement" />
                      </SelectTrigger>
                      <SelectContent>
                        {measurements.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Ingredient</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grouped Ingredients */}
      {filter === "all" ? (
        Object.entries(groupedIngredients).map(([type, items]) => (
          <section key={type}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-foreground capitalize">{type}</h2>
              <span className="text-xs text-muted-foreground">({items.length})</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((ingredient) => (
                <IngredientCard key={ingredient.id} ingredient={ingredient} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredIngredients.map((ingredient) => (
            <IngredientCard key={ingredient.id} ingredient={ingredient} />
          ))}
        </div>
      )}
    </div>
  )
}
