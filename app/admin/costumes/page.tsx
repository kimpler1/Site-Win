"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/admin/auth-guard"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { costumeService, type Costume } from "@/lib/services/costume-service"
import { categoryService, type Category } from "@/lib/services/category-service"
import { subcategoryService, type Subcategory } from "@/lib/services/subcategory-service"
import { Trash2, Edit, Plus } from "lucide-react"

function CostumesPageContent() {
  const [costumes, setCostumes] = useState<Costume[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [subcategoryFilter, setSubcategoryFilter] = useState("all")
  const [ageFilter, setAgeFilter] = useState<"children" | "adults" | "all">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (categoryFilter !== "all") {
      loadSubcategories(categoryFilter)
    } else {
      setSubcategories([])
      setSubcategoryFilter("all")
    }
  }, [categoryFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [costumesData, categoriesData] = await Promise.all([costumeService.getAll(), categoryService.getAll()])
      setCostumes(costumesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadSubcategories = async (categoryId: string) => {
    try {
      const subcategoriesData = await subcategoryService.getByCategoryId(Number(categoryId))
      setSubcategories(subcategoriesData)
    } catch (error) {
      console.error("Failed to load subcategories:", error)
      setSubcategories([])
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот костюм?")) {
      const success = await costumeService.delete(id)
      if (success) {
        await loadData()
      } else {
        alert("Ошибка при удалении костюма")
      }
    }
  }

  const filteredCostumes = costumes.filter((costume) => {
    console.log("[v0] Filtering costume:", {
      id: costume.id,
      name: costume.name,
      age_category: costume.age_category,
      category_id: costume.category_id,
      subcategory_id: costume.subcategory_id,
      filters: { categoryFilter, ageFilter, subcategoryFilter },
    })

    const categoryMatch = categoryFilter === "all" || costume.category_id === Number(categoryFilter)
    const ageMatch = ageFilter === "all" || costume.age_category === ageFilter
    const subcategoryMatch =
      subcategoryFilter === "all" || (costume.subcategory_id && costume.subcategory_id === Number(subcategoryFilter))

    console.log("[v0] Filter results:", { categoryMatch, ageMatch, subcategoryMatch })

    return categoryMatch && ageMatch && subcategoryMatch
  })

  const costumesToShow = filteredCostumes

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Загрузка костюмов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1">
          <AdminHeader title="Костюмы" description="Управление каталогом костюмов" />

          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Все костюмы</h2>
                <p className="text-gray-600">Найдено костюмов: {costumesToShow.length}</p>
              </div>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/admin/costumes/new" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Добавить костюм</span>
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <Select value={ageFilter} onValueChange={(value: "children" | "adults" | "all") => setAgeFilter(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Возраст" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все возрасты</SelectItem>
                  <SelectItem value="children">Для детей</SelectItem>
                  <SelectItem value="adults">Для взрослых</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={subcategoryFilter}
                onValueChange={setSubcategoryFilter}
                disabled={categoryFilter === "all" || subcategories.length === 0}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Подкатегория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все подкатегории</SelectItem>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {costumesToShow.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">👗</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Костюмов не найдено</h3>
                  <p className="text-gray-600 mb-4">В выбранной категории пока нет костюмов</p>
                  <Button asChild>
                    <Link href="/admin/costumes/new">Создать костюм</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {costumesToShow.map((costume) => (
                  <Card key={costume.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={costume.image || "/placeholder.svg"}
                        alt={costume.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={costume.available ? "bg-green-500" : "bg-red-500"}>
                          {costume.available ? "Доступен" : "Занят"}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{costume.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{costume.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">Возраст:</span>
                        <Badge variant="outline">{costume.age_category === "children" ? "Детский" : "Взрослый"}</Badge>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-gray-900">{costume.price} ₽/сутки</span>
                        <span className="text-sm text-gray-500">ID: {costume.id}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                          <Link
                            href={`/admin/costumes/${costume.id}/edit`}
                            className="flex items-center justify-center space-x-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Изменить</span>
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(costume.id)}
                          className="flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

export default function CostumesPage() {
  return (
    <AuthGuard>
      <CostumesPageContent />
    </AuthGuard>
  )
}
