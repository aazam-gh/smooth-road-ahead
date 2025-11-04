import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Bell, HelpCircle, LogOut, MapPin } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8B1538] rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-[#8B1538] text-lg sm:text-xl truncate">{t('account.title')}</h2>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#8B1538]/10 flex items-center justify-center">
              <User className="w-8 h-8 text-[#8B1538]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t('user.john_doe')}</h2>
              <p className="text-sm text-gray-600">{t('account.email')}</p>
            </div>
          </div>
          <Button className="w-full bg-[#8B1538] hover:bg-[#6568F4]">
            {t('account.profile')}
          </Button>
        </Card>

        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between p-3">
            <div className="flex-1">
              <p className="font-medium">{t('account.language')}</p>
              <p className="text-sm text-gray-600">
                {currentLang === 'en' ? 'English' : 'العربية'}
              </p>
            </div>
            <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
          </div>
        </Card>

        <Card className="p-4 mb-6">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#8B1538]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#8B1538]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          {t('account.logout')}
        </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Account;
