import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IngredientTypeBadge, MeasurementBadge } from "./badges"
import type { Ingredient } from "@/lib/types"
import { Pencil } from "lucide-react"

interface IngredientCardProps {
  ingredient: Ingredient
  onEdit?: () => void
}

export function IngredientCard({ ingredient, onEdit }: IngredientCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground">{ingredient.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <IngredientTypeBadge type={ingredient.type} />
              <MeasurementBadge measurement={ingredient.measurement} />
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
