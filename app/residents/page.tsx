import { residents } from "@/lib/mock-data"
import { ResidentCard } from "@/components/residents/resident-card"

export default function CurrentResidentsPage() {
  // Sort residents: staying/checked_in first, then upcoming, then checking out, then past
  const sortedResidents = [...residents].sort((a, b) => {
    const statusOrder = {
      staying: 0,
      checked_in: 1,
      checking_out_today: 2,
      upcoming: 3,
      checked_out: 4,
      cancelled: 5,
    }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  const activeResidents = sortedResidents.filter(
    (r) => !["checked_out", "cancelled"].includes(r.status)
  )
  const pastResidents = sortedResidents.filter(
    (r) => ["checked_out", "cancelled"].includes(r.status)
  )

  return (
    <div>
      {/* Active Residents */}
      <section className="mb-6">
        <h2 className="text-base font-semibold text-foreground mb-3">
          Active & Upcoming ({activeResidents.length})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeResidents.map((resident) => (
            <ResidentCard
              key={resident.id}
              resident={resident}
            />
          ))}
        </div>
      </section>

      {/* Past Residents */}
      {pastResidents.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-muted-foreground mb-3">
            Past ({pastResidents.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pastResidents.map((resident) => (
              <ResidentCard
                key={resident.id}
                resident={resident}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
