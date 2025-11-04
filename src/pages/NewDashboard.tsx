import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/newavatar'
import { Separator } from '../components/ui/separator';
import { LanguageToggle } from '../components/LanguageToggle';

import BottomNav from "@/components/BottomNav";
import DailyCheckin from "@/components/DailyCheckin";

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
  Search,
  X,
  Edit3,
  Star
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { OfferModal } from '../components/OfferModal';
import { LanguageCode } from '../../types';
import { useI18n } from '@/lib/i18n';
import { useState } from 'react';

interface NewDashboardProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export function NewDashboard({ currentLang, onLanguageChange }: NewDashboardProps) {
  const { t } = useI18n();
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

  // State for managing today's plans
  const [todaysPlans, setTodaysPlans] = useState([
    {
      id: 1,
      time: '09:00 AM',
      title: t('newdashboard.team_meeting'),
      location: t('newdashboard.office_west_bay'),
      type: 'work',
      icon: Calendar
    },
    {
      id: 2,
      time: '01:00 PM',
      title: t('newdashboard.lunch_at_parisa'),
      location: t('newdashboard.souq_waqif'),
      type: 'dining',
      icon: Utensils
    },
    {
      id: 3,
      time: '06:30 PM',
      title: t('newdashboard.gym_session'),
      location: t('newdashboard.aspire_zone'),
      type: 'fitness',
      icon: Dumbbell
    }
  ]);

  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    time: '',
    title: '',
    location: '',
    type: 'general'
  });

  // State for offer modal
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [claimedOffers, setClaimedOffers] = useState<Set<number>>(new Set());

  // Function to remove a plan
  const removePlan = (planId: number) => {
    setTodaysPlans(plans => plans.filter(plan => plan.id !== planId));
  };

  // Function to add a new plan
  const addPlan = () => {
    if (newPlan.title && newPlan.time && newPlan.location) {
      const planTypeIcons = {
        work: Calendar,
        dining: Utensils,
        fitness: Dumbbell,
        shopping: ShoppingBag,
        general: Calendar
      };

      const plan = {
        id: Date.now(), // Simple ID generation
        time: newPlan.time,
        title: newPlan.title,
        location: newPlan.location,
        type: newPlan.type,
        icon: planTypeIcons[newPlan.type as keyof typeof planTypeIcons] || Calendar
      };

      setTodaysPlans(plans => [...plans, plan].sort((a, b) => {
        // Sort by time
        const timeA = new Date(`1970/01/01 ${a.time}`);
        const timeB = new Date(`1970/01/01 ${b.time}`);
        return timeA.getTime() - timeB.getTime();
      }));

      // Reset form
      setNewPlan({ time: '', title: '', location: '', type: 'general' });
      setShowAddPlanForm(false);
    }
  };

  // Function to handle offer click
  const handleOfferClick = (offer: any) => {
    setSelectedOffer(offer);
    setIsOfferModalOpen(true);
  };

  // Function to handle offer claim
  const handleOfferClaim = (offerId: number) => {
    setClaimedOffers(prev => new Set([...prev, offerId]));
    // Here you could also make an API call to claim the offer
    console.log(`Claimed offer ${offerId}`);
  };

  // Function to close offer modal
  const closeOfferModal = () => {
    setIsOfferModalOpen(false);
    setSelectedOffer(null);
  };

  // Plan suggestions based on preferences
  const planSuggestions = [
    {
      id: 1,
      category: t('newdashboard.health_fitness'),
      icon: Dumbbell,
      color: 'bg-green-500',
      suggestions: [
        { name: t('newdashboard.morning_yoga'), time: '7:00 AM', location: t('newdashboard.aspire_park') },
        { name: t('newdashboard.evening_run'), time: '5:30 PM', location: t('newdashboard.corniche') }
      ],
      visible: userPreferences.activityPreferences.includes('sports')
    },
    {
      id: 2,
      category: t('newdashboard.dining'),
      icon: Utensils,
      color: 'bg-primary',
      suggestions: [
        { name: t('newdashboard.lunch_special'), time: '12:30 PM', location: t('newdashboard.al_mourjan') },
        { name: t('newdashboard.dinner_reservation'), time: '8:00 PM', location: t('newdashboard.idam_restaurant') }
      ],
      visible: userPreferences.foodPreferences.length > 0
    },
    {
      id: 3,
      category: t('newdashboard.outings'),
      icon: Camera,
      color: 'bg-purple-500',
      suggestions: [
        { name: t('newdashboard.museum_visit'), time: '10:00 AM', location: t('newdashboard.museum_islamic_art') },
        { name: t('newdashboard.gallery_opening'), time: '7:00 PM', location: t('newdashboard.katara_cultural') }
      ],
      visible: userPreferences.activityPreferences.includes('art')
    },
    {
      id: 4,
      category: t('newdashboard.shopping'),
      icon: ShoppingBag,
      color: 'bg-pink-500',
      suggestions: [
        { name: t('newdashboard.weekend_sale'), time: t('newdashboard.all_day'), location: t('newdashboard.villaggio_mall') },
        { name: t('newdashboard.new_collection'), time: '2:00 PM', location: t('newdashboard.place_vendome') }
      ],
      visible: userPreferences.activityPreferences.includes('shopping')
    }
  ].filter(plan => plan.visible);

  // Personalized offers based on preferences
  const personalizedOffers = [
    {
      id: 1,
      title: t('newdashboard.turkish_cuisine'),
      description: t('newdashboard.turkish_desc'),
      fullDescription: 'Experience authentic Turkish flavors with our specially curated menu featuring traditional dishes prepared by master chefs. Enjoy a cultural dining experience in the heart of Doha.',
      image: 'https://images.unsplash.com/photo-1731941465921-eb4285693713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZmluZSUyMGRpbmluZ3xlbnwxfHx8fDE3NjIyMzgyMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: t('newdashboard.dining'),
      validUntil: 'Nov 30',
      discount: '30%',
      location: 'Souq Waqif, Doha',
      rating: 4.8,
      originalPrice: 'QAR 150',
      discountedPrice: 'QAR 105',
      terms: [
        'Valid for dinner only (6 PM - 11 PM)',
        'Cannot be combined with other offers',
        'Advance reservation required',
        'Valid until November 30, 2024'
      ],
      visible: userPreferences.foodPreferences.includes('international') || userPreferences.foodPreferences.includes('mediterranean')
    },
    {
      id: 2,
      title: t('newdashboard.fitness_bundle'),
      description: t('newdashboard.fitness_desc'),
      fullDescription: 'Get access to premium fitness facilities including personal training sessions, group classes, and wellness programs. Perfect for maintaining your health goals.',
      image: 'https://images.unsplash.com/photo-1758599879463-58aad7d947f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwZml0bmVzcyUyMHdvcmtvdXR8ZW58MXx8fHwxNzYyMjA5MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fitness',
      validUntil: 'Dec 15',
      discount: '40%',
      location: 'Aspire Zone, Doha',
      rating: 4.6,
      originalPrice: 'QAR 500',
      discountedPrice: 'QAR 300',
      terms: [
        '3-month membership included',
        'Access to all group classes',
        'One personal training session',
        'Valid for new members only'
      ],
      visible: userPreferences.activityPreferences.includes('sports')
    },
    {
      id: 3,
      title: t('newdashboard.art_exhibition'),
      description: t('newdashboard.art_desc'),
      fullDescription: 'Discover contemporary Middle Eastern art in this exclusive exhibition featuring works from renowned regional artists. A cultural journey through modern Islamic art.',
      image: 'https://images.unsplash.com/photo-1706665714936-3211c96474c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBleGhpYml0aW9uJTIwbXVzZXVtfGVufDF8fHx8MTc2MjI0NTY0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Culture',
      validUntil: 'Nov 25',
      discount: 'FREE',
      location: 'Museum of Islamic Art, Doha',
      rating: 4.9,
      originalPrice: 'QAR 50',
      discountedPrice: 'FREE',
      terms: [
        'Free admission with QIC membership',
        'Valid weekdays only',
        'Audio guide included',
        'Photography allowed in designated areas'
      ],
      visible: userPreferences.activityPreferences.includes('art')
    },
    {
      id: 4,
      title: t('newdashboard.luxury_shopping'),
      description: t('newdashboard.luxury_desc'),
      fullDescription: 'Exclusive shopping experience at premium boutiques with personal styling services and VIP treatment. Discover the latest collections from international brands.',
      image: 'https://images.unsplash.com/photo-1739523914934-353bb8f39d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjBsdXh1cnl8ZW58MXx8fHwxNzYyMTc2MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: t('newdashboard.shopping'),
      validUntil: 'Dec 5',
      discount: '50%',
      location: 'Place Vendôme, Lusail',
      rating: 4.7,
      originalPrice: 'QAR 1000',
      discountedPrice: 'QAR 500',
      terms: [
        'Personal stylist consultation included',
        'Valid on selected brands only',
        'Minimum purchase required',
        'VIP lounge access included'
      ],
      visible: userPreferences.activityPreferences.includes('shopping')
    },
    {
      id: 5,
      title: t('newdashboard.beach_activities'),
      description: t('newdashboard.beach_desc'),
      fullDescription: 'Enjoy water sports and beach activities including kayaking, paddleboarding, and beach volleyball. Perfect for outdoor enthusiasts and families.',
      image: 'https://images.unsplash.com/photo-1602477684116-3216b681e262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwYmVhY2glMjBhY3Rpdml0aWVzfGVufDF8fHx8MTc2MjI0NTY0OHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Outdoor',
      validUntil: 'Dec 20',
      discount: '25%',
      location: 'Katara Beach, Doha',
      rating: 4.5,
      originalPrice: 'QAR 200',
      discountedPrice: 'QAR 150',
      terms: [
        'Equipment rental included',
        'Valid weekends only',
        'Weather dependent',
        'Age restrictions apply for some activities'
      ],
      visible: userPreferences.activityPreferences.includes('outdoor')
    },
    {
      id: 6,
      title: t('newdashboard.healthy_bowl'),
      description: t('newdashboard.healthy_desc'),
      fullDescription: 'Fresh, organic ingredients crafted into nutritious and delicious bowls. Perfect for health-conscious diners looking for clean eating options.',
      image: 'https://images.unsplash.com/photo-1572319216151-4fb52730dc68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMGJvd2x8ZW58MXx8fHwxNzYyMjQ1NjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Health',
      validUntil: 'Nov 28',
      discount: '20%',
      location: 'West Bay, Doha',
      rating: 4.4,
      originalPrice: 'QAR 75',
      discountedPrice: 'QAR 60',
      terms: [
        'Organic ingredients guaranteed',
        'Customizable dietary options',
        'Valid for lunch and dinner',
        'Delivery available'
      ],
      visible: userPreferences.foodPreferences.includes('vegetarian')
    }
  ].filter(offer => offer.visible);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8B1538] rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-[#8B1538] text-lg sm:text-xl">QIC</h2>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="hidden md:block">
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              <Avatar className="h-7 w-7 sm:h-9 sm:w-9 bg-[#8B1538]">
                <div className="flex items-center justify-center h-full w-full text-white text-sm sm:text-base">
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
          <h1 className="mb-2">{t('newdashboard.welcome_back')}, {userName.split(' ')[0]}!</h1>
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
                    <p className="text-blue-100 text-sm mb-1">{t('newdashboard.current_weather')}</p>
                    <h2 className="text-white">28°C</h2>
                  </div>
                  <Sun className="h-12 w-12 text-yellow-300" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Cloud className="h-4 w-4" />
                    <span>{t('newdashboard.partly_cloudy')}</span>
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
                    <p className="text-white/80 text-sm mb-1">{t('newdashboard.traffic_to_office')}</p>
                    <h2 className="text-white">15 min</h2>
                  </div>
                  <Car className="h-12 w-12 text-white/90" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>{t('newdashboard.light_traffic')}</span>
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
                <h3>{t('newdashboard.todays_plans')}</h3>
                <Button 
                  size="sm" 
                  className="bg-[#8B1538] hover:bg-[#6D1028]"
                  onClick={() => setShowAddPlanForm(!showAddPlanForm)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('newdashboard.add_plan')}
                </Button>
              </div>

              {/* Add Plan Form */}
              {showAddPlanForm && (
                <Card className="p-4 mb-6 bg-gray-50 border-dashed">
                  <h4 className="mb-4 text-sm font-medium">{t('newdashboard.add_new_plan')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('newdashboard.plan_title')}
                      </label>
                      <input
                        type="text"
                        value={newPlan.title}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                        placeholder={t('newdashboard.enter_plan_title')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('newdashboard.time')}
                      </label>
                      <input
                        type="time"
                        value={newPlan.time}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('newdashboard.location')}
                      </label>
                      <input
                        type="text"
                        value={newPlan.location}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                        placeholder={t('newdashboard.enter_location')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('newdashboard.category')}
                      </label>
                      <select
                        value={newPlan.type}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                      >
                        <option value="general">{t('newdashboard.general')}</option>
                        <option value="work">{t('newdashboard.work')}</option>
                        <option value="dining">{t('newdashboard.dining')}</option>
                        <option value="fitness">{t('newdashboard.fitness')}</option>
                        <option value="shopping">{t('newdashboard.shopping')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={addPlan}
                      className="bg-[#8B1538] hover:bg-[#6D1028]"
                    >
                      {t('newdashboard.save_plan')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setShowAddPlanForm(false);
                        setNewPlan({ time: '', title: '', location: '', type: 'general' });
                      }}
                    >
                      {t('newdashboard.cancel')}
                    </Button>
                  </div>
                </Card>
              )}

              <div className="space-y-4">
                {todaysPlans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>{t('newdashboard.no_plans_today')}</p>
                    <p className="text-sm">{t('newdashboard.add_plan_to_get_started')}</p>
                  </div>
                ) : (
                  todaysPlans.map((plan, index) => {
                    const Icon = plan.icon;
                    return (
                      <div key={plan.id}>
                        <div className="flex items-start gap-4 group">
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
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removePlan(plan.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < todaysPlans.length - 1 && <Separator className="mt-4" />}
                      </div>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Make Your Plans */}
            <Card className="p-6">
              <h3 className="mb-6">{t('newdashboard.make_plans')}</h3>
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
                        {t('newdashboard.add_to_plans')}
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
                  <h3>{t('newdashboard.personalized_offers')}</h3>
                  <p className="text-sm text-gray-600 mt-1">{t('newdashboard.based_on_preferences')}</p>
                </div>
                <Button variant="ghost" size="sm">
                  {t('dashboard.view_all')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedOffers.slice(0, 4).map((offer) => (
                  <Card 
                    key={offer.id} 
                    className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow hover:scale-[1.02]"
                    onClick={() => handleOfferClick(offer)}
                  >
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
                      {claimedOffers.has(offer.id) && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-green-500 text-white border-0 text-xs">
                            {t('newdashboard.claimed')}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {offer.category}
                        </Badge>
                        {offer.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{offer.rating}</span>
                          </div>
                        )}
                      </div>
                      <h4 className="mb-1">{offer.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{offer.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{t('newdashboard.valid_until')} {offer.validUntil}</span>
                        <Button 
                          size="sm" 
                          className={claimedOffers.has(offer.id) 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "bg-[#8B1538] hover:bg-[#6D1028]"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!claimedOffers.has(offer.id)) {
                              handleOfferClaim(offer.id);
                            }
                          }}
                          disabled={claimedOffers.has(offer.id)}
                        >
                          {claimedOffers.has(offer.id) ? t('newdashboard.claimed') : t('newdashboard.claim')}
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
            {/* Daily Check-in */}
            <DailyCheckin />

            {/* Quick Stats */}
            <Card className="p-6">
              <h4 className="mb-4">{t('newdashboard.your_activity')}</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('newdashboard.plans_completed')}</span>
                    <span className="text-sm">12/15</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#8B1538] h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('newdashboard.offers_claimed')}</span>
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
              <h4 className="mb-4">{t('newdashboard.upcoming_events')}</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-purple-600">NOV</span>
                    <span className="text-purple-800">15</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{t('newdashboard.art_exhibition_event')}</p>
                    <p className="text-xs text-gray-500">{t('newdashboard.katara_cultural')}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-primary">NOV</span>
                    <span className="text-primary font-medium">20</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{t('newdashboard.food_festival')}</p>
                    <p className="text-xs text-gray-500">{t('newdashboard.souq_waqif')}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-blue-600">NOV</span>
                    <span className="text-blue-800">25</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{t('newdashboard.music_concert')}</p>
                    <p className="text-xs text-gray-500">{t('newdashboard.qatar_convention')}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h4 className="mb-4">{t('newdashboard.quick_actions')}</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('newdashboard.view_calendar')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('newdashboard.explore_nearby')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Utensils className="h-4 w-4 mr-2" />
                  {t('newdashboard.find_restaurants')}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <BottomNav />
      
      {/* Offer Modal */}
      <OfferModal
        offer={selectedOffer}
        isOpen={isOfferModalOpen}
        onClose={closeOfferModal}
        onClaim={handleOfferClaim}
        isClaimed={selectedOffer ? claimedOffers.has(selectedOffer.id) : false}
      />
    </div>
  );
}