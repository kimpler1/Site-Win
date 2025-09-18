"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { categoryService, type Category } from "@/lib/services/category-service"
import { subcategoryService, type Subcategory } from "@/lib/services/subcategory-service"
import { ArrowLeft, Upload, X } from "lucide-react"

function NewCostumePageContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    subcategoryId: "",
    ageCategory: "" as "" | "children" | "adults",
    available: true,
  })

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (formData.categoryId) {
      loadSubcategories(formData.categoryId)
    } else {
      setSubcategories([])
      setFormData((prev) => ({ ...prev, subcategoryId: "" }))
    }
  }, [formData.categoryId])

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const loadSubcategories = async (categoryId: string) => {
    try {
      const subcategoriesData = await subcategoryService.getByCategoryId(categoryId)
      setSubcategories(subcategoriesData)
    } catch (error) {
      console.error("Failed to load subcategories:", error)
      setSubcategories([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Form data before validation:", formData)

      if (!formData.name.trim()) {
        alert("Ошибка: Введите название костюма")
        return
      }

      if (!formData.description.trim()) {
        alert("Ошибка: Введите описание костюма")
        return
      }

      if (!formData.price || Number(formData.price) <= 0) {
        alert("Ошибка: Введите корректную цену")
        return
      }

      const categoryIdNumber = Number.parseInt(formData.categoryId, 10)
      console.log("[v0] CategoryId value:", formData.categoryId, "Parsed:", categoryIdNumber)

      if (!formData.categoryId || formData.categoryId === "" || isNaN(categoryIdNumber) || categoryIdNumber <= 0) {
        alert("Ошибка: Выберите категорию")
        return
      }

      const subcategoryIdNumber = Number.parseInt(formData.subcategoryId, 10)
      console.log("[v0] SubcategoryId value:", formData.subcategoryId, "Parsed:", subcategoryIdNumber)

      if (
        !formData.subcategoryId ||
        formData.subcategoryId === "" ||
        isNaN(subcategoryIdNumber) ||
        subcategoryIdNumber <= 0
      ) {
        alert("Ошибка: Выберите подкатегорию")
        return
      }

      if (!formData.ageCategory || formData.ageCategory === "") {
        alert("Ошибка: Выберите возрастную категорию")
        return
      }

      if (!formData.image) {
        alert("Ошибка: Загрузите изображение костюма")
        return
      }

      const costumeData = {
        title: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image,
        categoryId: categoryIdNumber, // Use parsed integer
        subcategoryId: subcategoryIdNumber, // Use parsed integer
        ageCategory: formData.ageCategory,
        available: formData.available,
      }

      console.log("[v0] Creating costume with data:", costumeData)

      const response = await fetch("/api/costumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(costumeData),
      })

      if (response.ok) {
        router.push("/admin/costumes")
      } else {
        const errorData = await response.json()
        console.error("[v0] Error response:", errorData)
        alert("Ошибка при создании костюма: " + (errorData.error || "Неизвестная ошибка"))
      }
    } catch (error) {
      console.error("Failed to create costume:", error)
      alert("Ошибка при создании костюма")
    } finally {
      setLoading(false)
    }
  }

  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(compressedDataUrl)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)

      try {
        const compressedImage = await compressImage(file, 800, 0.8)
        setImagePreview(compressedImage)
        setFormData({ ...formData, image: compressedImage })
      } catch (error) {
        console.error("Error compressing image:", error)
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setImagePreview(result)
          setFormData({ ...formData, image: result })
        }
        reader.readAsDataURL(file)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1">
          <AdminHeader title="Создать костюм" description="Добавьте новый костюм в каталог" />

          <main className="p-6">
            <div className="max-w-2xl">
              <div className="mb-6">
                <Button variant="outline" asChild className="mb-4 bg-transparent">
                  <Link href="/admin/costumes" className="flex items-center space-x-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Назад к костюмам</span>
                  </Link>
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Информация о костюме</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Название костюма</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Например: Русский народный костюм"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Описание костюма и комплектации"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name || category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Подкатегория</Label>
                      <Select
                        value={formData.subcategoryId}
                        onValueChange={(value) => setFormData({ ...formData, subcategoryId: value })}
                        disabled={!formData.categoryId || subcategories.length === 0}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите подкатегорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                              {subcategory.name || subcategory.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ageCategory">Возрастная категория</Label>
                      <Select
                        value={formData.ageCategory}
                        onValueChange={(value: "children" | "adults") =>
                          setFormData({ ...formData, ageCategory: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите возраст" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="children">Для детей</SelectItem>
                          <SelectItem value="adults">Для взрослых</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Цена за сутки (₽)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Изображение костюма</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {imagePreview ? (
                          <div className="space-y-4">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="mx-auto max-h-48 rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setImageFile(null)
                                setImagePreview("")
                                setFormData({ ...formData, image: "" })
                              }}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Удалить изображение
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div>
                              <Label htmlFor="imageUpload" className="cursor-pointer">
                                <span className="text-orange-500 hover:text-orange-600">Загрузить изображение</span>
                                <span className="text-gray-500"> или перетащите файл сюда</span>
                              </Label>
                              <Input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </div>
                            <p className="text-sm text-gray-500">PNG, JPG, GIF до 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600">
                        {loading ? "Создание..." : "Создать костюм"}
                      </Button>
                      <Button type="button" variant="outline" asChild>
                        <Link href="/admin/costumes">Отмена</Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function NewCostumePage() {
  return (
    <AuthGuard>
      <NewCostumePageContent />
    </AuthGuard>
  )
}
