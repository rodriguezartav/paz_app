"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Clock, AlertCircle } from "lucide-react"
import { mockTeamMembers } from "@/lib/mock-data"

interface Task {
  id: string
  title: string
  description: string
  assigneeId: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  category: string
}

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Prep vegetables for dinner service",
    description: "Chop onions, peppers, and tomatoes for tonight",
    assigneeId: "team-2",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-01-15T17:00:00",
    category: "Kitchen",
  },
  {
    id: "task-2",
    title: "Clean guest cabins",
    description: "Deep clean cabins 1-4 before check-in",
    assigneeId: "team-4",
    priority: "high",
    status: "pending",
    dueDate: "2024-01-15T14:00:00",
    category: "Housekeeping",
  },
  {
    id: "task-3",
    title: "Inventory check - dry goods",
    description: "Count and record all dry goods in storage",
    assigneeId: "team-2",
    priority: "medium",
    status: "pending",
    dueDate: "2024-01-15T18:00:00",
    category: "Inventory",
  },
  {
    id: "task-4",
    title: "Fix shower in cabin 3",
    description: "Water pressure is low, check pipes",
    assigneeId: "team-5",
    priority: "urgent",
    status: "in-progress",
    dueDate: "2024-01-15T12:00:00",
    category: "Maintenance",
  },
  {
    id: "task-5",
    title: "Prepare welcome packages",
    description: "Assemble welcome packages for arriving guests",
    assigneeId: "team-1",
    priority: "medium",
    status: "completed",
    dueDate: "2024-01-15T10:00:00",
    category: "Guest Services",
  },
]

const priorityColors = {
  low: "bg-slate-100 text-slate-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-amber-100 text-amber-800",
  urgent: "bg-red-100 text-red-800",
}

const statusColors = {
  pending: "bg-slate-100 text-slate-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium" as Task["priority"],
    category: "",
  })

  const getMember = (memberId: string) => {
    return mockTeamMembers.find((m) => m.id === memberId)
  }

  const filteredTasks = tasks.filter((task) => {
    return statusFilter === "all" || task.status === statusFilter
  })

  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task
      )
    )
  }

  const handleAddTask = () => {
    if (!newTask.title) return

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assigneeId: newTask.assigneeId,
      priority: newTask.priority,
      status: "pending",
      dueDate: new Date().toISOString(),
      category: newTask.category || "General",
    }

    setTasks([task, ...tasks])
    setNewTask({
      title: "",
      description: "",
      assigneeId: "",
      priority: "medium",
      category: "",
    })
    setIsAddingTask(false)
  }

  const pendingCount = tasks.filter((t) => t.status === "pending").length
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length
  const completedCount = tasks.filter((t) => t.status === "completed").length
  const urgentCount = tasks.filter(
    (t) => t.priority === "urgent" && t.status !== "completed"
  ).length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Urgent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Task title"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Task description"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Assignee</label>
                <Select
                  value={newTask.assigneeId}
                  onValueChange={(v) =>
                    setNewTask({ ...newTask, assigneeId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newTask.priority}
                  onValueChange={(v) =>
                    setNewTask({ ...newTask, priority: v as Task["priority"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                  placeholder="e.g., Kitchen, Housekeeping"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4">
        {filteredTasks.map((task) => {
          const assignee = getMember(task.assigneeId)
          const initials = assignee?.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()

          return (
            <Card
              key={task.id}
              className={task.status === "completed" ? "opacity-60" : ""}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => handleToggleComplete(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`font-medium ${
                          task.status === "completed" ? "line-through" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      {assignee && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{assignee.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Due{" "}
                          {new Date(task.dueDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
