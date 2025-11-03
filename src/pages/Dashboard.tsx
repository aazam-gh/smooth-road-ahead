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

      <div className="max-w-md mx-auto px-6 py-8">
        {/* Empty for now */}
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
