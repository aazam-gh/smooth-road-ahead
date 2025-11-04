import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Lightbulb, Bot, Bell, Car, Heart, Bookmark, ExternalLink, MapPin, Settings } from "lucide-react";
import { LanguageCode } from "../../types";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { mockDiscoverData, type DiscoverApiItem } from "../lib/discoverData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type FeedType = "event" | "offer" | "tip" | "ai" | "reminder" | "car" | "other";

interface FeedItem {
  id: string;
  type: FeedType; // internal normalized category
  category: string; // original category label
  title: string;
  description: string;
  imageUrl?: string;
  actionLabel?: string;
  actionHref?: string;
  meta?: string;
}

interface DiscoverFeedProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const iconFor: Record<FeedType, any> = {
  event: Calendar,
  offer: Tag,
  tip: Lightbulb,
  ai: Bot,
  reminder: Bell,
  car: Car,
  other: Lightbulb,
};

const colorFor: Record<FeedType, string> = {
  event: "bg-accent/15 text-accent-foreground",
  offer: "bg-primary/15 text-primary",
  tip: "bg-success/15 text-success",
  ai: "bg-warning/15 text-warning",
  reminder: "bg-muted/40 text-foreground",
  car: "bg-secondary/40 text-foreground",
  other: "bg-muted/40 text-foreground",
};

