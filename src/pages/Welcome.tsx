import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Shield, Bell } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent flex flex-col items-center justify-between p-6 text-primary-foreground">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
        </div>
      </div>

      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center animate-fade-in">
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 shadow-elevated">
            <Car className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center">{t('welcome.title')}</h1>
        <p className="text-lg text-center text-primary-foreground/90 mb-12 max-w-sm">
          {t('welcome.subtitle')}
        </p>

        <div className="space-y-4 w-full mb-12">
          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-card">
            <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t('welcome.feature1.title')}</h3>
              <p className="text-sm text-primary-foreground/80">
                {t('welcome.feature1.desc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-card">
            <Bell className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">{t('welcome.feature2.title')}</h3>
              <p className="text-sm text-primary-foreground/80">
                {t('welcome.feature2.desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        <Button
          onClick={() => navigate("/onboarding/type")}
          size="lg"
          className="w-full bg-white text-primary hover:bg-white/90 shadow-elevated"
        >
          {t('welcome.get_started')}
        </Button>
        <Button
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          size="lg"
          className="w-full text-primary-foreground hover:bg-white/10"
        >
          {t('welcome.have_account')}
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
