"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
  characteristics: Record<string, string>
}

interface CostumePageProps {
  params: {
    id: string
  }
}

export default function CostumePage({ params }: CostumePageProps) {
  const [costume, setCostume] = useState<Costume | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCostume = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/costumes/${params.id}`)

        if (!response.ok) {
          setLoading(false)
          return
        }

        const costumeData = await response.json()
        setCostume(costumeData)
      } catch (error) {
        console.error("Failed to load costume:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCostume()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Загрузка костюма...</p>
        </div>
      </div>
    )
  }

  if (!costume) {
    return (
      <div className="min-h-screen bg-white relative">
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
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-amber-800 font-bold text-lg">🎭</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-amber-800">Arlekino</h1>
                  <p className="text-sm text-amber-700">Аренда костюмов</p>
                </div>
              </Link>
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                  asChild
                >
                  <Link href="/">Главная</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                  asChild
                >
                  <Link href="/contacts">Контакты</Link>
                </Button>
              </nav>
            </div>
          </div>
        </header>

        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎭</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-700 mb-4">Костюм не найден</h1>
              <p className="text-slate-600 mb-6">Костюм с ID {params.id} не найден в нашем каталоге.</p>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-amber-900" asChild>
                <Link href="/">Вернуться на главную</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
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
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-amber-800 font-bold text-lg">🎭</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-800">Arlekino</h1>
                <p className="text-sm text-amber-700">Аренда костюмов</p>
              </div>
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                asChild
              >
                <Link
                  href={costume.subcategory ? `/subcategory/${costume.subcategory}` : `/category/${costume.category}`}
                >
                  ← Вернуться
                </Link>
              </Button>
              <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-amber-900" asChild>
                <Link href="/">Главная</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Изображение костюма */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-yellow-400 rounded-lg overflow-hidden">
              <Image
                src={costume.image || "/placeholder.svg?height=600&width=600&query=traditional costume"}
                alt={costume.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className={costume.available ? "bg-green-500" : "bg-red-500"}>
                  {costume.available ? "Доступен" : "Занят"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Информация о костюме */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-amber-800 mb-2">{costume.title}</h1>
              <p className="text-lg text-gray-600">{costume.description}</p>
            </div>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800">Общие характеристики</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Рост:</span>
                  <Badge variant="secondary">{costume.size}</Badge>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Возрастная категория:</span>
                  <span>{costume.ageCategory === "children" ? "Детский" : "Взрослый"}</span>
                </div>

                {/* Дополнительные характеристики */}
                {costume.characteristics &&
                  Object.entries(costume.characteristics).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-2xl">
                    <span className="font-bold text-amber-800">{costume.price} ₽ / сутки</span>
                  </div>

                  {costume.deposit > 0 && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Залог:</span>
                        <span className="font-semibold">{costume.deposit} ₽</span>
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <Button
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-amber-900 text-lg py-6"
                      disabled={!costume.available}
                    >
                      {costume.available ? "Забронировать" : "Недоступен"}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    <p>📞 Для бронирования звоните: +7 905 305 45 05</p>
                    <p>💬 WhatsApp • Viber</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Условия аренды</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Минимальный срок аренды: 1 сутки</p>
                <p>• Возможна доставка по Самаре</p>
                <p>• Костюм проходит профессиональную чистку</p>
                <p>• При повреждении костюма удерживается залог</p>
              </CardContent>
            </Card>
          </div>
        </div>
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
