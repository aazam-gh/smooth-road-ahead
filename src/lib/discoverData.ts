// Mock data for the Discover feed – replace with a real API later
// Shape matches the requested contract: id, category, title, description, image, link

export interface DiscoverApiItem {
  id: string;
  category: string; // e.g., "event" | "offer" | "tip" | "ai" | "reminder"
  title: string;
  description: string;
  image?: string;
  video?: string;
  link?: string;
  // optional metadata for personalization
  publishedAt?: string; // ISO date
  duration?: number; // video duration in seconds
  author?: string;
  likes?: number;
  views?: number;
}

export const mockDiscoverData: DiscoverApiItem[] = [
  {
    id: "1",
    category: "event",
    title: "Cars & Coffee – West Bay",
    description: "Join fellow enthusiasts this Friday from 8–11am. Free entry, family friendly. Amazing turnout expected! 🚗☕",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    publishedAt: "2025-10-25T08:00:00.000Z",
    duration: 30,
    author: "QIC Events",
    likes: 1240,
    views: 8500,
    link: "#event-1",
  },
  {
    id: "2",
    category: "offer",
    title: "20% off AC Service",
    description: "Stay cool this summer! Limited-time offer at select partner garages. Book by the end of this week and save big! ❄️🔧",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    publishedAt: "2025-11-01T09:00:00.000Z",
    duration: 25,
    author: "QIC Partners",
    likes: 890,
    views: 5200,
    link: "#offer-1",
  },
  {
    id: "3",
    category: "tip",
    title: "Summer Heat Survival Tips",
    description: "Check coolant levels monthly and park in shade to reduce thermal stress on the battery. Your car will thank you! 🌡️🚗",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    publishedAt: "2025-09-20T07:00:00.000Z",
    duration: 45,
    author: "Car Care Pro",
    likes: 2100,
    views: 12000,
    link: "#tip-1",
  },
  {
    id: "4",
    category: "ai",
    title: "AI Maintenance Alert",
    description: "Based on your last service, consider an air filter inspection in ~1,200 miles. Smart maintenance keeps you rolling! 🤖⚙️",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    publishedAt: "2025-10-28T06:00:00.000Z",
    duration: 20,
    author: "QIC AI Assistant",
    likes: 650,
    views: 3800,
    link: "#ai-1",
  },
  {
    id: "5",
    category: "reminder",
    title: "Insurance Renewal Alert",
    description: "Your policy is up for renewal in 12 days. Review your coverage or renew now to stay protected on the road! 📋✅",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    publishedAt: "2025-10-15T06:00:00.000Z",
    duration: 15,
    author: "QIC Insurance",
    likes: 420,
    views: 2100,
    link: "#reminder-1",
  },
  {
    id: "6",
    category: "offer",
    title: "Free Tire Health Check",
    description: "Stop by any partner location to get a complimentary tire health check this weekend. Safety first! 🛞✨",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    publishedAt: "2025-10-30T12:00:00.000Z",
    duration: 35,
    author: "Tire Experts",
    likes: 1580,
    views: 9200,
    link: "#offer-2",
  },
  {
    id: "7",
    category: "tip",
    title: "Quick Oil Change Guide",
    description: "Learn the signs when your car needs an oil change. Don't wait until it's too late! Regular maintenance = happy engine 🛢️🔧",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    publishedAt: "2025-11-02T10:00:00.000Z",
    duration: 60,
    author: "Mechanic Mike",
    likes: 3200,
    views: 18500,
    link: "#tip-2",
  },
  {
    id: "8",
    category: "event",
    title: "Classic Car Show",
    description: "Vintage beauties on display this weekend at City Center. Bring the family and enjoy classic automotive history! 🏁🎪",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    publishedAt: "2025-11-03T14:00:00.000Z",
    duration: 40,
    author: "Classic Car Club",
    likes: 2800,
    views: 15600,
    link: "#event-2",
  },
];