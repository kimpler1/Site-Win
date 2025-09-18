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

import { getApiUrl } from "./api-utils"

export const costumeService = {
  getAll: async (): Promise<Costume[]> => {
    try {
      const response = await fetch(getApiUrl("/api/costumes"))
      if (!response.ok) throw new Error("Failed to fetch costumes")
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Error fetching costumes:", error)
      return []
    }
  },

  getByAgeCategory: async (ageCategory: "children" | "adults"): Promise<Costume[]> => {
    try {
      const response = await fetch(getApiUrl(`/api/costumes?ageCategory=${ageCategory}`))
      if (!response.ok) throw new Error("Failed to fetch costumes")
      const data = await response.json()
      const costumes = Array.isArray(data) ? data : []
      return costumes.filter((costume: Costume) => costume.ageCategory === ageCategory)
    } catch (error) {
      console.error("Error fetching costumes by age:", error)
      return []
    }
  },

  getStatsByAgeCategory: async () => {
    try {
      const response = await fetch(getApiUrl("/api/costumes/stats"))
      if (!response.ok) throw new Error("Failed to fetch costume stats")
      return await response.json()
    } catch (error) {
      console.error("Error fetching costume stats:", error)
      return { children: 0, adults: 0, total: 0 }
    }
  },

  getById: async (id: number): Promise<Costume | null> => {
    try {
      const response = await fetch(getApiUrl(`/api/costumes/${id}`))
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error("Error fetching costume by id:", error)
      return null
    }
  },

  create: async (costume: Omit<Costume, "id" | "createdAt" | "updatedAt">): Promise<Costume | null> => {
    try {
      const response = await fetch(getApiUrl("/api/costumes"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costume),
      })
      if (!response.ok) throw new Error("Failed to create costume")
      const result = await response.json()
      return result.costume || null
    } catch (error) {
      console.error("Error creating costume:", error)
      return null
    }
  },

  update: async (id: number, updates: Partial<Costume>): Promise<Costume | null> => {
    try {
      const response = await fetch(getApiUrl(`/api/costumes/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update costume")
      return await costumeService.getById(id)
    } catch (error) {
      console.error("Error updating costume:", error)
      return null
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(getApiUrl(`/api/costumes/${id}`), {
        method: "DELETE",
      })
      return response.ok
    } catch (error) {
      console.error("Error deleting costume:", error)
      return false
    }
  },
}
