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
import { costumeService, type Costume } from "@/lib/services/costume-service"
import { categoryService, type Category } from "@/lib/services/category-service"
import { ArrowLeft } from "lucide-react"

interface EditCostumePageProps {
  params: {
    id: string
  }
}

function EditCostumePageContent({ params }: EditCostumePageProps) {
  const router = useRouter()
  const [costume, setCostume] = useState<Costume | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    age_category: "children" as "children" | "adults",
    image: "",
    available: true,
  })

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    const [costumeData, categoriesData] = await Promise.all([
      costumeService.getById(Number(params.id)),
      categoryService.getAll(),
    ])

    if (costumeData) {
      setCostume(costumeData)
      setFormData({
        name: costumeData.name,
        description: costumeData.description,
        category_id: costumeData.category_id.toString(),
        price: costumeData.price.toString(),
        age_category: costumeData.age_category,
        image: costumeData.image || "",
        available: costumeData.available,
      })
    }
    setCategories(categoriesData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!costume) return

    setLoading(true)

    try {
      const updateData = {
        ...formData,
        category_id: Number(formData.category_id),
        price: Number(formData.price),
      }

      const success = await costumeService.update(costume.id, updateData)
      if (success) {
        router.push("/admin/costumes")
      } else {
        alert("Ошибка при обновлении костюма")
      }
    } catch (error) {
      console.error("Failed to update costume:", error)
      alert("Ошибка при обновлении костюма")
    } finally {
      setLoading(false)
    }
  }

  if (!costume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Костюм не найден</p>
          <Button asChild className="mt-4">
            <Link href="/admin/costumes">Вернуться к костюмам</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1">
          <AdminHeader title="Редактировать костюм" description={`Изменение костюма "${costume.name}"`} />

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
                      <Label htmlFor="category">Категория</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age_category">Возрастная категория</Label>
                      <Select
                        value={formData.age_category}
                        onValueChange={(value: "children" | "adults") =>
                          setFormData({ ...formData, age_category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">URL изображения</Label>
                      <Input
                        id="image"
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600">
                        {loading ? "Сохранение..." : "Сохранить изменения"}
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

export default function EditCostumePage({ params }: EditCostumePageProps) {
  return (
    <AuthGuard>
      <EditCostumePageContent params={params} />
    </AuthGuard>
  )
}
