"use client"

import type React from "react"
import { useState } from "react"
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
import { categoryService } from "@/lib/services/category-service"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"

interface Subcategory {
  id: string
  title: string
  description: string
  image: string
  count: number
  active: boolean
  available: boolean
}

function NewCategoryPageContent() {
  const router = useRouter()
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

  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // Вычисляем новые размеры с сохранением пропорций
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        // Рисуем сжатое изображение
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Конвертируем в base64 с заданным качеством
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
        // Сжимаем изображение перед сохранением
        const compressedImage = await compressImage(file, 800, 0.8)
        setImagePreview(compressedImage)
        setFormData({ ...formData, image: compressedImage })
      } catch (error) {
        console.error("[v0] Error compressing image:", error)
        // Fallback к обычной загрузке без сжатия
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
      count: 0,
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

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const categoryData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        count: formData.count,
        active: formData.active,
        ageCategory: formData.ageCategory,
        subcategories: subcategories.filter((sub) => sub.title.trim() !== ""),
      }

      console.log("[v0] Submitting category data:", categoryData)
      const success = await categoryService.create(categoryData)
      if (success) {
        router.push("/admin/categories")
      } else {
        alert("Ошибка при создании категории")
      }
    } catch (error) {
      console.error("Failed to create category:", error)
      alert("Ошибка при создании категории")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1">
          <AdminHeader title="Создать категорию" description="Добавьте новую категорию костюмов" />

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
                            placeholder="Например: Национальные костюмы"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Описание</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Краткое описание категории"
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
                            {loading ? "Создание..." : "Создать категорию"}
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

export default function NewCategoryPage() {
  return (
    <AuthGuard>
      <NewCategoryPageContent />
    </AuthGuard>
  )
}