const DiscoverFeed = ({ onLanguageChange, currentLang }: DiscoverFeedProps) => {
  // Prepare for dynamic API fetch: later, call `/api/discover` here.
  // For now, load from local mockDiscoverData.
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const normalizeCategory = (cat?: string): FeedType => {
    const c = (cat || "").toLowerCase();
    if (c.includes("event")) return "event";
    if (c.includes("offer") || c.includes("deal")) return "offer";
    if (c.includes("tip")) return "tip";
    if (c.includes("ai")) return "ai";
    if (c.includes("remind")) return "reminder";
    if (c.includes("car") || c.includes("vehicle") || c.includes("auto")) return "car";
    return "other";
  };

  useEffect(() => {
    // Simulate async load; later replace with fetch('/api/discover')
    const load = async () => {
      const items: FeedItem[] = mockDiscoverData.map((d: DiscoverApiItem) => ({
        id: d.id,
        type: normalizeCategory(d.category),
        category: d.category,
        title: d.title,
        description: d.description,
        imageUrl: d.image,
        actionLabel: "Learn More",
        actionHref: d.link || "#",
      }));
      setFeed(items);
    };
    load();
  }, []);

  // Like / Save state persisted in localStorage
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const LIKED_KEY = "discoverLiked";
  const SAVED_KEY = "discoverSaved";

  useEffect(() => {
    try {
      const l = JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
      const s = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      setLiked(new Set(Array.isArray(l) ? l : []));
      setSaved(new Set(Array.isArray(s) ? s : []));
    } catch {}
  }, []);

  // Keep state in sync across tabs and same-tab custom events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LIKED_KEY) {
        try { const l = JSON.parse(e.newValue || '[]'); setLiked(new Set(Array.isArray(l) ? l : [])); } catch {}
      }
      if (e.key === SAVED_KEY) {
        try { const s = JSON.parse(e.newValue || '[]'); setSaved(new Set(Array.isArray(s) ? s : [])); } catch {}
      }
    };

    const onSaved = (ev: Event) => {
      try {
        // @ts-ignore
        const detail = ev.detail || {};
        const id = detail.id;
        const isSaved = !!detail.saved;
        setSaved(prev => {
          const n = new Set(prev);
          if (isSaved) n.add(id); else n.delete(id);
          return n;
        });
      } catch {}
    };

    const onLiked = (ev: Event) => {
      try {
        // @ts-ignore
        const detail = ev.detail || {};
        const id = detail.id;
        const isLiked = !!detail.liked;
        setLiked(prev => {
          const n = new Set(prev);
          if (isLiked) n.add(id); else n.delete(id);
          return n;
        });
      } catch {}
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('discover:saved', onSaved as EventListener);
    window.addEventListener('discover:liked', onLiked as EventListener);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('discover:saved', onSaved as EventListener);
      window.removeEventListener('discover:liked', onLiked as EventListener);
    };
  }, []);

  // Filter via query param `category`
  const location = useLocation();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const cat = params.get('category');
      setFilterCategory(cat ? cat : null);
    } catch {
      setFilterCategory(null);
    }
  }, [location.search]);

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(n)));
      return n;
    });
  };

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(n)));
      return n;
    });
  };

  // Details modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FeedItem | null>(null);
  const openDetails = (item: FeedItem) => { setSelected(item); setOpen(true); };
  const closeDetails = () => setOpen(false);

  // Lightweight animation: apply a static slide-up animation class.

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8B1538] rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-[#8B1538] text-lg sm:text-xl">Discover</h2>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="hidden md:block">
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="max-w-md mx-auto space-y-4">
  {feed.filter(item => !filterCategory || (item.category || '').toLowerCase() === (filterCategory || '').toLowerCase()).map((item) => {
          const Icon = iconFor[item.type];
          const isLiked = liked.has(item.id);
          const isSaved = saved.has(item.id);
          return (
            <div key={item.id} className="transition-all animate-slide-up">
              <Card className="bg-white hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer rounded-xl" onClick={() => openDetails(item)}>
              {item.imageUrl && (
                <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm shadow-sm">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="capitalize">{item.category}</span>
                    </span>
                  </div>
                </div>
              )}
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {!item.imageUrl && (
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${colorFor[item.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    {item.meta && <CardDescription>{item.meta}</CardDescription>}
                    {!item.meta && <CardDescription className="capitalize">{item.category}</CardDescription>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={cn("h-8 w-8", isLiked ? "text-red-500" : "text-muted-foreground")}
                    onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                    aria-label={isLiked ? "Unlike" : "Like"}
                  >
                    <Heart className={cn("w-4 h-4", isLiked ? "fill-red-500" : "")} />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={cn("h-8 w-8", isSaved ? "text-primary" : "text-muted-foreground")}
                    onClick={(e) => { e.stopPropagation(); toggleSave(item.id); 
                      try { window.dispatchEvent(new CustomEvent('discover:saved', { detail: { id: item.id, saved: !isSaved } })); } catch {}
                    }}
                    aria-label={isSaved ? "Unsave" : "Save"}
                  >
                    <Bookmark className={cn("w-4 h-4", isSaved ? "fill-current" : "")} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-2 pb-5">
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </CardContent>
              {(item.actionLabel || item.actionHref) && (
                <CardFooter className="pt-0">
                  <div className="flex w-full items-center gap-2">
                    <Button size="sm" className="bg-[#8B1538] hover:bg-[#6D1028]" onClick={(e) => { e.stopPropagation(); openDetails(item); }}>
                      {item.actionLabel || "View"}
                    </Button>
                    {item.actionHref && (
                      <Button asChild size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                        <a href={item.actionHref} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-1 h-4 w-4" />
                          Link
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              )}
              </Card>
            </div>
          );
        })}
        </div>
      </main>

      {/* Details Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription className="capitalize">{selected.category}</DialogDescription>
              </DialogHeader>
              {selected.imageUrl && (
                <div className="rounded-md overflow-hidden">
                  <img src={selected.imageUrl} alt={selected.title} className="w-full max-h-72 object-cover" />
                </div>
              )}
              <div className="text-sm text-card-foreground/90 leading-relaxed">
                {selected.description}
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => { toggleSave(selected.id); }}>
                  <Bookmark className="mr-2 h-4 w-4" /> {saved.has(selected.id) ? "Saved" : "Save"}
                </Button>
                <Button onClick={() => { toggleLike(selected.id); }}>
                  <Heart className="mr-2 h-4 w-4" /> {liked.has(selected.id) ? "Liked" : "Like"}
                </Button>
                {selected.actionHref && (
                  <Button asChild>
                    <a href={selected.actionHref} target="_blank" rel="noreferrer">
                      Open Link
                    </a>
                  </Button>
                )}
                <Button variant="ghost" onClick={closeDetails}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default DiscoverFeed;