import type {
  Resident,
  Payment,
  Ingredient,
  Recipe,
  Meal,
  ShoppingListItem,
} from "./types"

// Helper to get dates relative to today
const today = new Date()
const formatDate = (date: Date) => date.toISOString().split("T")[0]
const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Sample Residents
export const residents: Resident[] = [
  {
    id: "r1",
    name: "Sofia Martinez",
    email: "sofia@email.com",
    whatsapp: "+34612345678",
    emergencyContact: "Carlos Martinez +34698765432",
    nationality: "Spain",
    gender: "female",
    age: 28,
    diet: "vegetarian",
    arrivalDate: formatDate(addDays(today, -3)),
    departureDate: formatDate(addDays(today, 4)),
    room: "Ceiba",
    bed: "A",
    status: "staying",
    checkInCompleted: true,
    releaseAccepted: true,
    healthInsuranceConfirmed: true,
    mediaReleaseAccepted: true,
    orientationCompleted: true,
    notes: "Loves early morning yoga",
  },
  {
    id: "r2",
    name: "James Chen",
    email: "james.chen@email.com",
    whatsapp: "+14155551234",
    emergencyContact: "Lisa Chen +14155559876",
    nationality: "United States",
    gender: "male",
    age: 35,
    diet: "eats_all",
    arrivalDate: formatDate(addDays(today, -5)),
    departureDate: formatDate(addDays(today, 2)),
    room: "Almendro",
    bed: "B",
    status: "staying",
    checkInCompleted: true,
    releaseAccepted: true,
    healthInsuranceConfirmed: true,
    mediaReleaseAccepted: true,
    orientationCompleted: true,
    notes: "Experienced surfer",
  },
  {
    id: "r3",
    name: "Emma Lindqvist",
    email: "emma.l@email.com",
    whatsapp: "+46701234567",
    emergencyContact: "Erik Lindqvist +46709876543",
    nationality: "Sweden",
    gender: "female",
    age: 31,
    diet: "vegan",
    arrivalDate: formatDate(addDays(today, -1)),
    departureDate: formatDate(addDays(today, 13)),
    room: "Guapinol",
    bed: "A",
    status: "staying",
    checkInCompleted: true,
    releaseAccepted: true,
    healthInsuranceConfirmed: true,
    mediaReleaseAccepted: true,
    orientationCompleted: true,
    notes: "",
  },
  {
    id: "r4",
    name: "Lucas Silva",
    email: "lucas.silva@email.com",
    whatsapp: "+5511987654321",
    emergencyContact: "Maria Silva +5511912345678",
    nationality: "Brazil",
    gender: "male",
    age: 26,
    diet: "eats_all",
    arrivalDate: formatDate(today),
    departureDate: formatDate(addDays(today, 7)),
    room: "Ceiba",
    bed: "B",
    status: "checked_in",
    checkInCompleted: true,
    releaseAccepted: true,
    healthInsuranceConfirmed: true,
    mediaReleaseAccepted: true,
    orientationCompleted: false,
    notes: "First time in Costa Rica",
  },
  {
    id: "r5",
    name: "Yuki Tanaka",
    email: "yuki.t@email.com",
    whatsapp: "+818012345678",
    emergencyContact: "Kenji Tanaka +818098765432",
    nationality: "Japan",
    gender: "female",
    age: 29,
    diet: "vegetarian",
    arrivalDate: formatDate(addDays(today, 2)),
    departureDate: formatDate(addDays(today, 9)),
    room: "Almendro",
    bed: "A",
    status: "upcoming",
    checkInCompleted: false,
    releaseAccepted: false,
    healthInsuranceConfirmed: false,
    mediaReleaseAccepted: false,
    orientationCompleted: false,
    notes: "Arriving late evening",
  },
  {
    id: "r6",
    name: "Marco Rossi",
    email: "marco.rossi@email.com",
    whatsapp: "+393401234567",
    emergencyContact: "Anna Rossi +393409876543",
    nationality: "Italy",
    gender: "male",
    age: 42,
    diet: "eats_all",
    arrivalDate: formatDate(addDays(today, -7)),
    departureDate: formatDate(today),
    room: "Guapinol",
    bed: "B",
    status: "checking_out_today",
    checkInCompleted: true,
    releaseAccepted: true,
    healthInsuranceConfirmed: true,
    mediaReleaseAccepted: true,
    orientationCompleted: true,
    notes: "Interested in bird watching tours",
  },
  {
    id: "r7",
    name: "Amelie Dubois",
    email: "amelie.d@email.com",
    whatsapp: "+33612345678",
    emergencyContact: "Pierre Dubois +33698765432",
    nationality: "France",
    gender: "female",
    age: 33,
    diet: "eats_all",
    arrivalDate: formatDate(addDays(today, -10)),
    departureDate: formatDate(addDays(today, -3)),
    room: "Ceiba",
    bed: "B",
    status: "checked_out",
    checkInCompleted: true,
    releaseAccepted: true,
    healthInsuranceConfirmed: true,
    mediaReleaseAccepted: true,
    orientationCompleted: true,
    notes: "",
  },
  {
    id: "r8",
    name: "Oliver Thompson",
    email: "oliver.t@email.com",
    whatsapp: "+447912345678",
    emergencyContact: "Sarah Thompson +447998765432",
    nationality: "United Kingdom",
    gender: "male",
    age: 27,
    diet: "eats_all",
    arrivalDate: formatDate(addDays(today, 5)),
    departureDate: formatDate(addDays(today, 12)),
    room: "",
    bed: "",
    status: "upcoming",
    checkInCompleted: false,
    releaseAccepted: false,
    healthInsuranceConfirmed: false,
    mediaReleaseAccepted: false,
    orientationCompleted: false,
    notes: "Cancelled due to flight issues",
  },
]

