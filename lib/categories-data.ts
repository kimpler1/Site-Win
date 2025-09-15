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

// Mock данные категорий с подкатегориями
export const categoriesData: Category[] = []

// CRUD операции для категорий
export const categoryService = {
  getAll: (): Category[] => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("categories")
      return stored ? JSON.parse(stored) : categoriesData
    }
    return categoriesData
  },

  getByAgeCategory: (ageCategory: "children" | "adults"): Category[] => {
    const allCategories = categoryService.getAll()
    return allCategories.filter((category) => category.ageCategory === ageCategory)
  },

  getById: (id: string): Category | undefined => {
    const categories = categoryService.getAll()
    return categories.find((category) => category.id === id)
  },

  create: (category: Omit<Category, "createdAt" | "updatedAt">): Category => {
    const categories = categoryService.getAll()
    const now = new Date().toISOString().split("T")[0]

    const newCategory: Category = {
      ...category,
      createdAt: now,
      updatedAt: now,
    }

    const updatedCategories = [...categories, newCategory]
    if (typeof window !== "undefined") {
      localStorage.setItem("categories", JSON.stringify(updatedCategories))
    }

    return newCategory
  },

  update: (id: string, updates: Partial<Category>): Category | null => {
    const categories = categoryService.getAll()
    const index = categories.findIndex((category) => category.id === id)

    if (index === -1) return null

    const updatedCategory = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    categories[index] = updatedCategory

    if (typeof window !== "undefined") {
      localStorage.setItem("categories", JSON.stringify(categories))
    }

    return updatedCategory
  },

  delete: (id: string): boolean => {
    const categories = categoryService.getAll()
    const filteredCategories = categories.filter((category) => category.id !== id)

    if (filteredCategories.length === categories.length) return false

    if (typeof window !== "undefined") {
      localStorage.setItem("categories", JSON.stringify(filteredCategories))
    }

    return true
  },
}
