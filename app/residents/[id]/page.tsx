import { notFound } from "next/navigation"
import { residents } from "@/lib/mock-data"
import { ResidentDetailsPanel } from "@/components/residents/resident-details-panel"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ResidentPageProps {
  params: Promise<{ id: string }>
}

export default async function ResidentPage({ params }: ResidentPageProps) {
  const { id } = await params
  const resident = residents.find((r) => r.id === id)
  
  if (!resident) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/residents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>
      <ResidentDetailsPanel resident={resident} />
    </div>
  )
}
