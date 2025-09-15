export interface Costume {
  id: number
  title: string
  description: string
  category: string
  subcategory: string
  image: string
  size: string
  ageCategory: "children" | "adults"
  price: number
  deposit: number
  available: boolean
  characteristics?: {
    chestCircumference?: string
    sarafanLength?: string
    material?: string
  }
  createdAt: string
  updatedAt: string
}

// Mock данные костюмов
export const costumesData: Costume[] = []

export const costumeService = {
  getAll: (): Costume[] => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("costumes")
      return stored ? JSON.parse(stored) : costumesData
    }
    return costumesData
  },

  getByAgeCategory: (ageCategory: "children" | "adults"): Costume[] => {
    const allCostumes = costumeService.getAll()
    return allCostumes.filter((costume) => costume.ageCategory === ageCategory)
  },

  getStatsByAgeCategory: () => {
    const allCostumes = costumeService.getAll()
    const children = allCostumes.filter((costume) => costume.ageCategory === "children").length
    const adults = allCostumes.filter((costume) => costume.ageCategory === "adults").length
    return { children, adults, total: allCostumes.length }
  },

  getById: (id: number): Costume | undefined => {
    const costumes = costumeService.getAll()
    return costumes.find((costume) => costume.id === id)
  },

  create: (costume: Omit<Costume, "id" | "createdAt" | "updatedAt">): Costume => {
    const costumes = costumeService.getAll()
    const newId = Math.max(...costumes.map((c) => c.id), 0) + 1
    const now = new Date().toISOString().split("T")[0]

    const newCostume: Costume = {
      ...costume,
      id: newId,
      createdAt: now,
      updatedAt: now,
    }

    const updatedCostumes = [...costumes, newCostume]
    if (typeof window !== "undefined") {
      localStorage.setItem("costumes", JSON.stringify(updatedCostumes))
    }

    return newCostume
  },

  update: (id: number, updates: Partial<Costume>): Costume | null => {
    const costumes = costumeService.getAll()
    const index = costumes.findIndex((costume) => costume.id === id)

    if (index === -1) return null

    const updatedCostume = {
      ...costumes[index],
      ...updates,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    costumes[index] = updatedCostume

    if (typeof window !== "undefined") {
      localStorage.setItem("costumes", JSON.stringify(costumes))
    }

    return updatedCostume
  },

  delete: (id: number): boolean => {
    const costumes = costumeService.getAll()
    const filteredCostumes = costumes.filter((costume) => costume.id !== id)

    if (filteredCostumes.length === costumes.length) return false

    if (typeof window !== "undefined") {
      localStorage.setItem("costumes", JSON.stringify(filteredCostumes))
    }

    return true
  },
}
