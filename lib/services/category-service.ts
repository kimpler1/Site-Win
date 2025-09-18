import { apiClient } from "../api-client"

export interface Category {
  id: number
  name: string // changed from title to name to match database
  description: string
  image_url: string // changed from image to image_url to match database
  age_category: "children" | "adults" // Added age_category field for filtering
  active: boolean // removed count field as it's not in database
  created_at: string
  updated_at: string
}

export interface Subcategory {
  id: number
  title: string
  description: string
  image: string
  count: number
  active: boolean
  available: boolean
}

export interface CreateCategoryData {
  name: string // changed from title to name
  description: string
  image_url: string // changed from image to image_url
  age_category: "children" | "adults" // Added age_category field for creating categories
  active: boolean // removed count and ageCategory fields
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

class CategoryService {
  async getAll(): Promise<Category[]> {
    try {
      return await apiClient.getCategories()
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      return []
    }
  }

  async getById(id: number): Promise<Category | null> {
    try {
      return await apiClient.getCategory(id)
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error)
      return null
    }
  }

  async create(data: CreateCategoryData): Promise<boolean> {
    try {
      const result = await apiClient.createCategory(data)
      return result.success === true
    } catch (error) {
      console.error("Failed to create category:", error)
      return false
    }
  }

  async update(id: number, data: UpdateCategoryData): Promise<Category | null> {
    try {
      return await apiClient.updateCategory(id, data)
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error)
      return null
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.deleteCategory(id)
      return true
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error)
      return false
    }
  }
}

export const categoryService = new CategoryService()
