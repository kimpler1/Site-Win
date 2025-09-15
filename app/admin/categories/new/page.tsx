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
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { categoryService } from "@/lib/categories-data"

function NewCategoryPageContent() {
  const router = useRouter()
  const [ageCategory, setAgeCategory] = useState<"children" | "adults">("children")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  })

  useEffect(() => {
    const savedAgeCategory = localStorage.getItem("adminAgeCategory") as "children" | "adults"
    if (savedAgeCategory) {
      setAgeCategory(savedAgeCategory)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newCategory = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      image: formData.image ? URL.createObjectURL(formData.image) : "",
      ageCategory, // добавляем возрастную категорию
      count: "0 костюмов",
      active: true,
      subcategories: [],
    }

    categoryService.create(newCategory)
    router.push("/admin/categories")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
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
              <p className="text-sm text-muted-foreground">Создание категории</p>
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
          <div className="max-w-2xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Создать категорию</h2>
                  <p className="text-muted-foreground">
                    Добавьте новую категорию костюмов ({ageCategory === "children" ? "Для детей" : "Для взрослых"})
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/admin/categories">← Назад к категориям</Link>
                </Button>
              </div>
            </div>

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
                    <Label htmlFor="image">Изображение категории</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {formData.image && (
                      <p className="text-sm text-muted-foreground">Выбран файл: {formData.image.name}</p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit">Создать категорию</Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/admin/categories">Отмена</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function NewCategoryPage() {
  return (
    <AdminAuthGuard>
      <NewCategoryPageContent />
    </AdminAuthGuard>
  )
}