// Sample Payments
export const payments: Payment[] = [
  {
    id: "p1",
    residentId: "r1",
    totalAmount: 490,
    pricePerNight: 70,
    depositAmount: 140,
    amountPaid: 490,
    balanceDue: 0,
    currency: "USD",
    status: "paid",
    method: "stripe",
    paymentDate: formatDate(addDays(today, -10)),
    proofUrl: null,
    notes: "",
  },
  {
    id: "p2",
    residentId: "r2",
    totalAmount: 490,
    pricePerNight: 70,
    depositAmount: 140,
    amountPaid: 310,
    balanceDue: 180,
    currency: "USD",
    status: "partially_paid",
    method: "paypal",
    paymentDate: formatDate(addDays(today, -7)),
    proofUrl: null,
    notes: "Will pay remaining on checkout",
  },
  {
    id: "p3",
    residentId: "r3",
    totalAmount: 980,
    pricePerNight: 70,
    depositAmount: 196,
    amountPaid: 980,
    balanceDue: 0,
    currency: "USD",
    status: "paid",
    method: "bank_transfer",
    paymentDate: formatDate(addDays(today, -5)),
    proofUrl: null,
    notes: "",
  },
  {
    id: "p4",
    residentId: "r4",
    totalAmount: 490,
    pricePerNight: 70,
    depositAmount: 140,
    amountPaid: 140,
    balanceDue: 350,
    currency: "USD",
    status: "deposit_paid",
    method: "sinpe",
    paymentDate: formatDate(addDays(today, -3)),
    proofUrl: null,
    notes: "",
  },
  {
    id: "p5",
    residentId: "r5",
    totalAmount: 490,
    pricePerNight: 70,
    depositAmount: 140,
    amountPaid: 0,
    balanceDue: 490,
    currency: "USD",
    status: "unpaid",
    method: "other",
    paymentDate: null,
    proofUrl: null,
    notes: "Awaiting deposit",
  },
  {
    id: "p6",
    residentId: "r6",
    totalAmount: 315000,
    pricePerNight: 45000,
    depositAmount: 90000,
    amountPaid: 270000,
    balanceDue: 45000,
    currency: "CRC",
    status: "partially_paid",
    method: "cash",
    paymentDate: formatDate(addDays(today, -7)),
    proofUrl: null,
    notes: "Paying balance today in cash",
  },
  {
    id: "p7",
    residentId: "r7",
    totalAmount: 490,
    pricePerNight: 70,
    depositAmount: 140,
    amountPaid: 490,
    balanceDue: 0,
    currency: "USD",
    status: "paid",
    method: "stripe",
    paymentDate: formatDate(addDays(today, -15)),
    proofUrl: null,
    notes: "",
  },
  {
    id: "p8",
    residentId: "r8",
    totalAmount: 490,
    pricePerNight: 70,
    depositAmount: 140,
    amountPaid: 140,
    balanceDue: 350,
    currency: "USD",
    status: "refunded",
    method: "stripe",
    paymentDate: formatDate(addDays(today, -2)),
    proofUrl: null,
    notes: "Refunded due to cancellation",
  },
]

