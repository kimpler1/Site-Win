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
import { Badge } from "@/components/ui/badge"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { categoryService, type Category } from "@/lib/categories-data"

function EditCategoryPageContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    currentImageUrl: "",
  })
  const [newSubcategory, setNewSubcategory] = useState({
    title: "",
    description: "",
    image: null as File | null,
  })
  const [showAddSubcategory, setShowAddSubcategory] = useState(false)

  useEffect(() => {
    const foundCategory = categoryService.getById(params.id)
    if (foundCategory) {
      setCategory(foundCategory)
      setFormData({
        title: foundCategory.title,
        description: foundCategory.description,
        image: null,
        currentImageUrl: foundCategory.image || "",
      })
    }
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (category) {
      const updateData = {
        title: formData.title,
        description: formData.description,
        image: formData.image ? URL.createObjectURL(formData.image) : formData.currentImageUrl,
      }

      categoryService.update(params.id, updateData)
      router.push("/admin/categories")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
  }

  const handleAddSubcategory = () => {
    if (category && newSubcategory.title) {
      const updatedSubcategories = [
        ...(category.subcategories || []),
        {
          id: Date.now().toString(),
          title: newSubcategory.title,
          description: newSubcategory.description,
          image: newSubcategory.image ? URL.createObjectURL(newSubcategory.image) : "",
          available: true,
          count: "Скоро",
        },
      ]

      categoryService.update(params.id, { subcategories: updatedSubcategories })

      const updatedCategory = categoryService.getById(params.id)
      setCategory(updatedCategory)
      setNewSubcategory({ title: "", description: "", image: null })
      setShowAddSubcategory(false)
    }
  }

  const handleDeleteSubcategory = (subcategoryId: string) => {
    if (category && confirm("Удалить подкатегорию?")) {
      const updatedSubcategories = category.subcategories?.filter((sub) => sub.id !== subcategoryId) || []
      categoryService.update(params.id, { subcategories: updatedSubcategories })

      const updatedCategory = categoryService.getById(params.id)
      setCategory(updatedCategory)
    }
  }

  if (!category) {
    return <div>Категория не найдена</div>
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
              <p className="text-sm text-muted-foreground">Редактирование категории</p>
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
          <div className="max-w-4xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Редактировать категорию</h2>
                  <p className="text-muted-foreground">Изменение информации о категории</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/admin/categories">← Назад к категориям</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Основная информация */}
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
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

                    {/* Заменил URL поле на загрузку файла */}
                    <div className="space-y-2">
                      <Label htmlFor="image">Изображение категории</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      {formData.image ? (
                        <p className="text-sm text-muted-foreground">Выбран новый файл: {formData.image.name}</p>
                      ) : formData.currentImageUrl ? (
                        <p className="text-sm text-muted-foreground">Текущее изображение загружено</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Изображение не выбрано</p>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit">Сохранить изменения</Button>
                      <Button type="button" variant="outline" asChild>
                        <Link href="/admin/categories">Отмена</Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Подкатегории */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Подкатегории</CardTitle>
                    <Button size="sm" onClick={() => setShowAddSubcategory(true)} disabled={showAddSubcategory}>
                      + Добавить
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Форма добавления подкатегории */}
                  {showAddSubcategory && (
                    <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                      <Input
                        placeholder="Название подкатегории"
                        value={newSubcategory.title}
                        onChange={(e) => setNewSubcategory({ ...newSubcategory, title: e.target.value })}
                      />
                      <Textarea
                        placeholder="Описание подкатегории"
                        value={newSubcategory.description}
                        onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                      />
                      <div className="space-y-2">
                        <Label htmlFor="subcategory-image">Изображение подкатегории</Label>
                        <Input
                          id="subcategory-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            setNewSubcategory({ ...newSubcategory, image: file || null })
                          }}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                        {newSubcategory.image && (
                          <p className="text-sm text-muted-foreground">Выбран файл: {newSubcategory.image.name}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleAddSubcategory}>
                          Добавить
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowAddSubcategory(false)
                            setNewSubcategory({ title: "", description: "", image: null })
                          }}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Список подкатегорий */}
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <div className="space-y-3">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="p-3 border rounded-lg bg-muted/30">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{subcategory.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant={subcategory.available ? "default" : "secondary"} className="text-xs">
                                {subcategory.available ? "Доступно" : "Скоро"}
                              </Badge>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteSubcategory(subcategory.id)}
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{subcategory.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {subcategory.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Подкатегории не добавлены</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return (
    <AdminAuthGuard>
      <EditCategoryPageContent params={params} />
    </AdminAuthGuard>
  )
}
