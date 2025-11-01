import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Car,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Wrench,
  Droplets,
  Battery,
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
  const vehicle = {
    make: "Toyota",
    model: "Camry",
    year: "2020",
    mileage: 45280,
    health: 87,
  };

  const maintenanceItems = [
    {
      id: 1,
      title: t('dashboard.oil_change'),
      dueIn: `1,200 ${t('dashboard.miles')}`,
      status: "upcoming",
      icon: Droplets,
      progress: 85,
    },
    {
      id: 2,
      title: t('dashboard.tire_rotation'),
      dueIn: `3,500 ${t('dashboard.miles')}`,
      status: "good",
      icon: Wrench,
      progress: 45,
    },
    {
      id: 3,
      title: t('dashboard.brake_inspection'),
      dueIn: "2 months",
      status: "upcoming",
      icon: Battery,
      progress: 70,
    },
  ];

  const recentServices = [
    { title: "Brake Inspection", date: "2 weeks ago", cost: "$89" },
    { title: "Air Filter Replacement", date: "1 month ago", cost: "$35" },
    { title: "Oil Change", date: "2 months ago", cost: "$55" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <p className="text-sm opacity-90 mb-1">Your Vehicle</p>
              <h1 className="text-2xl font-bold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
            </div>
            <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold">{vehicle.health}%</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-3">{t('dashboard.vehicle_health')}</p>
          <Progress value={vehicle.health} className="h-2 bg-white/20" />

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="opacity-90">Current Mileage</span>
            <span className="font-semibold">{vehicle.mileage.toLocaleString()} mi</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4">
        {/* Upcoming Maintenance */}
        <Card className="p-5 shadow-elevated bg-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              {t('dashboard.upcoming_maintenance')}
            </h2>
            <Badge variant="secondary" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {maintenanceItems.filter((i) => i.status === "upcoming").length}
            </Badge>
          </div>

          <div className="space-y-4">
            {maintenanceItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.status === "upcoming"
                            ? "bg-warning/10"
                            : "bg-success/10"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            item.status === "upcoming"
                              ? "text-warning"
                              : "text-success"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('dashboard.due_in')} {item.dueIn}
                        </p>
                      </div>
                    </div>
                    {item.status === "good" && (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                  </div>
                  <Progress value={item.progress} className="h-1.5" />
                </div>
              );
            })}
          </div>

          <Button className="w-full mt-4" variant="outline">
            {t('dashboard.view_all')}
          </Button>
        </Card>

        {/* Recent Services */}
        <Card className="p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-card-foreground">{t('dashboard.recent_service')}</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {recentServices.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-card-foreground">{service.title}</p>
                  <p className="text-sm text-muted-foreground">{service.date}</p>
                </div>
                <span className="font-semibold text-card-foreground">{service.cost}</span>
              </div>
            ))}
          </div>

          <Button className="w-full mt-4" variant="outline">
            {t('dashboard.view_all')}
          </Button>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
