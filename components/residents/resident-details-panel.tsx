"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DietBadge, StatusBadge } from "./badges"
import type { Resident } from "@/lib/types"
import { calculateNights } from "@/lib/mock-data"
import { 
  User, 
  Mail, 
  Phone, 
  AlertCircle, 
  Calendar, 
  Bed, 
  FileText,
  Check,
  X,
  DoorOpen
} from "lucide-react"

interface ResidentDetailsPanelProps {
  resident: Resident
}

export function ResidentDetailsPanel({ resident }: ResidentDetailsPanelProps) {
  const nights = calculateNights(resident.arrivalDate, resident.departureDate)
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const CheckItem = ({ label, checked }: { label: string; checked: boolean }) => (
    <div className="flex items-center gap-2">
      {checked ? (
        <Check className="w-4 h-4 text-secondary" />
      ) : (
        <X className="w-4 h-4 text-destructive" />
      )}
      <span className={checked ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{resident.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge status={resident.status} />
              <DietBadge diet={resident.diet} />
            </div>
          </div>
          
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground w-24">Nationality</span>
              {resident.nationality}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground w-24">Gender</span>
              {resident.gender === "female" ? "Female" : "Male"}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground w-24">Age</span>
              {resident.age}
            </div>
          </div>

          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{resident.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{resident.whatsapp}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span>{resident.emergencyContact}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stay Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Stay
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground w-24">Arrival</span>
              {formatDate(resident.arrivalDate)}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground w-24">Departure</span>
              {formatDate(resident.departureDate)}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground w-24">Nights</span>
              <span className="font-semibold text-foreground">{nights}</span>
            </div>
          </div>

          {resident.room && (
            <div className="pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <Bed className="w-4 h-4 text-muted-foreground" />
                <span>Room: <strong>{resident.room}</strong> / Bed: <strong>{resident.bed}</strong></span>
              </div>
            </div>
          )}

          {resident.notes && (
            <div className="pt-3 border-t border-border">
              <div className="flex items-start gap-2 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{resident.notes}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Check-In Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-primary" />
            Check-In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <CheckItem label="Check-in completed" checked={resident.checkInCompleted} />
            <CheckItem label="Release accepted" checked={resident.releaseAccepted} />
            <CheckItem label="Health insurance confirmed" checked={resident.healthInsuranceConfirmed} />
            <CheckItem label="Media release accepted" checked={resident.mediaReleaseAccepted} />
            <CheckItem label="Orientation completed" checked={resident.orientationCompleted} />
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-full">Mark Checked In</Button>
            <Button variant="outline" size="sm" className="w-full">Assign Room / Bed</Button>
            <Button variant="outline" size="sm" className="w-full">Add Note</Button>
            <Button variant="outline" size="sm" className="w-full">Mark Checked Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
