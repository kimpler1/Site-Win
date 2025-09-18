"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { categoryService, type Category } from "@/lib/services/category-service"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"

interface Subcategory {
  id: string
  title: string
  description: string
  image: string
  count: string
  active: boolean
  available: boolean
}

function EditCategoryPageContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    ageCategory: "children" as "children" | "adults",
    count: 0,
    active: true,
  })

  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  useEffect(() => {
    loadCategory()
  }, [params.id])

  const loadCategory = async () => {
    try {
      const data = await categoryService.getById(params.id as any)
      if (data) {
        setCategory(data)
        setFormData({
          title: data.title,
          description: data.description,
          image: data.image || "",
          ageCategory: data.ageCategory || "children",
          count: typeof data.count === "string" ? Number.parseInt(data.count) || 0 : data.count,
          active: data.active !== false,
        })
        setImagePreview(data.image || "")

        const subcategoriesResponse = await fetch(`/api/subcategories?categoryId=${params.id}`)
        if (subcategoriesResponse.ok) {
          const subcategoriesData = await subcategoriesResponse.json()
          setSubcategories(subcategoriesData)
        }
      }
    } catch (error) {
      console.error("Failed to load category:", error)
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

  const addSubcategory = () => {
    const newSubcategory: Subcategory = {
      id: `temp-${Date.now()}`,
      title: "",
      description: "",
      image: "",
      count: "0 костюмов",
      active: true,
      available: true,
    }
    setSubcategories([...subcategories, newSubcategory])
  }

  const updateSubcategory = (index: number, field: keyof Subcategory, value: any) => {
    const updated = [...subcategories]
    updated[index] = { ...updated[index], [field]: value }
    setSubcategories(updated)
  }

  const removeSubcategory = async (index: number) => {
    const subcategory = subcategories[index]

    // If it's an existing subcategory (not temp), delete from database
    if (!subcategory.id.startsWith("temp-")) {
      try {
        await fetch(`/api/subcategories/${subcategory.id}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Failed to delete subcategory:", error)
      }
    }

    setSubcategories(subcategories.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await categoryService.update(params.id as any, {
        ...formData,
        subcategories: subcategories.filter((sub) => sub.title.trim() !== ""),
      })

      if (success) {
        // Save subcategories
        for (const subcategory of subcategories) {
          if (subcategory.title.trim() === "") continue

          if (subcategory.id.startsWith("temp-")) {
            // Create new subcategory
            await fetch("/api/subcategories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                categoryId: params.id,
                title: subcategory.title,
                description: subcategory.description,
                image: subcategory.image,
                count: subcategory.count,
                active: subcategory.active,
                available: subcategory.available,
              }),
            })
          } else {
            // Update existing subcategory
            await fetch(`/api/subcategories/${subcategory.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: subcategory.title,
                description: subcategory.description,
                image: subcategory.image,
                count: subcategory.count,
                active: subcategory.active,
                available: subcategory.available,
              }),
            })
          }
        }

        router.push("/admin/categories")
      } else {
        alert("Ошибка при обновлении категории")
      }
    } catch (error) {
      console.error("Failed to update category:", error)
      alert("Ошибка при обновлении категории")
    } finally {
      setLoading(false)
    }
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Загрузка категории...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1">
          <AdminHeader title="Редактировать категорию" description={`Изменение категории "${category.title}"`} />

          <main className="p-6">
            <div className="max-w-6xl">
              <div className="mb-6">
                <Button variant="outline" asChild className="mb-4 bg-transparent">
                  <Link href="/admin/categories" className="flex items-center space-x-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Назад к категориям</span>
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Информация о категории</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Название категории</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Описание</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ageCategory">Возрастная категория</Label>
                          <Select
                            value={formData.ageCategory}
                            onValueChange={(value: "children" | "adults") =>
                              setFormData({ ...formData, ageCategory: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите возрастную категорию" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="children">Детские</SelectItem>
                              <SelectItem value="adults">Взрослые</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="image">Изображение категории</Label>
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
                            {loading ? "Сохранение..." : "Сохранить изменения"}
                          </Button>
                          <Button type="button" variant="outline" asChild>
                            <Link href="/admin/categories">Отмена</Link>
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Подкатегории</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addSubcategory}>
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {subcategories.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">Подкатегории не добавлены</p>
                        ) : (
                          subcategories.map((subcategory, index) => (
                            <div key={subcategory.id} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Подкатегория {index + 1}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSubcategory(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>

                              <Input
                                placeholder="Название подкатегории"
                                value={subcategory.title}
                                onChange={(e) => updateSubcategory(index, "title", e.target.value)}
                              />

                              <Textarea
                                placeholder="Описание"
                                value={subcategory.description}
                                onChange={(e) => updateSubcategory(index, "description", e.target.value)}
                                rows={2}
                              />

                              <div className="space-y-2">
                                <Label className="text-sm">Изображение подкатегории</Label>
                                <div className="border border-dashed border-gray-300 rounded p-3 text-center">
                                  {subcategory.image ? (
                                    <div className="space-y-2">
                                      <img
                                        src={subcategory.image || "/placeholder.svg"}
                                        alt="Preview"
                                        className="mx-auto max-h-24 rounded"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateSubcategory(index, "image", "")}
                                      >
                                        <X className="w-3 h-3 mr-1" />
                                        Удалить
                                      </Button>
                                    </div>
                                  ) : (
                                    <div>
                                      <Label htmlFor={`subcategoryImage-${index}`} className="cursor-pointer">
                                        <span className="text-orange-500 hover:text-orange-600 text-sm">Загрузить</span>
                                      </Label>
                                      <Input
                                        id={`subcategoryImage-${index}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0]
                                          if (file) {
                                            try {
                                              const compressedImage = await compressImage(file, 800, 0.8)
                                              updateSubcategory(index, "image", compressedImage)
                                            } catch (error) {
                                              console.error("Error compressing image:", error)
                                              const reader = new FileReader()
                                              reader.onload = (e) => {
                                                const result = e.target?.result as string
                                                updateSubcategory(index, "image", result)
                                              }
                                              reader.readAsDataURL(file)
                                            }
                                          }
                                        }}
                                        className="hidden"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <EditCategoryPageContent params={params} />
    </AuthGuard>
  )
}
