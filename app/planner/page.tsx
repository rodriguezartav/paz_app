"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { ChevronLeft, ChevronRight, Plus, Users, Utensils } from "lucide-react"
import { mockMealPlans, mockRecipes } from "@/lib/mock-data"
import type { MealPlan } from "@/lib/types"

const mealTypes = ["breakfast", "lunch", "dinner"] as const

export default function PlannerPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(mockMealPlans)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedMealType, setSelectedMealType] = useState<typeof mealTypes[number] | null>(null)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const getMealForDay = (date: Date, mealType: string) => {
    return mealPlans.find(
      (plan) => 
        isSameDay(new Date(plan.date), date) && 
        plan.mealType === mealType
    )
  }

  const getRecipeById = (id: string) => {
    return mockRecipes.find((r) => r.id === id)
  }

  const handleAddMeal = (recipeId: string, servings: number) => {
    if (!selectedDay || !selectedMealType) return

    const existingIndex = mealPlans.findIndex(
      (plan) =>
        isSameDay(new Date(plan.date), selectedDay) &&
        plan.mealType === selectedMealType
    )

    const newPlan: MealPlan = {
      id: `plan-${Date.now()}`,
      date: selectedDay.toISOString(),
      mealType: selectedMealType,
      recipeId,
      servings,
    }

    if (existingIndex >= 0) {
      const updated = [...mealPlans]
      updated[existingIndex] = newPlan
      setMealPlans(updated)
    } else {
      setMealPlans([...mealPlans, newPlan])
    }

    setSelectedDay(null)
    setSelectedMealType(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
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
              className={isToday ? "border-primary" : ""}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span className={isToday ? "text-primary" : ""}>
                    {format(day, "EEE")}
                  </span>
                  <span className={`text-xs ${isToday ? "bg-primary text-primary-foreground px-2 py-0.5 rounded-full" : "text-muted-foreground"}`}>
                    {format(day, "d")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {mealTypes.map((mealType) => {
                  const meal = getMealForDay(day, mealType)
                  const recipe = meal ? getRecipeById(meal.recipeId) : null

                  return (
                    <Dialog key={mealType}>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => {
                            setSelectedDay(day)
                            setSelectedMealType(mealType)
                          }}
                          className="w-full text-left"
                        >
                          {meal && recipe ? (
                            <div className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                              <div className="text-xs text-muted-foreground capitalize mb-1">
                                {mealType}
                              </div>
                              <div className="text-sm font-medium truncate">
                                {recipe.name}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Users className="h-3 w-3" />
                                {meal.servings}
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
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {format(day, "EEEE, MMM d")} - {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                          </DialogTitle>
                        </DialogHeader>
                        <MealSelector onSelect={handleAddMeal} />
                      </DialogContent>
                    </Dialog>
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
                {mealPlans.filter((p) => 
                  weekDays.some((d) => isSameDay(new Date(p.date), d))
                ).length}
              </span>
              <span className="text-sm text-muted-foreground">Meals Planned</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {mealPlans
                  .filter((p) => weekDays.some((d) => isSameDay(new Date(p.date), d)))
                  .reduce((sum, p) => sum + p.servings, 0)}
              </span>
              <span className="text-sm text-muted-foreground">Total Servings</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {new Set(
                  mealPlans
                    .filter((p) => weekDays.some((d) => isSameDay(new Date(p.date), d)))
                    .map((p) => p.recipeId)
                ).size}
              </span>
              <span className="text-sm text-muted-foreground">Unique Recipes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {21 - mealPlans.filter((p) => 
                  weekDays.some((d) => isSameDay(new Date(p.date), d))
                ).length}
              </span>
              <span className="text-sm text-muted-foreground">Slots Available</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MealSelector({ onSelect }: { onSelect: (recipeId: string, servings: number) => void }) {
  const [selectedRecipe, setSelectedRecipe] = useState<string>("")
  const [servings, setServings] = useState<number>(10)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Recipe</label>
        <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
          <SelectTrigger>
            <SelectValue placeholder="Select a recipe" />
          </SelectTrigger>
          <SelectContent>
            {mockRecipes.map((recipe) => (
              <SelectItem key={recipe.id} value={recipe.id}>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  {recipe.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Servings</label>
        <Select value={servings.toString()} onValueChange={(v) => setServings(parseInt(v))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 15, 20, 25, 30].map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n} servings
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedRecipe && (
        <div className="p-3 rounded-md bg-muted">
          <div className="text-sm font-medium mb-1">
            {mockRecipes.find((r) => r.id === selectedRecipe)?.name}
          </div>
          <div className="flex flex-wrap gap-1">
            {mockRecipes.find((r) => r.id === selectedRecipe)?.dietaryTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button 
        onClick={() => onSelect(selectedRecipe, servings)} 
        disabled={!selectedRecipe}
      >
        Add to Plan
      </Button>
    </div>
  )
}
