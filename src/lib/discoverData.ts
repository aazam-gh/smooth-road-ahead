// Mock data for the Discover feed – replace with a real API later
// Shape matches the requested contract: id, category, title, description, image, link

export interface DiscoverApiItem {
  id: string;
  category: string; // e.g., "event" | "offer" | "tip" | "ai" | "reminder"
  title: string;
  description: string;
  image?: string;
  link?: string;
}

export const mockDiscoverData: DiscoverApiItem[] = [
  {
    id: "1",
    category: "event",
    title: "Cars & Coffee – West Bay",
    description: "Join fellow enthusiasts this Friday from 8–11am. Free entry, family friendly.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    link: "#event-1",
  },
  {
    id: "2",
    category: "offer",
    title: "20% off AC Service",
    description: "Stay cool. Limited-time offer at select partner garages. Book by the end of this week.",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop",
    link: "#offer-1",
  },
  {
    id: "3",
    category: "tip",
    title: "Summer Heat Tip",
    description: "Check coolant levels monthly and park in shade to reduce thermal stress on the battery.",
    link: "#tip-1",
  },
  {
    id: "4",
    category: "ai",
    title: "From QIC Daily AI",
    description: "Based on your last service, consider an air filter inspection in ~1,200 miles.",
    link: "#ai-1",
  },
  {
    id: "5",
    category: "reminder",
    title: "Insurance Renewal",
    description: "Your policy is up for renewal in 12 days. Review your coverage or renew now.",
    link: "#reminder-1",
  },
  {
    id: "6",
    category: "offer",
    title: "Free Tire Check",
    description: "Stop by any partner to get a complimentary tire health check this weekend.",
    image: "https://images.unsplash.com/photo-1511715280715-1f2b3b749875?q=80&w=1200&auto=format&fit=crop",
    link: "#offer-2",
  },
];