import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AnimalCostumesPage() {
  const animalCategories: any[] = []

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
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                asChild
              >
                <Link href="/">← Вернуться на главную</Link>
              </Button>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-4">Костюмы животных</h1>
              <p className="text-xl text-slate-600">Забавные костюмы животных для детских праздников и игр</p>
            </div>

            {/* Info Section */}
            <div className="mt-16">
              <Card className="bg-white border-amber-200">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-semibold text-slate-700 mb-4">Костюмы животных скоро!</h2>
                  <p className="text-slate-600 mb-6">
                    Мы готовим забавную коллекцию костюмов животных для веселых праздников. Следите за обновлениями или
                    свяжитесь с нами для уточнения наличия.
                  </p>
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-amber-900" asChild>
                    <Link href="/contacts">Связаться с нами</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
