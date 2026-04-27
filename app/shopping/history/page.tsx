"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Download, Package } from "lucide-react"
import { mockSuppliers } from "@/lib/mock-data"

interface Order {
  id: string
  supplierId: string
  date: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  itemCount: number
  total: number
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    supplierId: "sup-1",
    date: "2024-01-15",
    status: "delivered",
    itemCount: 12,
    total: 245.50,
  },
  {
    id: "ORD-002",
    supplierId: "sup-2",
    date: "2024-01-14",
    status: "shipped",
    itemCount: 8,
    total: 180.00,
  },
  {
    id: "ORD-003",
    supplierId: "sup-1",
    date: "2024-01-12",
    status: "delivered",
    itemCount: 15,
    total: 320.75,
  },
  {
    id: "ORD-004",
    supplierId: "sup-3",
    date: "2024-01-10",
    status: "delivered",
    itemCount: 6,
    total: 95.00,
  },
  {
    id: "ORD-005",
    supplierId: "sup-2",
    date: "2024-01-08",
    status: "delivered",
    itemCount: 10,
    total: 210.25,
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OrderHistoryPage() {
  const getSupplier = (supplierId: string) => {
    return mockSuppliers.find((s) => s.id === supplierId)
  }

  const totalOrders = mockOrders.length
  const totalSpent = mockOrders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = mockOrders.filter(
    (o) => o.status === "pending" || o.status === "confirmed" || o.status === "shipped"
  ).length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => {
                const supplier = getSupplier(order.supplierId)

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {order.id}
                      </div>
                    </TableCell>
                    <TableCell>{supplier?.name || "Unknown"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">{order.itemCount}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
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
