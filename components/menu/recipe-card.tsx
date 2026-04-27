import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Recipe } from "@/lib/types"
import { getIngredientById } from "@/lib/mock-data"
import { ChefHat, Eye } from "lucide-react"

interface RecipeCardProps {
  recipe: Recipe
  onView?: () => void
}

export function RecipeCard({ recipe, onView }: RecipeCardProps) {
  const ingredientPreviews = recipe.ingredients.slice(0, 4).map((ri) => {
    const ingredient = getIngredientById(ri.ingredientId)
    return ingredient?.name || "Unknown"
  })

  const moreCount = recipe.ingredients.length - 4

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{recipe.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{recipe.description}</p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1.5">
            {recipe.ingredients.length} ingredients
          </p>
          <div className="flex flex-wrap gap-1">
            {ingredientPreviews.map((name, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {name}
              </span>
            ))}
            {moreCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                +{moreCount} more
              </span>
            )}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={onView}>
          <Eye className="w-4 h-4 mr-2" />
          View / Edit
        </Button>
      </CardContent>
    </Card>
  )
}
