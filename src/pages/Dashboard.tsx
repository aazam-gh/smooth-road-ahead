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
import Header from "@/components/Header";
import { useI18n } from "@/lib/i18n";
import { LanguageCode } from "../../types";
import DailyCheckin from "@/components/DailyCheckin";
import DailyActionCard from "@/components/DailyActionCard";
import { mockDiscoverData, type DiscoverApiItem } from "@/lib/discoverData";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
      <Header 
        title={t('dashboard.title')} 
        onLanguageChange={onLanguageChange}
        currentLang={currentLang}
        showProfileButton={true}
      />

      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* For you / personalized recommendations */}
        <ForYou />

        {/* Daily check-in and action */}
        <DailyActionCard />
        <DailyCheckin />
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

// ---------- ForYou (personalized recommendations) ----------
function ForYou() {
  const { t } = useI18n();
  const navigate = useNavigate();
  // localStorage keys used by DiscoverFeed
  const LIKED_KEY = "discoverLiked";
  const SAVED_KEY = "discoverSaved";

  const [recommendations, setRecommendations] = useState<DiscoverApiItem[]>([]);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState<string | null>(null);
  const [dialogTitle, setDialogTitle] = useState<string | null>(null);
  const [inlineOpenId, setInlineOpenId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [relatedMap, setRelatedMap] = useState<Record<string, DiscoverApiItem[]>>({});

  useEffect(() => {
    try {
      const likedArr: string[] = JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
      const savedArr: string[] = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      const likedSet = new Set(Array.isArray(likedArr) ? likedArr : []);
      const savedSet = new Set(Array.isArray(savedArr) ? savedArr : []);

      const likedItems = mockDiscoverData.filter((d) => likedSet.has(d.id));
      const likedCategories = new Set(likedItems.map((i) => (i.category || "").toLowerCase()));

      // score items: saved=3, liked=2, category match=1
      const now = Date.now();
      const scored = mockDiscoverData.map((item) => {
        let score = 0;
        if (savedSet.has(item.id)) score += 4;
        if (likedSet.has(item.id)) score += 3;
        if (likedCategories.has((item.category || "").toLowerCase())) score += 1;
        // recency boost: published within 7 days -> +2, within 30 days -> +1
        if (item.publishedAt) {
          const published = new Date(item.publishedAt).getTime();
          const days = (now - published) / (1000 * 60 * 60 * 24);
          if (days <= 7) score += 2;
          else if (days <= 30) score += 1;
        }
        return { item, score };
      });

      scored.sort((a, b) => b.score - a.score);

      const picks = scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.item);
      // If none have score>0, fall back to top 3 latest
      const final = picks.length > 0 ? picks : mockDiscoverData.slice(0, 3);

      const reasonMap: Record<string, string> = {};
      const related: Record<string, DiscoverApiItem[]> = {};
      final.forEach((it) => {
        // find up to 2 related items by category (exclude itself)
        related[it.id] = mockDiscoverData.filter(d => d.id !== it.id && (d.category || '').toLowerCase() === (it.category || '').toLowerCase()).slice(0,2);
        if (savedSet.has(it.id)) {
          reasonMap[it.id] = t('discover.reason_saved') || 'Saved';
        } else if (likedSet.has(it.id)) {
          reasonMap[it.id] = t('discover.reason_liked') || 'Because you liked this';
        } else {
          // find a liked item that shares category
          const same = likedItems.find((li) => (li.category || '').toLowerCase() === (it.category || '').toLowerCase());
          if (same) reasonMap[it.id] = `${t('discover.reason_because') || 'Because you liked'} ${same.title}`;
          else reasonMap[it.id] = t('discover.reason_for_you') || 'Recommended for you';
        }
      });
      // persist today's recommendations to avoid recomputing during session
      try {
        const cacheKey = `forYouCache_${new Date().toISOString().slice(0,10)}`;
        localStorage.setItem(cacheKey, JSON.stringify({ ids: final.map(f => f.id), reasons: reasonMap }));
      } catch {}

      setRecommendations(final);
      setReasons(reasonMap);
      setRelatedMap(related);
    } catch (e) {
      setRecommendations(mockDiscoverData.slice(0, 3));
    }
  }, []);

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">{t('home.for_you') || 'For you'}</h2>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-3 rounded-lg bg-card shadow-card flex gap-3">
            {rec.image && (
              <img src={rec.image} alt={rec.title} className="w-16 h-12 object-cover rounded-md flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-sm text-muted-foreground">{rec.description}</div>
                  <div className="text-xs text-muted-foreground mt-2">{reasons[rec.id]}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="secondary" className="capitalize">{rec.category}</Badge>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/discover?category=${encodeURIComponent(rec.category)}`}
                    onClick={() => trackEvent('for_you_click', { id: rec.id, title: rec.title })}
                    className="text-sm text-primary underline"
                  >
                    {t('home.view') || 'View'}
                  </Link>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      // open inline on mobile, dialog on desktop
                      const title = t('discover.dialog_title') || 'Why this recommendation?';
                      const body = reasons[rec.id] || t('discover.reason_for_you');
                      trackEvent('for_you_why', { id: rec.id });
                      if (isMobile) {
                        setInlineOpenId(rec.id);
                      } else {
                        setDialogTitle(title);
                        setDialogText(body);
                        setDialogOpen(true);
                      }
                    }}
                  >
                    {t('discover.why') || 'Why?'}
                  </button>
                  <button
                    type="button"
                    className="text-sm text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      // toggle saved
                      try {
                        const raw = localStorage.getItem(SAVED_KEY) || '[]';
                        const arr: string[] = JSON.parse(raw);
                        const idx = arr.indexOf(rec.id);
                        if (idx === -1) arr.push(rec.id);
                        else arr.splice(idx, 1);
                        localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
                        trackEvent('for_you_save', { id: rec.id, saved: idx === -1 });
                        // notify other components (same-tab) that saved state changed
                        try { window.dispatchEvent(new CustomEvent('discover:saved', { detail: { id: rec.id, saved: idx === -1 } })); } catch {}
                        // update UI reason label quickly
                        setReasons(prev => ({ ...prev, [rec.id]: idx === -1 ? (t('discover.saved') || 'Saved') : (t('discover.save') || 'Save') }));
                      } catch {}
                    }}
                  >
                    {t('discover.save') || 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Inline expansion for mobile */}
      {inlineOpenId && relatedMap[inlineOpenId] && (
        <div className="mt-3 p-3 bg-card rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t('discover.related_items') || 'Related items'}</div>
              <div className="text-sm text-muted-foreground">{reasons[inlineOpenId]}</div>
            </div>
            <button className="text-sm" onClick={() => setInlineOpenId(null)}>{t('discover.dialog_close') || 'Close'}</button>
          </div>
          <div className="mt-2 space-y-2">
            {relatedMap[inlineOpenId].map(r => (
              <div key={r.id} className="flex items-center gap-2">
                {r.image && <img src={r.image} alt={r.title} className="w-12 h-8 object-cover rounded-md" />}
                <div className="flex-1">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                </div>
                <button className="text-sm text-primary" onClick={() => navigate(`/discover?category=${encodeURIComponent(r.category)}`)}>{t('home.view')}</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Explanation dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">{dialogText}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button className="btn" onClick={() => setDialogOpen(false)}>{t('discover.dialog_close') || 'Close'}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
