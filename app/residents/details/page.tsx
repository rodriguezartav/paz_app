"use client"

import { useState } from "react"
import { residents, getPaymentByResidentId } from "@/lib/mock-data"
import { ResidentDetailsPanel } from "@/components/residents/resident-details-panel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"

export default function ResidentDetailsPage() {
  const [selectedResidentId, setSelectedResidentId] = useState<string>("")
  
  const selectedResident = residents.find((r) => r.id === selectedResidentId)
  const payment = selectedResident ? getPaymentByResidentId(selectedResident.id) : undefined

  return (
    <div className="space-y-6">
      {/* Resident Selector */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <User className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Select value={selectedResidentId} onValueChange={setSelectedResidentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a resident to view details" />
                </SelectTrigger>
                <SelectContent>
                  {residents.map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.name} - {resident.nationality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Panel */}
      {selectedResident ? (
        <ResidentDetailsPanel resident={selectedResident} payment={payment} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Select a resident above to view their details
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
