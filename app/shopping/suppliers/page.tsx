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
import { Plus, Phone, Mail, MapPin, Star, Truck } from "lucide-react"
import { mockSuppliers } from "@/lib/mock-data"
import type { Supplier } from "@/lib/types"

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [isAddingSupplier, setIsAddingSupplier] = useState(false)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
  })

  const handleAddSupplier = () => {
    if (!newSupplier.name) return

    const supplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupplier.name,
      contactName: newSupplier.contactName,
      phone: newSupplier.phone,
      email: newSupplier.email,
      categories: [],
      deliveryDays: ["Monday", "Thursday"],
      minimumOrder: 0,
      leadTimeDays: 2,
      rating: 0,
      notes: "",
    }

    setSuppliers([...suppliers, supplier])
    setNewSupplier({ name: "", contactName: "", phone: "", email: "" })
    setIsAddingSupplier(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage your suppliers and their contact information
        </p>
        <Dialog open={isAddingSupplier} onOpenChange={setIsAddingSupplier}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  value={newSupplier.name}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, name: e.target.value })
                  }
                  placeholder="e.g., Fresh Produce Co."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Contact Name</label>
                <Input
                  value={newSupplier.contactName}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, contactName: e.target.value })
                  }
                  placeholder="e.g., Juan Garcia"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={newSupplier.phone}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, phone: e.target.value })
                  }
                  placeholder="e.g., +506 8888-8888"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, email: e.target.value })
                  }
                  placeholder="e.g., contact@supplier.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingSupplier(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSupplier}>Add Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <CardDescription>{supplier.contactName}</CardDescription>
                </div>
                {supplier.rating > 0 && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{supplier.rating}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {supplier.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>{supplier.deliveryDays.join(", ")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Min Order</span>
                  <span className="font-medium">
                    ${supplier.minimumOrder.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Lead Time</span>
                  <span className="font-medium">
                    {supplier.leadTimeDays} day{supplier.leadTimeDays !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Contact
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
