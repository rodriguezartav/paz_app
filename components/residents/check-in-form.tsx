"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Leaf, Check } from "lucide-react"

const stayAgreements = [
  "I understand Paz is a shared living environment, not a hotel.",
  "I understand I make my own bed using the clean linens area.",
  "I understand phones are not used in public spaces.",
  "I understand Paz is substance-free in shared areas.",
  "I understand I am responsible for my own room and bathroom garbage.",
  "I understand I need health insurance.",
  "I understand surfing, hiking, sauna, ocean, rainforest, storms, branches, flooding, animals, insects, and remote travel carry risks.",
  "I understand Osa Mia S.A. does not cover medical expenses or transportation.",
  "I accept the responsibility release.",
  "I accept the required media release.",
]

const checkInSteps = [
  "Pick clean linens",
  "Pick clean towel",
  "Make your own bed",
  "Place dirty linens only in Dirty Linens area",
  "Learn kitchen, garbage, recycling, and compost rules",
]

export function CheckInForm() {
  const [agreements, setAgreements] = useState<boolean[]>(new Array(stayAgreements.length).fill(false))
  const [steps, setSteps] = useState<boolean[]>(new Array(checkInSteps.length).fill(false))
  const [submitted, setSubmitted] = useState(false)

  const allAgreementsChecked = agreements.every(Boolean)
  const allStepsCompleted = steps.every(Boolean)
  const canSubmit = allAgreementsChecked && allStepsCompleted

  const handleAgreementChange = (index: number, checked: boolean) => {
    const newAgreements = [...agreements]
    newAgreements[index] = checked
    setAgreements(newAgreements)
  }

  const handleStepChange = (index: number, checked: boolean) => {
    const newSteps = [...steps]
    newSteps[index] = checked
    setSteps(newSteps)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <CardContent className="py-12">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Welcome to Paz
          </h2>
          <p className="text-muted-foreground mb-6">
            Your check-in is complete. Settle in and enjoy the rhythm of the land.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Return to Form
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Welcome Header */}
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-7 h-7 text-secondary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Welcome to Paz
          </h2>
          <p className="text-muted-foreground">
            Complete your check-in before settling into the rhythm of the land.
          </p>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input placeholder="Your full name" required />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" placeholder="your@email.com" required />
            </Field>
            <Field>
              <FieldLabel>WhatsApp</FieldLabel>
              <Input placeholder="+1 234 567 8900" required />
            </Field>
            <Field>
              <FieldLabel>Emergency Contact</FieldLabel>
              <Input placeholder="Name and phone number" required />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Arrival Date</FieldLabel>
                <Input type="date" required />
              </Field>
              <Field>
                <FieldLabel>Departure Date</FieldLabel>
                <Input type="date" required />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Nationality</FieldLabel>
              <Input placeholder="Your country" required />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Age</FieldLabel>
                <Input type="number" placeholder="Your age" min={18} required />
              </Field>
            </div>
            <Field>
              <FieldLabel>Diet</FieldLabel>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eats_all">Eats All</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Stay Agreement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stay Agreement</CardTitle>
          <CardDescription>
            Please read and acknowledge each statement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stayAgreements.map((agreement, index) => (
              <label
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={agreements[index]}
                  onCheckedChange={(checked) => handleAgreementChange(index, checked === true)}
                  className="mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{agreement}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Check-In Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Check-In Steps</CardTitle>
          <CardDescription>
            Complete these steps as you settle in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checkInSteps.map((step, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={steps[index]}
                  onCheckedChange={(checked) => handleStepChange(index, checked === true)}
                />
                <span className={`text-sm ${steps[index] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {step}
                </span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!canSubmit}
      >
        Complete Check-In
      </Button>

      {!canSubmit && (
        <p className="text-center text-sm text-muted-foreground">
          Please complete all agreements and check-in steps to continue
        </p>
      )}
    </form>
  )
}
