import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Utensils,
  TrendingUp,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { LanguageCode } from "../../types";

interface DashboardProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const Dashboard = ({ onLanguageChange, currentLang }: DashboardProps) => {
  const { t } = useI18n();

  const foodOffers = [
    {
      id: 1,
      title: t('food.shawarma'),
      description: t('food.shawarma_desc'),
      icon: Utensils,
      color: "text-orange-500",
    },
    {
      id: 2,
      title: t('food.burger'),
      description: t('food.burger_desc'),
      icon: Utensils,
      color: "text-red-500",
    },
    {
      id: 3,
      title: t('food.pizza'),
      description: t('food.pizza_desc'),
      icon: Utensils,
      color: "text-yellow-500",
    },
    {
      id: 4,
      title: t('food.salad'),
      description: t('food.salad_desc'),
      icon: Utensils,
      color: "text-green-500",
    },
  ];

  const newsItems = [
    {
      id: 1,
      title: t('news.maintenance_tips'),
      description: t('news.maintenance_desc'),
    },
    {
      id: 2,
      title: t('news.fuel_prices'),
      description: t('news.fuel_desc'),
    },
  ];

  const todayEvents = [
    { id: 1, title: t('events.morning_service'), time: '09:00 AM', type: 'service' },
    { id: 2, title: t('events.oil_change'), time: '11:30 AM', type: 'maintenance' },
    { id: 3, title: t('events.tire_check'), time: '02:00 PM', type: 'inspection' },
    { id: 4, title: t('events.car_wash'), time: '04:30 PM', type: 'other' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
            <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Food Offers Carousel */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              {t('home.daily_offers')}
            </h2>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {foodOffers.map((offer) => (
                <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-2 hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <offer.icon className={`h-12 w-12 ${offer.color}`} />
                        <h3 className="font-semibold text-lg">{offer.title}</h3>
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                        <Badge variant="secondary" className="mt-2">
                          {t('dashboard.view_all')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Trending News Banner */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('home.trending_news')}
            </h2>
          </div>
          
          <div className="space-y-3">
            {newsItems.map((news) => (
              <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardTitle className="text-base">{news.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>{news.description}</span>
                    <ChevronRight className="h-4 w-4" />
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Today's Schedule */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('home.today_events')}
            </h2>
          </div>
          
          <Card>
            <CardContent className="p-4">
              {todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {t('home.no_events')}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
