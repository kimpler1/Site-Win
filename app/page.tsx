"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categoryService } from "@/lib/categories-data"

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const loadedCategories = categoryService.getAll()
    setCategories(loadedCategories)
  }, [])

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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-amber-800 font-bold text-lg">🎭</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-800">Arlekino</h1>
                <p className="text-sm text-amber-700">Аренда костюмов</p>
              </div>
            </div>
            <nav className="flex items-center space-x-2">
              <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-amber-900" asChild>
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

      {/* Hero Section */}
      <section className="py-16 relative bg-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/children-and-adults-in-colorful-carnival-costumes-.jpg"
            alt="Children and adults in various costumes"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-yellow-400 text-amber-800 border-yellow-500">
              🎪 Лучшие костюмы в Самаре
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-amber-800 mb-6 text-balance">
              Костюмерная <span className="text-amber-900">Arlekino</span>
            </h1>
            <p className="text-xl text-amber-700 mb-8 text-pretty max-w-2xl mx-auto">
              Превратите любой праздник в незабываемое приключение с нашими качественными костюмами для взрослых и детей
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-16 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-4">Каталог костюмов</h2>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎭</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-700 mb-4">Каталог готовится</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Мы наполняем каталог костюмами. Скоро здесь появятся удивительные костюмы для ваших праздников!
              </p>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-amber-900" asChild>
                <Link href="/contacts">Связаться с нами</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group h-full"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105 bg-white border-amber-200 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-400 text-amber-800">{category.count}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-semibold text-slate-700 mb-2 transition-colors">{category.title}</h3>
                      <p className="text-slate-600 mb-4 flex-grow">{category.description}</p>
                      <Button
                        variant="outline"
                        className="w-full bg-yellow-400 text-amber-900 border-yellow-400 hover:bg-yellow-400 hover:text-amber-900 mt-auto"
                      >
                        Смотреть костюмы
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 bg-white border-amber-200">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-800">Качественные костюмы</h3>
                <p className="text-amber-600">Все костюмы проходят профессиональную чистку и проверку качества</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-white border-amber-200">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-800">Быстрая доставка</h3>
                <p className="text-amber-600">Доставляем костюмы по Самаре в день заказа</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-white border-amber-200">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-amber-800">Доступные цены</h3>
                <p className="text-amber-600">От 300₽ в сутки с возможностью аренды на несколько дней</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200 relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-amber-800 font-bold text-lg">🎭</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-800">Arlekino</h3>
                  <p className="text-sm text-amber-600">Аренда костюмов</p>
                </div>
              </div>
              <p className="text-amber-600 text-sm">Превращаем детские праздники в волшебные приключения с 2020 года</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-amber-800 mb-4">Быстрые ссылки</h4>
              <ul className="space-y-2 text-sm text-amber-600">
                <li>
                  <Link href="/" className="hover:text-yellow-600 transition-colors">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="hover:text-yellow-600 transition-colors">
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link href="/national" className="hover:text-yellow-600 transition-colors">
                    Национальные
                  </Link>
                </li>
                <li>
                  <Link href="/carnival" className="hover:text-yellow-600 transition-colors">
                    Карнавальные
                  </Link>
                </li>
              </ul>
            </div>

            {/* Catalog */}
            <div>
              <h4 className="font-semibold text-amber-800 mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-amber-600">
                <li>
                  <Link href="/new-year" className="hover:text-yellow-600 transition-colors">
                    Новогодние
                  </Link>
                </li>
                <li>
                  <Link href="/animals" className="hover:text-yellow-600 transition-colors">
                    Животные
                  </Link>
                </li>
                <li>
                  <Link href="/autumn" className="hover:text-yellow-600 transition-colors">
                    Осенние
                  </Link>
                </li>
                <li>
                  <Link href="/military" className="hover:text-yellow-600 transition-colors">
                    Военные
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="font-semibold text-amber-800 mb-4">Контакты</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span className="text-amber-800 font-medium">+7 905 305 45 05</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💬</span>
                  <span className="text-amber-600">WhatsApp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span className="text-amber-600">Viber</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-amber-200 mt-8 pt-8 text-center text-sm text-amber-600">
            <p>© 2024 Костюмерная "Арлекино". Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