// Sample Ingredients
export const ingredients: Ingredient[] = [
  { id: "i1", name: "Rice", type: "staple", measurement: "kg" },
  { id: "i2", name: "Beans", type: "staple", measurement: "kg" },
  { id: "i3", name: "Lentils", type: "staple", measurement: "kg" },
  { id: "i4", name: "Eggs", type: "protein", measurement: "unit" },
  { id: "i5", name: "Chicken", type: "protein", measurement: "kg" },
  { id: "i6", name: "Fish", type: "protein", measurement: "kg" },
  { id: "i7", name: "Cabbage", type: "vegetable", measurement: "unit" },
  { id: "i8", name: "Carrots", type: "vegetable", measurement: "kg" },
  { id: "i9", name: "Tomato", type: "vegetable", measurement: "kg" },
  { id: "i10", name: "Onion", type: "vegetable", measurement: "unit" },
  { id: "i11", name: "Cucumber", type: "vegetable", measurement: "unit" },
  { id: "i12", name: "Plantain", type: "fruit", measurement: "unit" },
  { id: "i13", name: "Yucca", type: "staple", measurement: "kg" },
  { id: "i14", name: "Papaya", type: "fruit", measurement: "unit" },
  { id: "i15", name: "Banana", type: "fruit", measurement: "unit" },
  { id: "i16", name: "Coffee", type: "staple", measurement: "kg" },
  { id: "i17", name: "Oil", type: "condiment", measurement: "ml" },
  { id: "i18", name: "Salt", type: "condiment", measurement: "kg" },
  { id: "i19", name: "Garlic", type: "condiment", measurement: "tbsp" },
  { id: "i20", name: "Garbage bags", type: "cleaning", measurement: "unit" },
  { id: "i21", name: "Dish soap", type: "cleaning", measurement: "ml" },
]

