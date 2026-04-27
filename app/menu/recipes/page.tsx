"use client"

import { useState } from "react"
import { recipes as initialRecipes, ingredients, getIngredientById } from "@/lib/mock-data"
import { RecipeCard } from "@/components/menu/recipe-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Plus, ChefHat, X } from "lucide-react"
import type { Recipe, Measurement } from "@/lib/types"

const measurements: Measurement[] = ["kg", "unit", "ml", "tbsp"]

export default function RecipesPage() {
  const [recipes] = useState(initialRecipes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {recipes.length} recipes
          </span>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Recipe</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Recipe Name</FieldLabel>
                  <Input placeholder="e.g., Rice and Beans" />
                </Field>
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Input placeholder="Short description of the recipe" />
                </Field>
                <Field>
                  <FieldLabel>Notes</FieldLabel>
                  <Textarea placeholder="Additional cooking notes" rows={2} />
                </Field>
              </FieldGroup>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Ingredients</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select ingredient" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredients.map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Amount" className="w-24" />
                    <Select>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {measurements.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Recipe</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recipe Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onView={() => setSelectedRecipe(recipe)}
          />
        ))}
      </div>

      {/* Recipe Detail Sheet */}
      <Sheet open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedRecipe && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedRecipe.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-muted-foreground">{selectedRecipe.description}</p>
                </div>

                {selectedRecipe.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedRecipe.notes}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Ingredients ({selectedRecipe.ingredients.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ri, i) => {
                      const ingredient = getIngredientById(ri.ingredientId)
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <span className="font-medium">{ingredient?.name || "Unknown"}</span>
                          <span className="text-muted-foreground">
                            {ri.amount} {ri.measurement}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">Edit Recipe</Button>
                  <Button variant="ghost" className="text-destructive">Delete</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
