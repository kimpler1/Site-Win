class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== "undefined" ? "" : process.env.NEXTAUTH_URL || "http://localhost:3000"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Categories API
  async getCategories() {
    return this.request<any[]>("/categories")
  }

  async getCategory(id: number | string) {
    return this.request<any>(`/categories/${id}`)
  }

  async createCategory(data: any) {
    return this.request<any>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: number | string, data: any) {
    return this.request<any>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: number | string) {
    return this.request<any>(`/categories/${id}`, {
      method: "DELETE",
    })
  }

  // Subcategories API
  async getSubcategories(categoryId?: number | string) {
    const endpoint = categoryId ? `/subcategories?categoryId=${categoryId}` : "/subcategories"
    return this.request<any[]>(endpoint)
  }

  async getSubcategory(id: string) {
    return this.request<any>(`/subcategories/${id}`)
  }

  async createSubcategory(data: any) {
    return this.request<any>("/subcategories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateSubcategory(id: number | string, data: any) {
    return this.request<any>(`/subcategories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteSubcategory(id: number | string) {
    return this.request<any>(`/subcategories/${id}`, {
      method: "DELETE",
    })
  }

  // Costumes API
  async getCostumes(filters?: { categoryId?: number | string; subcategoryId?: number | string; ageCategory?: string }) {
    const params = new URLSearchParams()
    if (filters?.categoryId) params.append("categoryId", filters.categoryId.toString())
    if (filters?.subcategoryId) params.append("subcategoryId", filters.subcategoryId.toString())
    if (filters?.ageCategory) params.append("ageCategory", filters.ageCategory)

    const endpoint = `/costumes${params.toString() ? `?${params.toString()}` : ""}`
    return this.request<any[]>(endpoint)
  }

  async getCostume(id: number | string) {
    return this.request<any>(`/costumes/${id}`)
  }

  async createCostume(data: any) {
    return this.request<any>("/costumes", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCostume(id: number | string, data: any) {
    return this.request<any>(`/costumes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCostume(id: number | string) {
    return this.request<any>(`/costumes/${id}`, {
      method: "DELETE",
    })
  }

  // Stats API
  async getStats() {
    return this.request<any>("/costumes/stats")
  }

  // Admin Authentication
  async login(username: string, password: string) {
    return this.request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async logout() {
    return this.request<{ success: boolean }>("/auth/logout", {
      method: "POST",
    })
  }

  async verifyToken(token: string) {
    return this.request<{ valid: boolean; user: any }>("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }
}

export const apiClient = new ApiClient()