// Sample Recipes
export const recipes: Recipe[] = [
  {
    id: "rec1",
    name: "Rice and Beans",
    description: "Traditional Costa Rican gallo pinto style rice and beans",
    notes: "Cook beans the day before for best results",
    ingredients: [
      { ingredientId: "i1", amount: 1, measurement: "kg" },
      { ingredientId: "i2", amount: 0.7, measurement: "kg" },
      { ingredientId: "i10", amount: 2, measurement: "unit" },
      { ingredientId: "i19", amount: 2, measurement: "tbsp" },
      { ingredientId: "i17", amount: 100, measurement: "ml" },
      { ingredientId: "i18", amount: 0.002, measurement: "kg" },
    ],
  },
  {
    id: "rec2",
    name: "Chicken with Vegetables",
    description: "Roasted chicken with seasonal vegetables",
    notes: "Can substitute with tofu for vegetarians",
    ingredients: [
      { ingredientId: "i5", amount: 2, measurement: "kg" },
      { ingredientId: "i8", amount: 1, measurement: "kg" },
      { ingredientId: "i10", amount: 2, measurement: "unit" },
      { ingredientId: "i9", amount: 1, measurement: "kg" },
      { ingredientId: "i19", amount: 2, measurement: "tbsp" },
      { ingredientId: "i17", amount: 100, measurement: "ml" },
      { ingredientId: "i18", amount: 0.002, measurement: "kg" },
    ],
  },
  {
    id: "rec3",
    name: "Lentil Stew",
    description: "Hearty vegan lentil stew with vegetables",
    notes: "Great protein source for vegans",
    ingredients: [
      { ingredientId: "i3", amount: 1, measurement: "kg" },
      { ingredientId: "i8", amount: 1, measurement: "kg" },
      { ingredientId: "i10", amount: 2, measurement: "unit" },
      { ingredientId: "i19", amount: 2, measurement: "tbsp" },
      { ingredientId: "i9", amount: 1, measurement: "kg" },
      { ingredientId: "i17", amount: 80, measurement: "ml" },
      { ingredientId: "i18", amount: 0.002, measurement: "kg" },
    ],
  },
  {
    id: "rec4",
    name: "Cabbage Cucumber Salad",
    description: "Fresh crunchy salad with simple dressing",
    notes: "Best served immediately",
    ingredients: [
      { ingredientId: "i7", amount: 1, measurement: "unit" },
      { ingredientId: "i11", amount: 2, measurement: "unit" },
      { ingredientId: "i18", amount: 0.001, measurement: "kg" },
      { ingredientId: "i17", amount: 50, measurement: "ml" },
    ],
  },
  {
    id: "rec5",
    name: "Vegetable Soup",
    description: "Warming vegetable soup with yucca and carrots",
    notes: "Can add more vegetables based on availability",
    ingredients: [
      { ingredientId: "i13", amount: 1, measurement: "kg" },
      { ingredientId: "i8", amount: 1, measurement: "kg" },
      { ingredientId: "i10", amount: 2, measurement: "unit" },
      { ingredientId: "i19", amount: 1, measurement: "tbsp" },
      { ingredientId: "i18", amount: 0.002, measurement: "kg" },
    ],
  },
  {
    id: "rec6",
    name: "Eggs and Plantains",
    description: "Classic breakfast with scrambled eggs and fried plantains",
    notes: "Use ripe plantains for sweeter taste",
    ingredients: [
      { ingredientId: "i4", amount: 12, measurement: "unit" },
      { ingredientId: "i12", amount: 8, measurement: "unit" },
      { ingredientId: "i17", amount: 50, measurement: "ml" },
      { ingredientId: "i18", amount: 0.001, measurement: "kg" },
    ],
  },
  {
    id: "rec7",
    name: "Fruit Plate",
    description: "Fresh tropical fruit selection",
    notes: "Adjust based on what is in season",
    ingredients: [
      { ingredientId: "i14", amount: 2, measurement: "unit" },
      { ingredientId: "i15", amount: 12, measurement: "unit" },
    ],
  },
  {
    id: "rec8",
    name: "Fish with Rice",
    description: "Fresh local fish served with seasoned rice",
    notes: "Best with fresh-caught fish",
    ingredients: [
      { ingredientId: "i6", amount: 2, measurement: "kg" },
      { ingredientId: "i1", amount: 1, measurement: "kg" },
      { ingredientId: "i19", amount: 2, measurement: "tbsp" },
      { ingredientId: "i17", amount: 80, measurement: "ml" },
      { ingredientId: "i18", amount: 0.002, measurement: "kg" },
    ],
  },
]

// Sample Meals - using relative dates
const monday = addDays(today, -today.getDay() + 1)
const wednesday = addDays(monday, 2)
const saturday = addDays(monday, 5)

