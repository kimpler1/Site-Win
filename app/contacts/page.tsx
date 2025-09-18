import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">🎭</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Arlekino</h1>
                <p className="text-sm text-muted-foreground">Аренда костюмов</p>
              </div>
            </Link>
            <nav className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/">Главная</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/contacts">Контакты</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Контакты</h1>
              <p className="text-xl text-muted-foreground">Свяжитесь с нами любым удобным способом</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Как с нами связаться</h2>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xl text-primary-foreground">📞</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Телефон</div>
                        <div className="text-foreground font-bold text-lg">+7 905 305 45 05</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-xl text-secondary-foreground">💬</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">WhatsApp</div>
                        <div className="text-foreground font-bold text-lg">+7 905 305 45 05</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xl text-accent-foreground">📧</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Viber</div>
                        <div className="text-foreground font-bold text-lg">+7 905 305 45 05</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xl text-foreground">📍</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Город</div>
                        <div className="text-muted-foreground font-medium">Самара</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1" asChild>
                        <Link href="tel:+79053034505">📞 Позвонить</Link>
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href="https://wa.me/79053034505">💬 WhatsApp</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">О нашей аренде</h2>

                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Мы предлагаем широкий выбор качественных детских костюмов для любых праздников и мероприятий в
                      Самаре.
                    </p>

                    <div>
                      <p className="font-semibold text-foreground mb-3">В нашем каталоге:</p>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span>Национальные костюмы народов мира</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-secondary rounded-full"></span>
                          <span>Военные и исторические костюмы</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-accent rounded-full"></span>
                          <span>Яркие карнавальные костюмы</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          <span>Новогодние и праздничные костюмы</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-secondary rounded-full"></span>
                          <span>Костюмы животных и птиц</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-accent rounded-full"></span>
                          <span>Костюмы для праздника осени</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border-2 border-primary rounded-lg p-4 mt-6 bg-background">
                      <p className="font-semibold text-foreground text-center">
                        🎭 Превращаем детские праздники в волшебные приключения!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
