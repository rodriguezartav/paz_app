"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Copy, Calendar, Utensils } from "lucide-react"

interface MealTemplate {
  id: string
  name: string
  description: string
  meals: {
    day: number
    mealType: "breakfast" | "lunch" | "dinner"
    recipeName: string
  }[]
}

const mockTemplates: MealTemplate[] = [
  {
    id: "1",
    name: "Standard Week",
    description: "Our regular weekly rotation with balanced meals",
    meals: [
      { day: 0, mealType: "breakfast", recipeName: "Tropical Fruit Bowl" },
      { day: 0, mealType: "lunch", recipeName: "Grilled Fish Tacos" },
      { day: 0, mealType: "dinner", recipeName: "Thai Green Curry" },
      { day: 1, mealType: "breakfast", recipeName: "Acai Bowl" },
      { day: 1, mealType: "lunch", recipeName: "Buddha Bowl" },
      { day: 1, mealType: "dinner", recipeName: "Grilled Fish Tacos" },
    ],
  },
  {
    id: "2",
    name: "Detox Week",
    description: "Light, cleansing meals focused on vegetables and fruits",
    meals: [
      { day: 0, mealType: "breakfast", recipeName: "Green Smoothie Bowl" },
      { day: 0, mealType: "lunch", recipeName: "Buddha Bowl" },
      { day: 0, mealType: "dinner", recipeName: "Vegetable Curry" },
    ],
  },
  {
    id: "3",
    name: "High Protein",
    description: "Protein-rich meals for active retreaters",
    meals: [
      { day: 0, mealType: "breakfast", recipeName: "Protein Acai Bowl" },
      { day: 0, mealType: "lunch", recipeName: "Grilled Fish Tacos" },
      { day: 0, mealType: "dinner", recipeName: "Thai Green Curry" },
    ],
  },
]

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [isCreating, setIsCreating] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")

  const handleApplyTemplate = (templateId: string) => {
    // In a real app, this would apply the template to the current week
    console.log("Applying template:", templateId)
  }

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) return
    
    const newTemplate: MealTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      description: "Custom template",
      meals: [],
    }
    
    setTemplates([...templates, newTemplate])
    setNewTemplateName("")
    setIsCreating(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Save and reuse weekly meal plans
        </p>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Template Name</label>
                <Input
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g., Vegan Week"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <Utensils className="h-3 w-3 mr-1" />
                    {template.meals.length} meals
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Set(template.meals.map((m) => m.day)).size} days
                  </Badge>
                </div>

                <div className="flex flex-col gap-1 text-sm">
                  {template.meals.slice(0, 3).map((meal, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-8 text-xs">{dayNames[meal.day]}</span>
                      <span className="capitalize text-xs w-16">{meal.mealType}</span>
                      <span className="truncate">{meal.recipeName}</span>
                    </div>
                  ))}
                  {template.meals.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{template.meals.length - 3} more meals
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleApplyTemplate(template.id)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Apply
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
