"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { categoryService, type Category } from "@/lib/categories-data"
import { useRouter } from "next/navigation"

function CategoriesPageContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())
  const [ageCategory, setAgeCategory] = useState<"children" | "adults">("children")
  const router = useRouter()

  useEffect(() => {
    setCategories(categoryService.getAll())
    const savedAgeCategory = localStorage.getItem("adminAgeCategory") as "children" | "adults"
    if (savedAgeCategory) {
      setAgeCategory(savedAgeCategory)
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const savedAgeCategory = localStorage.getItem("adminAgeCategory") as "children" | "adults"
      if (savedAgeCategory) {
        setAgeCategory(savedAgeCategory)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
      categoryService.delete(id)
      setCategories(categoryService.getAll())
    }
  }

  const toggleCategory = (categoryId: string) => {
    const newOpen = new Set(openCategories)
    if (newOpen.has(categoryId)) {
      newOpen.delete(categoryId)
    } else {
      newOpen.add(categoryId)
    }
    setOpenCategories(newOpen)
  }

  const filteredCategories = categories.filter((category) => category.ageCategory === ageCategory)

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
              <p className="text-sm text-muted-foreground">Управление категориями</p>
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
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/10 text-sidebar-foreground"
            >
              <span>👗</span>
              <span>Костюмы</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
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
                <h2 className="text-3xl font-bold text-foreground">Категории и подкатегории</h2>
                <p className="text-muted-foreground">
                  Управление категориями и подкатегориями костюмов (
                  {ageCategory === "children" ? "Для детей" : "Для взрослых"})
                </p>
              </div>
              <Button asChild>
                <Link href="/admin/categories/new">Добавить категорию</Link>
              </Button>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 relative bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {category.subcategories && category.subcategories.length > 0 && (
                        <Collapsible
                          open={openCategories.has(category.id)}
                          onOpenChange={() => toggleCategory(category.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {openCategories.has(category.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              Подкатегории ({category.subcategories.length})
                            </Button>
                          </CollapsibleTrigger>
                        </Collapsible>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/categories/${category.id}/edit`}>Изменить</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {category.subcategories && category.subcategories.length > 0 && (
                  <Collapsible open={openCategories.has(category.id)}>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 ml-4 border-l-2 border-muted pl-4">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory.id} className="p-3 border rounded-lg bg-muted/30">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-sm">{subcategory.title}</h4>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{subcategory.description}</p>
                              <Badge variant="outline" className="text-xs">
                                {subcategory.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Категории для {ageCategory === "children" ? "детей" : "взрослых"} не найдены
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <AdminAuthGuard>
      <CategoriesPageContent />
    </AdminAuthGuard>
  )
}
