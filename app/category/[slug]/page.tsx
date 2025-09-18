"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { categoryService, type Category } from "@/lib/services/category-service"
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

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        const categoryId = params.slug
        const categoryData = await categoryService.getById(categoryId as any)

        if (categoryData) {
          setCategory(categoryData)

          const subcategoriesResponse = await fetch(`/api/subcategories?categoryId=${categoryId}`)
          if (subcategoriesResponse.ok) {
            const subcategoriesData = await subcategoriesResponse.json()
            setSubcategories(subcategoriesData)
          }
        }
      } catch (error) {
        console.error("Failed to load category data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Загрузка категории...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23fbbf24' fillOpacity='0.3'%3E%3Cpath d='M20 20c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10 10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10 10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10 10zm20 40c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10 10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10 10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10 10z'/%3E%3C/g%3E%3Cg fill='%23ec4899' fillOpacity='0.2'%3E%3Cpolygon points='35,15 45,35 25,35'/%3E%3Cpolygon points='75,15 85,35 65,35'/%3E%3Cpolygon points='35,55 45,75 25,75'/%3E%3Cpolygon points='75,55 85,75 65,75'/%3E%3Cpolygon points='35,95 45,115 25,115'/%3E%3Cpolygon points='75,95 85,115 65,115'/%3E%3C/g%3E%3Cg fill='%2306b6d4' fillOpacity='0.2'%3E%3Crect x='15' y='45' width='10' height='10' rx='2'/%3E%3Crect x='55' y='45' width='10' height='10' rx='2'/%3E%3Crect x='95' y='45' width='10' height='10' rx='2'/%3E%3Crect x='15' y='85' width='10' height='10' rx='2'/%3E%3Crect x='55' y='85' width='10' height='10' rx='2'/%3E%3Crect x='95' y='85' width='10' height='10' rx='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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

      {/* Category Hero with Back Button */}
      <section className="py-12 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Button
                variant="outline"
                className="border-teal-500 text-teal-600 hover:bg-teal-50 bg-white shadow-sm absolute left-4"
                asChild
              >
                <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Вернуться</span>
                </Link>
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-700">{category.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {subcategories.length > 0 && (
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subcategories.map((subcategory) => (
                <Link key={subcategory.id} href={`/subcategory/${subcategory.id}`} className="group">
                  <div className="relative h-32 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <Image
                      src={
                        subcategory.image ||
                        "/placeholder.svg?height=200&width=300&query=traditional costume category" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={subcategory.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Semi-transparent overlay for text visibility */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <h3 className="text-white font-semibold text-lg text-center px-4">{subcategory.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {subcategories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎭</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">В этой категории пока нет подкатегорий</h3>
            <p className="text-gray-600 mb-6">Скоро здесь появятся новые подкатегории!</p>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-amber-900" asChild>
              <Link href="/">Вернуться к каталогу</Link>
            </Button>
          </div>
        )}
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
