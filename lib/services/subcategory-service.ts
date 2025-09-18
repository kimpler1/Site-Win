import { apiClient } from "../api-client"

export interface Subcategory {
  id: number
  category_id: number
  name: string // using name instead of title to match database
  description: string
  image_url: string
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateSubcategoryData {
  category_id: number
  name: string // using name instead of title
  description: string
  image_url?: string
  active?: boolean
}

export interface UpdateSubcategoryData extends Partial<CreateSubcategoryData> {}

class SubcategoryService {
  async getAll(categoryId?: number): Promise<Subcategory[]> {
    try {
      return await apiClient.getSubcategories(categoryId)
    } catch (error) {
      console.error("Failed to fetch subcategories:", error)
      return []
    }
  }

  async getById(id: number): Promise<Subcategory | null> {
    try {
      const response = await fetch(`/api/subcategories/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch subcategory ${id}:`, error)
      return null
    }
  }

  async create(data: CreateSubcategoryData): Promise<boolean> {
    try {
      const result = await apiClient.createSubcategory(data)
      return result.success === true
    } catch (error) {
      console.error("Failed to create subcategory:", error)
      return false
    }
  }

  async update(id: number, data: UpdateSubcategoryData): Promise<boolean> {
    try {
      const result = await apiClient.updateSubcategory(id, data)
      return result.success === true
    } catch (error) {
      console.error(`Failed to update subcategory ${id}:`, error)
      return false
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.deleteSubcategory(id)
      return true
    } catch (error) {
      console.error(`Failed to delete subcategory ${id}:`, error)
      return false
    }
  }

  async getByCategoryId(categoryId: number): Promise<Subcategory[]> {
    return this.getAll(categoryId)
  }
}

export const subcategoryService = new SubcategoryService()
