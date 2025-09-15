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
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { costumeService, type Costume } from "@/lib/costumes-data"
import { categoryService } from "@/lib/categories-data"
import { Plus, X } from "lucide-react"

interface EditCostumePageProps {
  params: {
    id: string
  }
}

interface AdditionalCharacteristic {
  id: string
  name: string
  value: string
}

function EditCostumePageContent({ params }: EditCostumePageProps) {
  const router = useRouter()
  const [costume, setCostume] = useState<Costume | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [additionalCharacteristics, setAdditionalCharacteristics] = useState<AdditionalCharacteristic[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    image: "",
    size: "",
    price: "",
    deposit: "",
    chestCircumference: "",
    sarafanLength: "",
    material: "",
  })

  useEffect(() => {
    setCategories(categoryService.getAll())

    const costumeId = Number.parseInt(params.id)
    const foundCostume = costumeService.getById(costumeId)

    if (foundCostume) {
      setCostume(foundCostume)
      setFormData({
        title: foundCostume.title,
        description: foundCostume.description,
        category: foundCostume.category,
        subcategory: foundCostume.subcategory || "",
        image: foundCostume.image,
        size: foundCostume.size,
        price: foundCostume.price.toString(),
        deposit: foundCostume.deposit.toString(),
        chestCircumference: foundCostume.characteristics?.chestCircumference || "",
        sarafanLength: foundCostume.characteristics?.sarafanLength || "",
        material: foundCostume.characteristics?.material || "",
      })
      setImagePreview(foundCostume.image)

      const existingCharacteristics: AdditionalCharacteristic[] = []
      if (foundCostume.characteristics?.chestCircumference) {
        existingCharacteristics.push({
          id: "chest",
          name: "Полуобхват в груди",
          value: foundCostume.characteristics.chestCircumference,
        })
      }
      if (foundCostume.characteristics?.sarafanLength) {
        existingCharacteristics.push({
          id: "length",
          name: "Длина сарафана",
          value: foundCostume.characteristics.sarafanLength,
        })
      }
      if (foundCostume.characteristics?.material) {
        existingCharacteristics.push({
          id: "material",
          name: "Материал",
          value: foundCostume.characteristics.material,
        })
      }
      setAdditionalCharacteristics(existingCharacteristics)
    }
  }, [params.id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setFormData({ ...formData, image: "" })
    // Очищаем input file
    const fileInput = document.getElementById("image") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const addCharacteristic = () => {
    const newCharacteristic: AdditionalCharacteristic = {
      id: Date.now().toString(),
      name: "",
      value: "",
    }
    setAdditionalCharacteristics([...additionalCharacteristics, newCharacteristic])
  }

  const removeCharacteristic = (id: string) => {
    setAdditionalCharacteristics(additionalCharacteristics.filter((char) => char.id !== id))
  }

  const updateCharacteristic = (id: string, field: "name" | "value", value: string) => {
    setAdditionalCharacteristics(
      additionalCharacteristics.map((char) => (char.id === id ? { ...char, [field]: value } : char)),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!costume) return

    let imageUrl = formData.image
    if (imageFile) {
      // For demo purposes, we'll use the preview URL
      // In production, you'd upload to a server or cloud storage
      imageUrl = imagePreview
    }

    const characteristics: any = {}
    additionalCharacteristics.forEach((char) => {
      if (char.name && char.value) {
        // Convert display names to property names
        if (char.name === "Полуобхват в груди") {
          characteristics.chestCircumference = char.value
        } else if (char.name === "Длина сарафана") {
          characteristics.sarafanLength = char.value
        } else if (char.name === "Материал") {
          characteristics.material = char.value
        } else {
          // For custom characteristics, use a sanitized key
          const key = char.name.toLowerCase().replace(/\s+/g, "_")
          characteristics[key] = char.value
        }
      }
    })

    const updates = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      image: imageUrl,
      size: formData.size,
      price: Number.parseInt(formData.price),
      deposit: Number.parseInt(formData.deposit),
      available: true,
      characteristics,
    }

    costumeService.update(costume.id, updates)
    router.push("/admin/costumes")
  }

  const getSubcategories = () => {
    if (!formData.category) return []
    const category = categories.find((cat) => cat.id === formData.category)
    return category?.subcategories || []
  }

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value, subcategory: "" })
  }

  if (!costume) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Костюм не найден</p>
          <Button asChild className="mt-4">
            <Link href="/admin/costumes">Вернуться к костюмам</Link>
          </Button>
        </div>
      </div>
    )
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
              <p className="text-sm text-muted-foreground">Редактировать костюм</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/admin/costumes">Назад к костюмам</Link>
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
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground">Редактировать костюм</h2>
              <p className="text-muted-foreground">Изменить информацию о костюме "{costume.title}"</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Название костюма</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Например: Русский народный костюм для девочки"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Описание (что входит в комплект)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Например: сарафан, блуза, кокошник"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
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
                  </div>

                  <div>
                    <Label htmlFor="subcategory">Подкатегория</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                      disabled={!formData.category}
                    >
                      <SelectTrigger>
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

                  <div>
                    <Label htmlFor="image">Изображение костюма</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Предварительный просмотр"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Характеристики и цены</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="size">Размер (рост)</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="Например: 104-122"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Цена за сутки (₽)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="deposit">Залог (₽)</Label>
                      <Input
                        id="deposit"
                        type="number"
                        value={formData.deposit}
                        onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                        placeholder="1000"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Дополнительные характеристики</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {additionalCharacteristics.map((characteristic) => (
                    <div key={characteristic.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label>Название характеристики</Label>
                        <Input
                          value={characteristic.name}
                          onChange={(e) => updateCharacteristic(characteristic.id, "name", e.target.value)}
                          placeholder="Например: Полуобхват в груди"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Значение</Label>
                        <Input
                          value={characteristic.value}
                          onChange={(e) => updateCharacteristic(characteristic.id, "value", e.target.value)}
                          placeholder="Например: 33 см"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeCharacteristic(characteristic.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addCharacteristic} className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить характеристику
                  </Button>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Сохранить изменения
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/costumes">Отмена</Link>
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function EditCostumePage({ params }: EditCostumePageProps) {
  return (
    <AdminAuthGuard>
      <EditCostumePageContent params={params} />
    </AdminAuthGuard>
  )
}