export const meals: Meal[] = [
  {
    id: "m1",
    date: formatDate(monday),
    mealType: "breakfast",
    eatsAllResidents: 5,
    vegetarianResidents: 2,
    veganResidents: 1,
    extraEatsAllGuests: 0,
    extraVegetarianGuests: 0,
    extraVeganGuests: 0,
    recipeIds: ["rec6", "rec7"],
    notes: "",
  },
  {
    id: "m2",
    date: formatDate(monday),
    mealType: "brunch",
    eatsAllResidents: 5,
    vegetarianResidents: 2,
    veganResidents: 1,
    extraEatsAllGuests: 1,
    extraVegetarianGuests: 0,
    extraVeganGuests: 0,
    recipeIds: ["rec1", "rec4"],
    notes: "",
  },
  {
    id: "m3",
    date: formatDate(monday),
    mealType: "dinner",
    eatsAllResidents: 5,
    vegetarianResidents: 2,
    veganResidents: 1,
    extraEatsAllGuests: 0,
    extraVegetarianGuests: 0,
    extraVeganGuests: 0,
    recipeIds: ["rec5"],
    notes: "",
  },
  {
    id: "m4",
    date: formatDate(wednesday),
    mealType: "brunch",
    eatsAllResidents: 8,
    vegetarianResidents: 3,
    veganResidents: 1,
    extraEatsAllGuests: 2,
    extraVegetarianGuests: 1,
    extraVeganGuests: 0,
    recipeIds: ["rec1", "rec2", "rec4"],
    notes: "Local visitors joining",
  },
  {
    id: "m5",
    date: formatDate(wednesday),
    mealType: "dinner",
    eatsAllResidents: 8,
    vegetarianResidents: 3,
    veganResidents: 1,
    extraEatsAllGuests: 0,
    extraVegetarianGuests: 0,
    extraVeganGuests: 1,
    recipeIds: ["rec3", "rec4"],
    notes: "",
  },
  {
    id: "m6",
    date: formatDate(saturday),
    mealType: "brunch",
    eatsAllResidents: 9,
    vegetarianResidents: 3,
    veganResidents: 2,
    extraEatsAllGuests: 4,
    extraVegetarianGuests: 1,
    extraVeganGuests: 0,
    recipeIds: ["rec1", "rec8", "rec4"],
    notes: "Weekend gathering",
  },
  {
    id: "m7",
    date: formatDate(saturday),
    mealType: "dinner",
    eatsAllResidents: 9,
    vegetarianResidents: 3,
    veganResidents: 2,
    extraEatsAllGuests: 5,
    extraVegetarianGuests: 0,
    extraVeganGuests: 1,
    recipeIds: ["rec2", "rec5"],
    notes: "",
  },
]

// Generate Shopping List from meals and recipes
export function generateShoppingList(): ShoppingListItem[] {
  const ingredientTotals: Map<string, { amount: number; ingredient: Ingredient }> = new Map()

  meals.forEach((meal) => {
    meal.recipeIds.forEach((recipeId) => {
      const recipe = recipes.find((r) => r.id === recipeId)
      if (recipe) {
        recipe.ingredients.forEach((ri) => {
          const ingredient = ingredients.find((i) => i.id === ri.ingredientId)
          if (ingredient) {
            const existing = ingredientTotals.get(ri.ingredientId)
            if (existing) {
              existing.amount += ri.amount
            } else {
              ingredientTotals.set(ri.ingredientId, {
                amount: ri.amount,
                ingredient,
              })
            }
          }
        })
      }
    })
  })

  return Array.from(ingredientTotals.entries()).map(([id, data], index) => ({
    id: `sl${index + 1}`,
    ingredientId: id,
    ingredientName: data.ingredient.name,
    type: data.ingredient.type,
    measurement: data.ingredient.measurement,
    totalAmountNeeded: Math.round(data.amount * 100) / 100,
    status: index % 3 === 0 ? "bought" : index % 5 === 0 ? "in_stock" : "needed",
  }))
}

export const shoppingList = generateShoppingList()

// Helper functions
export function getResidentById(id: string): Resident | undefined {
  return residents.find((r) => r.id === id)
}

export function getPaymentByResidentId(residentId: string): Payment | undefined {
  return payments.find((p) => p.residentId === residentId)
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id)
}

export function getIngredientById(id: string): Ingredient | undefined {
  return ingredients.find((i) => i.id === id)
}

export function calculateNights(arrival: string, departure: string): number {
  const arrivalDate = new Date(arrival)
  const departureDate = new Date(departure)
  const diffTime = departureDate.getTime() - arrivalDate.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
