"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Trash2, TrendingDown } from "lucide-react"
import { mockIngredients } from "@/lib/mock-data"

interface WasteEntry {
  id: string
  ingredientId: string
  quantity: number
  reason: "expired" | "spoiled" | "damaged" | "overproduction" | "other"
  notes: string
  date: string
  recordedBy: string
}

const wasteReasons = [
  { value: "expired", label: "Expired" },
  { value: "spoiled", label: "Spoiled" },
  { value: "damaged", label: "Damaged" },
  { value: "overproduction", label: "Overproduction" },
  { value: "other", label: "Other" },
]

const mockWasteLog: WasteEntry[] = [
  {
    id: "w1",
    ingredientId: "ing-1",
    quantity: 5,
    reason: "expired",
    notes: "Past best-by date",
    date: "2024-01-15",
    recordedBy: "Maria",
  },
  {
    id: "w2",
    ingredientId: "ing-3",
    quantity: 2,
    reason: "spoiled",
    notes: "Found mold",
    date: "2024-01-14",
    recordedBy: "Carlos",
  },
  {
    id: "w3",
    ingredientId: "ing-5",
    quantity: 10,
    reason: "overproduction",
    notes: "Made too much for dinner service",
    date: "2024-01-13",
    recordedBy: "Maria",
  },
]

export default function WasteLogPage() {
  const [wasteLog, setWasteLog] = useState<WasteEntry[]>(mockWasteLog)
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({
    ingredientId: "",
    quantity: 0,
    reason: "" as WasteEntry["reason"],
    notes: "",
  })

  const getIngredient = (ingredientId: string) => {
    return mockIngredients.find((i) => i.id === ingredientId)
  }

  const handleAddEntry = () => {
    if (!newEntry.ingredientId || !newEntry.reason || newEntry.quantity <= 0) return

    const entry: WasteEntry = {
      id: `w-${Date.now()}`,
      ...newEntry,
      date: new Date().toISOString().split("T")[0],
      recordedBy: "Staff",
    }

    setWasteLog([entry, ...wasteLog])
    setNewEntry({ ingredientId: "", quantity: 0, reason: "" as WasteEntry["reason"], notes: "" })
    setIsAddingEntry(false)
  }

  const totalWasteValue = wasteLog.reduce((sum, entry) => {
    const ingredient = getIngredient(entry.ingredientId)
    return sum + entry.quantity * (ingredient?.costPerUnit || 0)
  }, 0)

  const wasteByReason = wasteReasons.map((reason) => ({
    ...reason,
    count: wasteLog.filter((e) => e.reason === reason.value).length,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Waste (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalWasteValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entries This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wasteLog.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Reason
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {wasteByReason.sort((a, b) => b.count - a.count)[0]?.label || "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {wasteByReason.map((reason) => (
          <Badge key={reason.value} variant="outline" className="text-sm">
            {reason.label}: {reason.count}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Waste Log</h2>
        <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Waste
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Waste Entry</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Ingredient</label>
                <Select
                  value={newEntry.ingredientId}
                  onValueChange={(v) =>
                    setNewEntry({ ...newEntry, ingredientId: v })
                  }
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
                  value={newEntry.quantity}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      quantity: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter quantity"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Reason</label>
                <Select
                  value={newEntry.reason}
                  onValueChange={(v) =>
                    setNewEntry({ ...newEntry, reason: v as WasteEntry["reason"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={newEntry.notes}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, notes: e.target.value })
                  }
                  placeholder="Additional details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEntry}>Log Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead className="text-right">Value Lost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteLog.map((entry) => {
                const ingredient = getIngredient(entry.ingredientId)
                const value = entry.quantity * (ingredient?.costPerUnit || 0)

                return (
                  <TableRow key={entry.id}>
                    <TableCell className="text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                        {ingredient?.name || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.quantity} {ingredient?.unit}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {entry.reason}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {entry.notes || "-"}
                    </TableCell>
                    <TableCell>{entry.recordedBy}</TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      ${value.toFixed(2)}
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
