"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { costumeService, type Costume } from "@/lib/costumes-data"
import { categoryService } from "@/lib/categories-data"
import { useRouter } from "next/navigation"

function CostumesPageContent() {
  const [costumes, setCostumes] = useState<Costume[]>([])
  const [categoryFilter, setCategoryFilter] = useState("")
  const [subcategoryFilter, setSubcategoryFilter] = useState("")
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<"children" | "adults">(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminAgeMode") === "adult" ? "adults" : "children"
    }
    return "children"
  })
  const router = useRouter()

  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    setCostumes(costumeService.getByAgeCategory(selectedAgeCategory))
    setCategories(categoryService.getAll())
    console.log("[v0] Loaded costumes for age category:", selectedAgeCategory)
  }, [selectedAgeCategory])

  useEffect(() => {
    const handleStorageChange = () => {
      const newAgeMode = localStorage.getItem("adminAgeMode") === "adult" ? "adults" : "children"
      if (newAgeMode !== selectedAgeCategory) {
        setSelectedAgeCategory(newAgeMode)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Проверяем изменения каждые 500мс для синхронизации между вкладками
    const interval = setInterval(() => {
      const currentMode = localStorage.getItem("adminAgeMode") === "adult" ? "adults" : "children"
      if (currentMode !== selectedAgeCategory) {
        setSelectedAgeCategory(currentMode)
      }
    }, 500)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [selectedAgeCategory])

  const handleDelete = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот костюм?")) {
      costumeService.delete(id)
      setCostumes(costumeService.getByAgeCategory(selectedAgeCategory))
    }
  }

  const filteredCostumes = costumes.filter((costume) => {
    if (!categoryFilter || !subcategoryFilter) {
      return false // Не показываем костюмы, пока не выбраны категория и подкатегория
    }

    return costume.category === categoryFilter && costume.subcategory === subcategoryFilter
  })

  const getSubcategories = () => {
    if (!categoryFilter) return []
    const category = categories.find((cat) => cat.id === categoryFilter)
    return category?.subcategories || []
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    setSubcategoryFilter("") // Сбрасываем подкатегорию при смене категории
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Arlekino Admin</h1>
              <p className="text-sm text-muted-foreground">Управление костюмами</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/">Вернуться на сайт</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("adminToken")
                router.push("/admin/login")
              }}
            >
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
          <nav className="p-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/10 text-sidebar-foreground"
            >
              <span>📊</span>
              <span>Дашборд</span>
            </Link>
            <Link
              href="/admin/costumes"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <span>👗</span>
              <span>Костюмы</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/10 text-sidebar-foreground"
            >
              <span>📂</span>
              <span>Категории</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/10 text-sidebar-foreground"
            >
              <span>⚙️</span>
              <span>Настройки</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Костюмы</h2>
                <p className="text-muted-foreground">
                  Управление каталогом костюмов - {selectedAgeCategory === "children" ? "Для детей" : "Для взрослых"}
                </p>
              </div>
              <Button asChild>
                <Link href="/admin/costumes/new">Добавить костюм</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter} disabled={!categoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Выберите подкатегорию" />
                </SelectTrigger>
                <SelectContent>
                  {getSubcategories().map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!categoryFilter || !subcategoryFilter ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Выберите категорию и подкатегорию для просмотра костюмов</p>
            </div>
          ) : (
            <>
              {/* Costumes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCostumes.map((costume) => (
                  <Card key={costume.id} className="overflow-hidden">
                    <div className="aspect-square relative bg-muted">
                      <Image
                        src={costume.image || "/placeholder.svg"}
                        alt={costume.title}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{costume.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{costume.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Размер:</span>
                        <Badge variant="outline">{costume.size}</Badge>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-foreground">{costume.price} ₽/сутки</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                          <Link href={`/admin/costumes/${costume.id}/edit`}>Изменить</Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(costume.id)}>
                          Удалить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCostumes.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Костюмы не найдены в выбранной категории</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default function CostumesPage() {
  return (
    <AdminAuthGuard>
      <CostumesPageContent />
    </AdminAuthGuard>
  )
}
