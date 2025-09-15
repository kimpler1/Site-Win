"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categoryService, type Category } from "@/lib/categories-data"
import { costumeService } from "@/lib/costumes-data"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [costumes, setCostumes] = useState<any[]>([])

  useEffect(() => {
    // Найти категорию по slug (используем title как slug)
    const categories = categoryService.getAll()
    const foundCategory = categories.find((cat) => cat.title.toLowerCase().replace(/\s+/g, "-") === params.slug)

    if (foundCategory) {
      setCategory(foundCategory)
      // Получить костюмы для этой категории
      const allCostumes = costumeService.getAll()
      const categoryCostumes = allCostumes.filter((costume) => costume.category === foundCategory.title)
      setCostumes(categoryCostumes)
    }
  }, [params.slug])

  if (!category) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{category.title}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">← Назад к каталогу</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Подкатегории */}
        {category.subcategories && category.subcategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Подкатегории</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.subcategories.map((subcategory) => (
                <Card key={subcategory.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {subcategory.image && (
                      <div className="mb-4">
                        <img
                          src={subcategory.image || "/placeholder.svg"}
                          alt={subcategory.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg mb-2">{subcategory.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{subcategory.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{subcategory.count}</Badge>
                      <Badge variant={subcategory.available ? "default" : "secondary"}>
                        {subcategory.available ? "Доступно" : "Скоро"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Костюмы */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Костюмы {costumes.length > 0 && `(${costumes.length})`}
          </h2>
          {costumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {costumes.map((costume) => (
                <Card key={costume.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {costume.images && costume.images.length > 0 && (
                      <div className="mb-4">
                        <img
                          src={costume.images[0] || "/placeholder.svg"}
                          alt={costume.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg mb-2">{costume.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{costume.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{costume.price} ₽</Badge>
                      <Badge variant={costume.available ? "default" : "secondary"}>
                        {costume.available ? "Доступен" : "Занят"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">В этой категории пока нет костюмов</p>
              <p className="text-muted-foreground">Скоро здесь появятся новые костюмы!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
