import BottomNav from "@/components/BottomNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Calendar, Tag, Lightbulb, Bot, Bell, Car, Heart, Bookmark, Share, MessageCircle, MapPin, Settings, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { LanguageCode } from "../../types";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { mockDiscoverData, type DiscoverApiItem } from "../lib/discoverData";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type FeedType = "event" | "offer" | "tip" | "ai" | "reminder" | "car" | "other";

interface VideoFeedItem {
  id: string;
  type: FeedType;
  category: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration?: number;
  author?: string;
  likes?: number;
  views?: number;
  actionHref?: string;
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

// Video Player Component
const VideoPlayer = ({ item, isActive, onTogglePlay, onToggleMute }: {
  item: VideoFeedItem;
  isActive: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    onTogglePlay();
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
    onToggleMute();
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={item.videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
      />
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Play/Pause overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={handlePlayPause}
      >
        {!isPlaying && (
          <div className="bg-black/50 rounded-full p-4">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        )}
      </div>

      {/* Mute button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
        onClick={handleMuteToggle}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </div>
  );
};

const DiscoverFeed = ({ onLanguageChange, currentLang }: DiscoverFeedProps) => {
  const { t } = useI18n();
  const [feed, setFeed] = useState<VideoFeedItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const load = async () => {
      const items: VideoFeedItem[] = mockDiscoverData.map((d: DiscoverApiItem) => ({
        id: d.id,
        type: normalizeCategory(d.category),
        category: d.category,
        title: d.title,
        description: d.description,
        videoUrl: d.video,
        duration: d.duration,
        author: d.author,
        likes: d.likes,
        views: d.views,
        actionHref: d.link || "#",
      }));
      setFeed(items);
    };
    load();
  }, []);

  // Like / Save state
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

  // Scroll handling for video switching
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = window.innerHeight - 120; // Account for header/nav
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < feed.length) {
      setCurrentVideoIndex(newIndex);
    }
  }, [currentVideoIndex, feed.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#8B1538] rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-white text-lg font-semibold">{t('discover.title')}</h2>
            </div>

            <div className="flex items-center gap-2">
              <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Video Feed */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {feed.map((item, index) => {
          const Icon = iconFor[item.type];
          const isLiked = liked.has(item.id);
          const isSaved = saved.has(item.id);
          const isActive = index === currentVideoIndex;

          return (
            <div 
              key={item.id} 
              className="relative w-full snap-start snap-always"
              style={{ height: 'calc(100vh - 120px)' }}
            >
              {/* Video Player */}
              {item.videoUrl && (
                <VideoPlayer
                  item={item}
                  isActive={isActive}
                  onTogglePlay={() => {}}
                  onToggleMute={() => {}}
                />
              )}

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4 pointer-events-auto">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="capitalize">{item.category}</span>
                </span>
              </div>

              {/* Right Side Actions */}
              <div className="absolute right-4 bottom-20 flex flex-col gap-4 pointer-events-auto">
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm",
                    isLiked ? "text-red-500" : "text-white"
                  )}
                  onClick={() => toggleLike(item.id)}
                >
                  <Heart className={cn("w-6 h-6", isLiked ? "fill-red-500" : "")} />
                </Button>
                <div className="text-white text-xs text-center font-medium">
                  {formatNumber(item.likes)}
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  onClick={() => {}}
                >
                  <MessageCircle className="w-6 h-6" />
                </Button>
                <div className="text-white text-xs text-center font-medium">
                  {Math.floor(Math.random() * 50)}
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm",
                    isSaved ? "text-yellow-500" : "text-white"
                  )}
                  onClick={() => toggleSave(item.id)}
                >
                  <Bookmark className={cn("w-6 h-6", isSaved ? "fill-yellow-500" : "")} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  onClick={() => {}}
                >
                  <Share className="w-6 h-6" />
                </Button>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-20 pointer-events-auto">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#8B1538] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {item.author?.charAt(0) || 'Q'}
                      </span>
                    </div>
                    <span className="text-white font-medium text-sm">
                      {item.author || 'QIC'}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-white/90 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-white/70 text-xs">
                    <span>{formatNumber(item.views)} views</span>
                    {item.duration && <span>{item.duration}s</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default DiscoverFeed;