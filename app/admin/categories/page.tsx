"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { categoryService, type Category } from "@/lib/services/category-service"
import { Trash2, Edit, Plus } from "lucide-react"

function CategoriesPageContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Failed to load categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
      const success = await categoryService.delete(id)
      if (success) {
        await loadCategories()
      } else {
        alert("Ошибка при удалении категории")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Загрузка категорий...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1">
          <AdminHeader title="Категории" description="Управление категориями костюмов" />

          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Все категории</h2>
                <p className="text-gray-600">Найдено категорий: {categories.length}</p>
              </div>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/admin/categories/new" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Добавить категорию</span>
                </Link>
              </Button>
            </div>

            {categories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📂</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Категории не найдены</h3>
                  <p className="text-gray-600 mb-4">Создайте первую категорию для начала работы</p>
                  <Button asChild>
                    <Link href="/admin/categories/new">Создать категорию</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-orange-500 text-white">{category.count} костюмов</Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                    </CardHeader>

                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">ID: {category.id}</div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex items-center space-x-1 bg-transparent"
                          >
                            <Link href={`/admin/categories/${category.id}/edit`}>
                              <Edit className="w-4 h-4" />
                              <span>Изменить</span>
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Удалить</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <AuthGuard>
      <CategoriesPageContent />
    </AuthGuard>
  )
}
