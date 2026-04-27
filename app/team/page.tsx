"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Plus, Phone, Mail, Calendar, Clock, Search } from "lucide-react"
import { mockTeamMembers } from "@/lib/mock-data"
import type { TeamMember } from "@/lib/types"

const roleColors: Record<string, string> = {
  manager: "bg-primary text-primary-foreground",
  chef: "bg-amber-100 text-amber-800",
  "sous-chef": "bg-orange-100 text-orange-800",
  server: "bg-blue-100 text-blue-800",
  housekeeper: "bg-green-100 text-green-800",
  maintenance: "bg-slate-100 text-slate-800",
  receptionist: "bg-purple-100 text-purple-800",
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
  })

  const roles = [...new Set(teamMembers.map((m) => m.role))]

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role) return

    const member: TeamMember = {
      id: `team-${Date.now()}`,
      name: newMember.name,
      role: newMember.role as TeamMember["role"],
      phone: newMember.phone,
      email: newMember.email,
      startDate: new Date().toISOString(),
      status: "active",
      schedule: [],
    }

    setTeamMembers([...teamMembers, member])
    setNewMember({ name: "", role: "", phone: "", email: "" })
    setIsAddingMember(false)
  }

  const activeMembers = teamMembers.filter((m) => m.status === "active").length
  const onLeaveMembers = teamMembers.filter((m) => m.status === "on-leave").length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{onLeaveMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  placeholder="Full name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={newMember.role}
                  onValueChange={(v) => setNewMember({ ...newMember, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="sous-chef">Sous Chef</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="housekeeper">Housekeeper</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                  placeholder="+506 8888-8888"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const initials = member.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()

          return (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{member.name}</h3>
                      <Badge
                        variant={member.status === "active" ? "default" : "secondary"}
                        className={
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : member.status === "on-leave"
                            ? "bg-amber-100 text-amber-800"
                            : ""
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <Badge className={`mt-1 ${roleColors[member.role] || ""}`}>
                      {member.role}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Started {new Date(member.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {member.schedule.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">This Week</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.schedule.slice(0, 3).map((shift, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {shift.day}: {shift.startTime}-{shift.endTime}
                        </Badge>
                      ))}
                      {member.schedule.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.schedule.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
