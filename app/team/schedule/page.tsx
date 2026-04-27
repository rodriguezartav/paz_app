"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { mockTeamMembers } from "@/lib/mock-data"

const timeSlots = [
  "6:00", "7:00", "8:00", "9:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
]

const roleColors: Record<string, string> = {
  manager: "bg-primary/20 border-primary",
  chef: "bg-amber-100 border-amber-300",
  "sous-chef": "bg-orange-100 border-orange-300",
  server: "bg-blue-100 border-blue-300",
  housekeeper: "bg-green-100 border-green-300",
  maintenance: "bg-slate-100 border-slate-300",
  receptionist: "bg-purple-100 border-purple-300",
}

export default function SchedulePage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const getShiftsForDay = (dayIndex: number) => {
    return mockTeamMembers
      .filter((member) =>
        member.schedule.some(
          (shift) => dayNames.indexOf(shift.day as typeof dayNames[number]) === dayIndex
        )
      )
      .map((member) => {
        const shift = member.schedule.find(
          (s) => dayNames.indexOf(s.day as typeof dayNames[number]) === dayIndex
        )
        return { member, shift }
      })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[200px] text-center">
            {format(currentWeekStart, "MMM d")} -{" "}
            {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
            }
          >
            This Week
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(roleColors).map(([role, color]) => (
          <Badge
            key={role}
            variant="outline"
            className={`${color} capitalize`}
          >
            {role}
          </Badge>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 border-b">
              <div className="p-3 font-medium text-muted-foreground text-sm">
                Team Member
              </div>
              {weekDays.map((day, idx) => {
                const isToday = isSameDay(day, new Date())
                return (
                  <div
                    key={idx}
                    className={`p-3 text-center border-l ${
                      isToday ? "bg-primary/5" : ""
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        isToday ? "text-primary" : ""
                      }`}
                    >
                      {dayNames[idx]}
                    </div>
                    <div
                      className={`text-xs ${
                        isToday
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                )
              })}
            </div>

            {mockTeamMembers.map((member) => {
              const initials = member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

              return (
                <div key={member.id} className="grid grid-cols-8 border-b">
                  <div className="p-3 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {member.role}
                      </div>
                    </div>
                  </div>
                  {dayNames.map((dayName, dayIdx) => {
                    const shift = member.schedule.find((s) => s.day === dayName)
                    const isToday = isSameDay(weekDays[dayIdx], new Date())

                    return (
                      <div
                        key={dayIdx}
                        className={`p-2 border-l min-h-[60px] ${
                          isToday ? "bg-primary/5" : ""
                        }`}
                      >
                        {shift && (
                          <div
                            className={`p-2 rounded text-xs ${
                              roleColors[member.role] || "bg-muted"
                            } border`}
                          >
                            <div className="font-medium">
                              {shift.startTime} - {shift.endTime}
                            </div>
                            {shift.task && (
                              <div className="text-muted-foreground mt-1 truncate">
                                {shift.task}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Hours This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTeamMembers.reduce((total, member) => {
                return (
                  total +
                  member.schedule.reduce((hours, shift) => {
                    const start = parseInt(shift.startTime.split(":")[0])
                    const end = parseInt(shift.endTime.split(":")[0])
                    return hours + (end - start)
                  }, 0)
                )
              }, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Staff on Shift Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockTeamMembers.filter((m) =>
                  m.schedule.some(
                    (s) => s.day === dayNames[new Date().getDay() - 1]
                  )
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unassigned Shifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">2</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
