"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

interface Subcategory {
  id: string
  categoryId: string
  title: string
  description: string
  image: string
  count: string
  active: boolean
  available: boolean
}

interface Costume {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: string
  subcategory: string
  size: string
  ageCategory: "children" | "adults"
  deposit: number
  available: boolean
}

export default function SubcategoryPage({ params }: { params: { id: string } }) {
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null)
  const [costumes, setCostumes] = useState<Costume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Загружаем подкатегорию
        const subcategoryResponse = await fetch(`/api/subcategories/${params.id}`)
        if (!subcategoryResponse.ok) {
          setLoading(false)
          return
        }
        const subcategoryData = await subcategoryResponse.json()
        setSubcategory(subcategoryData)

        // Загружаем костюмы для этой подкатегории
        const costumesResponse = await fetch(`/api/costumes?subcategoryId=${params.id}`)
        if (costumesResponse.ok) {
          const costumesData = await costumesResponse.json()
          setCostumes(costumesData)
        }
      } catch (error) {
        console.error("Failed to load subcategory data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Загрузка подкатегории...</p>
        </div>
      </div>
    )
  }

  if (!subcategory) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23fbbf24' fillOpacity='0.3'%3E%3Cpath d='M20 20c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zM20 60c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zM20 100c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3Cg fill='%23ec4899' fillOpacity='0.2'%3E%3Cpolygon points='35,15 45,35 25,35'/%3E%3Cpolygon points='75,15 85,35 65,35'/%3E%3Cpolygon points='35,55 45,75 25,75'/%3E%3Cpolygon points='75,55 85,75 65,75'/%3E%3Cpolygon points='35,95 45,115 25,115'/%3E%3Cpolygon points='75,95 85,115 65,115'/%3E%3C/g%3E%3Cg fill='%2306b6d4' fillOpacity='0.2'%3E%3Crect x='15' y='45' width='10' height='10' rx='2'/%3E%3Crect x='55' y='45' width='10' height='10' rx='2'/%3E%3Crect x='95' y='45' width='10' height='10' rx='2'/%3E%3Crect x='15' y='85' width='10' height='10' rx='2'/%3E%3Crect x='55' y='85' width='10' height='10' rx='2'/%3E%3Crect x='95' y='85' width='10' height='10' rx='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-amber-200 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-amber-800 font-bold text-lg">🎭</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-800">Arlekino</h1>
                <p className="text-sm text-amber-700">Аренда костюмов</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                asChild
              >
                <Link href="/">Главная</Link>
              </Button>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                asChild
              >
                <Link href="/contacts">Контакты</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Subcategory Hero with Back Button */}
      <section className="py-12 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-8 relative">
              <Button
                variant="outline"
                className="border-teal-500 text-teal-600 hover:bg-teal-50 bg-white shadow-sm absolute left-4"
                asChild
              >
                <Link href={`/category/${subcategory.categoryId}`} className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Вернуться</span>
                </Link>
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-700">{subcategory.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <section>
          {costumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {costumes.map((costume) => (
                <Link key={costume.id} href={`/costume/${costume.id}`} className="group">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105 bg-white border-amber-200 h-full">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={costume.image || "/placeholder.svg?height=200&width=300&query=traditional costume"}
                        alt={costume.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={costume.available ? "bg-green-500" : "bg-red-500"}>
                          {costume.available ? "Доступен" : "Занят"}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">{costume.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{costume.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-amber-800">{costume.price} ₽/сутки</span>
                        <Badge variant="outline" className="text-xs">
                          {costume.ageCategory === "children" ? "Детский" : "Взрослый"}
                        </Badge>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">Размер: {costume.size}</div>

                      <Button
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-amber-900"
                        disabled={!costume.available}
                      >
                        {costume.available ? "Подробнее" : "Недоступен"}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎭</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">В этой подкатегории пока нет костюмов</h3>
              <p className="text-gray-600 mb-6">Скоро здесь появятся новые костюмы!</p>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-amber-900" asChild>
                <Link href={`/category/${subcategory.categoryId}`}>Вернуться к категории</Link>
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200 mt-16 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-amber-800 font-bold">🎭</span>
              </div>
              <h3 className="text-lg font-bold text-amber-800">Arlekino</h3>
            </div>
            <p className="text-amber-600 text-sm">© 2024 Костюмерная "Арлекино". Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
