import { apiClient } from "../api-client"

export interface Costume {
  id: number
  name: string // Maps to title in database
  description: string
  image: string // Maps to image_url in database
  price: number // Maps to price_per_day in database
  age_category: "children" | "adults"
  category_id: number
  subcategory_id?: number
  available: boolean
  created_at: string
  updated_at: string
}

export interface CreateCostumeData {
  name: string
  description: string
  image: string
  price: number
  age_category: "children" | "adults"
  category_id: number
  subcategory_id?: number
  available?: boolean
}

export interface UpdateCostumeData extends Partial<CreateCostumeData> {}

export interface CostumeFilters {
  categoryId?: number
  subcategoryId?: number
  ageCategory?: string
}

class CostumeService {
  async getAll(filters?: CostumeFilters): Promise<Costume[]> {
    try {
      return await apiClient.getCostumes(filters)
    } catch (error) {
      console.error("Failed to fetch costumes:", error)
      return []
    }
  }

  async getById(id: number): Promise<Costume | null> {
    try {
      return await apiClient.getCostume(id)
    } catch (error) {
      console.error(`Failed to fetch costume ${id}:`, error)
      return null
    }
  }

  async getByCategory(categoryId: number): Promise<Costume[]> {
    return this.getAll({ categoryId })
  }

  async getByAgeCategory(ageCategory: string): Promise<Costume[]> {
    return this.getAll({ ageCategory })
  }

  async create(data: CreateCostumeData): Promise<Costume | null> {
    try {
      return await apiClient.createCostume(data)
    } catch (error) {
      console.error("Failed to create costume:", error)
      return null
    }
  }

  async update(id: number, data: UpdateCostumeData): Promise<Costume | null> {
    try {
      return await apiClient.updateCostume(id, data)
    } catch (error) {
      console.error(`Failed to update costume ${id}:`, error)
      return null
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await apiClient.deleteCostume(id)
      return true
    } catch (error) {
      console.error(`Failed to delete costume ${id}:`, error)
      return false
    }
  }

  async getStats(): Promise<any> {
    try {
      return await apiClient.getStats()
    } catch (error) {
      console.error("Failed to fetch costume stats:", error)
      return { total: 0, available: 0, categories: 0 }
    }
  }
}

export const costumeService = new CostumeService()
