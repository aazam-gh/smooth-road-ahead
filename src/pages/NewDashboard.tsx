import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/newavatar'
import { Separator } from '../components/ui/separator';
import { LanguageToggle } from '../components/LanguageToggle';

import BottomNav from "@/components/BottomNav";

import { 
  MapPin, 
  Calendar, 
  Clock, 
  Sun, 
  Cloud, 
  Navigation, 
  Car,
  TrendingUp,
  Utensils,
  Dumbbell,
  ShoppingBag,
  Camera,
  Plus,
  ChevronRight,
  Bell,
  Settings,
  Search
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { LanguageCode } from '../../types';

interface NewDashboardProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export function NewDashboard({ currentLang, onLanguageChange }: NewDashboardProps) {
  const userName = 'Ahmed'
  const userPreferences = {
    foodPreferences: ['international', 'vegetarian'],
    activityPreferences: ['sports', 'shopping', 'art'],
    workAddress: 'West Bay, Doha'
  };
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // Mock data for today's plans
  const todaysPlans = [
    {
      id: 1,
      time: '09:00 AM',
      title: 'Team Meeting',
      location: 'Office - West Bay',
      type: 'work',
      icon: Calendar
    },
    {
      id: 2,
      time: '01:00 PM',
      title: 'Lunch at Parisa',
      location: 'Souq Waqif',
      type: 'dining',
      icon: Utensils
    },
    {
      id: 3,
      time: '06:30 PM',
      title: 'Gym Session',
      location: 'Aspire Zone',
      type: 'fitness',
      icon: Dumbbell
    }
  ];

  // Plan suggestions based on preferences
  const planSuggestions = [
    {
      id: 1,
      category: 'Health & Fitness',
      icon: Dumbbell,
      color: 'bg-green-500',
      suggestions: [
        { name: 'Morning Yoga', time: '7:00 AM', location: 'Aspire Park' },
        { name: 'Evening Run', time: '5:30 PM', location: 'Corniche' }
      ],
      visible: userPreferences.activityPreferences.includes('sports')
    },
    {
      id: 2,
      category: 'Dining',
      icon: Utensils,
      color: 'bg-orange-500',
      suggestions: [
        { name: 'Lunch Special', time: '12:30 PM', location: 'Al Mourjan' },
        { name: 'Dinner Reservation', time: '8:00 PM', location: 'IDAM by Alain Ducasse' }
      ],
      visible: userPreferences.foodPreferences.length > 0
    },
    {
      id: 3,
      category: 'Outings',
      icon: Camera,
      color: 'bg-purple-500',
      suggestions: [
        { name: 'Museum Visit', time: '10:00 AM', location: 'Museum of Islamic Art' },
        { name: 'Gallery Opening', time: '7:00 PM', location: 'Katara Cultural Village' }
      ],
      visible: userPreferences.activityPreferences.includes('art')
    },
    {
      id: 4,
      category: 'Shopping',
      icon: ShoppingBag,
      color: 'bg-pink-500',
      suggestions: [
        { name: 'Weekend Sale', time: 'All Day', location: 'Villaggio Mall' },
        { name: 'New Collection', time: '2:00 PM', location: 'Place Vendôme' }
      ],
      visible: userPreferences.activityPreferences.includes('shopping')
    }
  ].filter(plan => plan.visible);

  // Personalized offers based on preferences
  const personalizedOffers = [
    {
      id: 1,
      title: '30% Off at Turkish Cuisine',
      description: 'Exclusive dinner offer at Istanbul Restaurant',
      image: 'https://images.unsplash.com/photo-1731941465921-eb4285693713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZmluZSUyMGRpbmluZ3xlbnwxfHx8fDE3NjIyMzgyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Dining',
      validUntil: 'Nov 30',
      discount: '30%',
      visible: userPreferences.foodPreferences.includes('international') || userPreferences.foodPreferences.includes('mediterranean')
    },
    {
      id: 2,
      title: 'Fitness Class Bundle',
      description: '3 months membership at premium rates',
      image: 'https://images.unsplash.com/photo-1758599879463-58aad7d947f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwZml0bmVzcyUyMHdvcmtvdXR8ZW58MXx8fHwxNzYyMjA5MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fitness',
      validUntil: 'Dec 15',
      discount: '40%',
      visible: userPreferences.activityPreferences.includes('sports')
    },
    {
      id: 3,
      title: 'Art Exhibition Pass',
      description: 'Free entry to all galleries this month',
      image: 'https://images.unsplash.com/photo-1706665714936-3211c96474c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwbXVzZXVtfGVufDF8fHx8MTc2MjI0NTY0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Culture',
      validUntil: 'Nov 25',
      discount: 'FREE',
      visible: userPreferences.activityPreferences.includes('art')
    },
    {
      id: 4,
      title: 'Luxury Shopping Event',
      description: 'VIP access to exclusive brands',
      image: 'https://images.unsplash.com/photo-1739523914934-353bb8f39d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjBsdXh1cnl8ZW58MXx8fHwxNzYyMTc2MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Shopping',
      validUntil: 'Dec 5',
      discount: '50%',
      visible: userPreferences.activityPreferences.includes('shopping')
    },
    {
      id: 5,
      title: 'Beach Activities Pass',
      description: 'Water sports and beach access included',
      image: 'https://images.unsplash.com/photo-1602477684116-3216b681e262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYmVhY2glMjBhY3Rpdml0aWVzfGVufDF8fHx8MTc2MjI0NTY0OHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Outdoor',
      validUntil: 'Dec 20',
      discount: '25%',
      visible: userPreferences.activityPreferences.includes('outdoor')
    },
    {
      id: 6,
      title: 'Healthy Bowl Special',
      description: 'Organic meals delivered fresh daily',
      image: 'https://images.unsplash.com/photo-1572319216151-4fb52730dc68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMGJvd2x8ZW58MXx8fHwxNzYyMjQ1NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Health',
      validUntil: 'Nov 28',
      discount: '20%',
      visible: userPreferences.foodPreferences.includes('vegetarian')
    }
  ].filter(offer => offer.visible);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#8B1538] rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-[#8B1538]">QIC</h2>
            </div>

            <div className="flex items-center gap-4">
              <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Avatar className="h-9 w-9 bg-[#8B1538]">
                <div className="flex items-center justify-center h-full w-full text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2">Welcome back, {userName.split(' ')[0]}!</h1>
          <p className="text-gray-600">{formattedDate}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weather & Traffic Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weather Card */}
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Current Weather</p>
                    <h2 className="text-white">28°C</h2>
                  </div>
                  <Sun className="h-12 w-12 text-yellow-300" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Cloud className="h-4 w-4" />
                    <span>Partly Cloudy</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>Doha, Qatar</span>
                  </div>
                </div>
              </Card>

              {/* Traffic Card */}
              <Card className="p-6 bg-gradient-to-br from-[#8B1538] to-[#6D1028] text-white border-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Traffic to Office</p>
                    <h2 className="text-white">15 min</h2>
                  </div>
                  <Car className="h-12 w-12 text-white/90" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>Light traffic</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="h-4 w-4" />
                    <span>{userPreferences.workAddress}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Today's Plans */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3>Today's Plans</h3>
                <Button size="sm" className="bg-[#8B1538] hover:bg-[#6D1028]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plan
                </Button>
              </div>

              <div className="space-y-4">
                {todaysPlans.map((plan, index) => {
                  const Icon = plan.icon;
                  return (
                    <div key={plan.id}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-[#8B1538]/10 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-[#8B1538]" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="mb-1">{plan.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{plan.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{plan.location}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < todaysPlans.length - 1 && <Separator className="mt-4" />}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Make Your Plans */}
            <Card className="p-6">
              <h3 className="mb-6">Make Your Plans for Today</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planSuggestions.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card key={category.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-[#8B1538]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-2">{category.category}</h4>
                          <div className="space-y-2">
                            {category.suggestions.map((suggestion, idx) => (
                              <div key={idx} className="text-sm text-gray-600">
                                <p className="truncate">{suggestion.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{suggestion.time}</span>
                                  <span>•</span>
                                  <span>{suggestion.location}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Add to Plans
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </Card>

            {/* Personalized Offers */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3>Personalized Offers</h3>
                  <p className="text-sm text-gray-600 mt-1">Based on your preferences</p>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedOffers.slice(0, 4).map((offer) => (
                  <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-0 shadow">
                    <div className="relative h-40">
                      <ImageWithFallback
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[#8B1538] text-white border-0">
                          {offer.discount} OFF
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {offer.category}
                      </Badge>
                      <h4 className="mb-1">{offer.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Valid until {offer.validUntil}</span>
                        <Button size="sm" className="bg-[#8B1538] hover:bg-[#6D1028]">
                          Claim
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h4 className="mb-4">Your Activity</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Plans Completed</span>
                    <span className="text-sm">12/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#8B1538] h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Offers Claimed</span>
                    <span className="text-sm">8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-6">
              <h4 className="mb-4">Upcoming Events</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-purple-600">NOV</span>
                    <span className="text-purple-800">15</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">Art Exhibition</p>
                    <p className="text-xs text-gray-500">Katara Cultural Village</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-orange-600">NOV</span>
                    <span className="text-orange-800">20</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">Food Festival</p>
                    <p className="text-xs text-gray-500">Souq Waqif</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-blue-600">NOV</span>
                    <span className="text-blue-800">25</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">Music Concert</p>
                    <p className="text-xs text-gray-500">Qatar National Convention Centre</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h4 className="mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Explore Nearby
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Utensils className="h-4 w-4 mr-2" />
                  Find Restaurants
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}