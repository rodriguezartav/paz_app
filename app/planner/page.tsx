"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus, Users, Utensils, Minus, Leaf, Vegan } from "lucide-react"
import { meals as mockMeals, recipes } from "@/lib/mock-data"
import type { Meal, MealType } from "@/lib/types"

const mealTypes: MealType[] = ["breakfast", "brunch", "dinner"]

export default function PlannerPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [mealsList, setMealsList] = useState<Meal[]>(mockMeals)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const getMealForDay = (date: Date, mealType: MealType) => {
    return mealsList.find(
      (meal) => 
        isSameDay(new Date(meal.date), date) && 
        meal.mealType === mealType
    )
  }

  const getRecipeById = (id: string) => {
    return recipes.find((r) => r.id === id)
  }

  const getTotalMealCount = (meal: Meal) => {
    return (
      meal.eatsAllResidents +
      meal.vegetarianResidents +
      meal.veganResidents +
      meal.extraEatsAllGuests +
      meal.extraVegetarianGuests +
      meal.extraVeganGuests
    )
  }

  const handleSaveMeal = (meal: Meal) => {
    const existingIndex = mealsList.findIndex(
      (m) =>
        isSameDay(new Date(m.date), new Date(meal.date)) &&
        m.mealType === meal.mealType
    )

    if (existingIndex >= 0) {
      const updated = [...mealsList]
      updated[existingIndex] = meal
      setMealsList(updated)
    } else {
      setMealsList([...mealsList, meal])
    }

    setEditingMeal(null)
    setIsDialogOpen(false)
  }

  const handleOpenMealDialog = (day: Date, mealType: MealType) => {
    const existingMeal = getMealForDay(day, mealType)
    if (existingMeal) {
      setEditingMeal(existingMeal)
    } else {
      setEditingMeal({
        id: `meal-${Date.now()}`,
        date: format(day, "yyyy-MM-dd"),
        mealType,
        eatsAllResidents: 0,
        vegetarianResidents: 0,
        veganResidents: 0,
        extraEatsAllGuests: 0,
        extraVegetarianGuests: 0,
        extraVeganGuests: 0,
        recipeIds: [],
        notes: "",
      })
    }
    setIsDialogOpen(true)
  }

  const getWeekMeals = () => {
    return mealsList.filter((meal) =>
      weekDays.some((d) => isSameDay(new Date(meal.date), d))
    )
  }

  const weekMeals = getWeekMeals()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[200px] text-center">
            {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
        >
          Today
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, new Date())
          return (
            <Card 
              key={day.toISOString()} 
              className={isToday ? "border-clay" : ""}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className={isToday ? "text-clay" : ""}>
                    {format(day, "EEE")}
                  </span>
                  <span className={`text-xs ${isToday ? "bg-clay text-white px-2 py-0.5 rounded-full" : "text-muted-foreground"}`}>
                    {format(day, "d")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {mealTypes.map((mealType) => {
                  const meal = getMealForDay(day, mealType)

                  return (
                    <button
                      key={mealType}
                      onClick={() => handleOpenMealDialog(day, mealType)}
                      className="w-full text-left"
                    >
                      {meal ? (
                        <div className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                          <div className="text-xs text-muted-foreground capitalize mb-1">
                            {mealType}
                          </div>
                          {meal.recipeIds.length > 0 && (
                            <div className="text-sm font-medium truncate mb-1">
                              {meal.recipeIds.map((id) => getRecipeById(id)?.name).filter(Boolean).join(", ")}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {getTotalMealCount(meal)}
                            </div>
                            {meal.vegetarianResidents + meal.extraVegetarianGuests > 0 && (
                              <div className="flex items-center gap-0.5">
                                <Leaf className="h-3 w-3 text-green-600" />
                                {meal.vegetarianResidents + meal.extraVegetarianGuests}
                              </div>
                            )}
                            {meal.veganResidents + meal.extraVeganGuests > 0 && (
                              <div className="flex items-center gap-0.5">
                                <Vegan className="h-3 w-3 text-green-700" />
                                {meal.veganResidents + meal.extraVeganGuests}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 rounded-md border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors">
                          <div className="text-xs text-muted-foreground capitalize mb-1">
                            {mealType}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Plus className="h-3 w-3" />
                            Add meal
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Week Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {weekMeals.length}
              </span>
              <span className="text-sm text-muted-foreground">Meals Planned</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {weekMeals.reduce((sum, m) => sum + getTotalMealCount(m), 0)}
              </span>
              <span className="text-sm text-muted-foreground">Total People Fed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {new Set(weekMeals.flatMap((m) => m.recipeIds)).size}
              </span>
              <span className="text-sm text-muted-foreground">Recipes Used</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {21 - weekMeals.length}
              </span>
              <span className="text-sm text-muted-foreground">Slots Available</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Shopping quantities are calculated from assigned recipes and meal counts, including extra guests.
          </p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMeal && (
                <>
                  {format(new Date(editingMeal.date), "EEEE, MMM d")} - {editingMeal.mealType.charAt(0).toUpperCase() + editingMeal.mealType.slice(1)}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {editingMeal && (
            <MealForm 
              meal={editingMeal} 
              onSave={handleSaveMeal}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface MealFormProps {
  meal: Meal
  onSave: (meal: Meal) => void
  onCancel: () => void
}

function MealForm({ meal, onSave, onCancel }: MealFormProps) {
  const [formData, setFormData] = useState<Meal>(meal)

  const handleChange = (field: keyof Meal, value: number | string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRecipeToggle = (recipeId: string) => {
    const current = formData.recipeIds
    if (current.includes(recipeId)) {
      handleChange("recipeIds", current.filter((id) => id !== recipeId))
    } else {
      handleChange("recipeIds", [...current, recipeId])
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Resident Counts */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Residents by Diet</Label>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Eats All</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("eatsAllResidents", Math.max(0, formData.eatsAllResidents - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{formData.eatsAllResidents}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("eatsAllResidents", formData.eatsAllResidents + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Leaf className="h-3 w-3 text-green-600" />
              Vegetarian
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("vegetarianResidents", Math.max(0, formData.vegetarianResidents - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{formData.vegetarianResidents}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("vegetarianResidents", formData.vegetarianResidents + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Vegan className="h-3 w-3 text-green-700" />
              Vegan
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("veganResidents", Math.max(0, formData.veganResidents - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{formData.veganResidents}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("veganResidents", formData.veganResidents + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Guests */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Extra Guests</Label>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Eats All</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("extraEatsAllGuests", Math.max(0, formData.extraEatsAllGuests - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{formData.extraEatsAllGuests}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("extraEatsAllGuests", formData.extraEatsAllGuests + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Leaf className="h-3 w-3 text-green-600" />
              Vegetarian
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("extraVegetarianGuests", Math.max(0, formData.extraVegetarianGuests - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{formData.extraVegetarianGuests}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("extraVegetarianGuests", formData.extraVegetarianGuests + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Vegan className="h-3 w-3 text-green-700" />
              Vegan
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("extraVeganGuests", Math.max(0, formData.extraVeganGuests - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{formData.extraVeganGuests}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleChange("extraVeganGuests", formData.extraVeganGuests + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Recipes */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Assigned Recipes</Label>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => handleRecipeToggle(recipe.id)}
              className={`flex items-center gap-2 p-2 rounded-md border text-left transition-colors ${
                formData.recipeIds.includes(recipe.id)
                  ? "bg-clay/10 border-clay"
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              <Utensils className={`h-4 w-4 ${formData.recipeIds.includes(recipe.id) ? "text-clay" : "text-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{recipe.name}</div>
                <div className="text-xs text-muted-foreground truncate">{recipe.description}</div>
              </div>
              {formData.recipeIds.includes(recipe.id) && (
                <Badge variant="secondary" className="bg-clay/20 text-clay text-xs">
                  Selected
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Notes</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Add any notes for this meal..."
          rows={2}
        />
      </div>

      {/* Total Count Summary */}
      <div className="p-3 bg-muted rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total meal count:</span>
          <span className="text-lg font-bold">
            {formData.eatsAllResidents +
              formData.vegetarianResidents +
              formData.veganResidents +
              formData.extraEatsAllGuests +
              formData.extraVegetarianGuests +
              formData.extraVeganGuests}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={() => onSave(formData)}>
          Save Meal
        </Button>
      </div>
    </div>
  )
}
