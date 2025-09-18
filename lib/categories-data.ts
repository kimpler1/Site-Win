export interface Subcategory {
  id: string
  title: string
  description: string
  image?: string
  count: string
  active: boolean
  available: boolean
}

export interface Category {
  id: string
  title: string
  description: string
  image: string
  count: string
  active: boolean
  ageCategory: "children" | "adults"
  createdAt: string
  updatedAt: string
  subcategories?: Subcategory[]
}

import { getApiUrl } from "./api-utils"

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await fetch(getApiUrl("/api/categories"))
      if (!response.ok) throw new Error("Failed to fetch categories")
      return await response.json()
    } catch (error) {
      console.error("Error fetching categories:", error)
      return []
    }
  },

  getByAgeCategory: async (ageCategory: "children" | "adults"): Promise<Category[]> => {
    try {
      const response = await fetch(getApiUrl(`/api/categories?ageCategory=${ageCategory}`))
      if (!response.ok) throw new Error("Failed to fetch categories")
      const categories = await response.json()
      return categories.filter((cat: Category) => cat.ageCategory === ageCategory && cat.active)
    } catch (error) {
      console.error("Error fetching categories by age:", error)
      return []
    }
  },

  getById: async (id: string): Promise<Category | null> => {
    try {
      const response = await fetch(getApiUrl(`/api/categories/${id}`))
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error("Error fetching category by id:", error)
      return null
    }
  },

  create: async (category: Omit<Category, "createdAt" | "updatedAt">): Promise<Category | null> => {
    try {
      const response = await fetch(getApiUrl("/api/categories"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      })
      if (!response.ok) throw new Error("Failed to create category")
      return await categoryService.getById(category.id)
    } catch (error) {
      console.error("Error creating category:", error)
      return null
    }
  },

  update: async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    try {
      const response = await fetch(getApiUrl(`/api/categories/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update category")
      return await categoryService.getById(id)
    } catch (error) {
      console.error("Error updating category:", error)
      return null
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(getApiUrl(`/api/categories/${id}`), {
        method: "DELETE",
      })
      return response.ok
    } catch (error) {
      console.error("Error deleting category:", error)
      return false
    }
  },
}
