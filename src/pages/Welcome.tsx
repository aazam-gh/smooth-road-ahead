import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MapPin, Shield, Bell } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { LanguageCode } from "../../types";

interface WelcomeProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const Welcome = ({ onLanguageChange, currentLang }: WelcomeProps) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8B1538] rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-[#8B1538] text-lg sm:text-xl">QIC</h2>
            </div>
            <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-[#8B1538] rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-white" />
            </div>
            <h1 className="mb-4">{t('welcome.title')}</h1>
            <p className="text-gray-600 mb-8">
              {t('welcome.subtitle')}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#8B1538]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#8B1538]" />
                </div>
                <div>
                  <h3 className="mb-2">{t('welcome.feature1.title')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('welcome.feature1.desc')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#8B1538]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-[#8B1538]" />
                </div>
                <div>
                  <h3 className="mb-2">{t('welcome.feature2.title')}</h3>
                  <p className="text-sm text-gray-600">
                    {t('welcome.feature2.desc')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/onboarding")}
              size="lg"
              className="w-full bg-[#8B1538] hover:bg-[#6D1028]"
            >
              {t('welcome.get_started')}
            </Button>
            <Button
              onClick={() => navigate("/onboarding")}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {t('welcome.have_account')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
