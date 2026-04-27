import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { DietBadge, StatusBadge } from "./badges"
import type { Resident } from "@/lib/types"
import { calculateNights } from "@/lib/mock-data"
import { Calendar, Bed } from "lucide-react"

interface ResidentCardProps {
  resident: Resident
}

export function ResidentCard({ resident }: ResidentCardProps) {
  const nights = calculateNights(resident.arrivalDate, resident.departureDate)
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Link href={`/residents/${resident.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-md transition-shadow active:scale-[0.99]">
        <CardContent className="p-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm truncate">{resident.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <span>{resident.nationality}</span>
                <span className="text-border">·</span>
                <span>{resident.gender === "female" ? "F" : "M"}, {resident.age}</span>
              </div>
            </div>
            <DietBadge diet={resident.diet} />
          </div>

          {/* Status Row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <StatusBadge status={resident.status} />
            {resident.checkInCompleted && (
              <span className="text-xs text-secondary">Checked In</span>
            )}
          </div>

          {/* Stay Details */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(resident.arrivalDate)} - {formatDate(resident.departureDate)}</span>
            </div>
            <span className="font-medium text-foreground">{nights}n</span>
          </div>

          {/* Room */}
          {resident.room && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
              <Bed className="w-3 h-3" />
              <span>{resident.room} / Bed {resident.bed}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
