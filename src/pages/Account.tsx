import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Bell, HelpCircle, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { LanguageCode } from "../../types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AccountProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const Account = ({ onLanguageChange, currentLang }: AccountProps) => {
  const { t } = useI18n();

  const menuItems = [
    { icon: User, title: t('account.profile'), description: "Edit your personal information" },
    { icon: Settings, title: t('account.preferences'), description: "Customize your experience" },
    { icon: Bell, title: t('account.notifications'), description: t('account.notification_desc') },
    { icon: HelpCircle, title: "Help & Support", description: "Get assistance" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold mb-2">{t('account.title')}</h1>
              <p className="text-sm opacity-90">Manage your profile and settings</p>
            </div>
            <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4">
        <Card className="p-6 shadow-elevated bg-card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">{t('account.email')}</p>
            </div>
          </div>
          <Button className="w-full" variant="outline">
            {t('account.profile')}
          </Button>
        </Card>

        <Card className="p-4 shadow-card mb-6">
          <div className="flex items-center justify-between p-3">
            <div className="flex-1">
              <p className="font-medium text-card-foreground">{t('account.language')}</p>
              <p className="text-sm text-muted-foreground">
                {currentLang === 'en' ? 'English' : 'العربية'}
              </p>
            </div>
            <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
          </div>
        </Card>

        <Card className="p-4 shadow-card mb-6">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-card-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4 mr-2" />
          {t('account.logout')}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Account;
