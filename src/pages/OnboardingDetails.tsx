import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { LanguageCode } from "../../types";

interface OnboardingDetailsProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const OnboardingDetails = ({ onLanguageChange, currentLang }: OnboardingDetailsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.year || !formData.mileage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Vehicle Added!",
      description: "Your vehicle has been successfully registered",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-end mb-4">
          <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
        </div>

        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('onboarding.vehicle_details')}
          </h1>
          <p className="text-muted-foreground">
            {t('onboarding.basic_info')}
          </p>
        </div>

        <Card className="p-6 shadow-card animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="make">{t('onboarding.make')}</Label>
              <Input
                id="make"
                placeholder={t('onboarding.make_ph')}
                value={formData.make}
                onChange={(e) =>
                  setFormData({ ...formData, make: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">{t('onboarding.model')}</Label>
              <Input
                id="model"
                placeholder={t('onboarding.model_ph')}
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">{t('onboarding.year')}</Label>
              <Input
                id="year"
                type="number"
                placeholder={t('onboarding.year_ph')}
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">{t('onboarding.mileage')}</Label>
              <Input
                id="mileage"
                type="number"
                placeholder={t('onboarding.mileage_ph')}
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({ ...formData, mileage: e.target.value })
                }
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button type="submit" className="w-full" size="lg">
                {t('onboarding.continue')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/onboarding/type")}
              >
                {t('onboarding.back')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingDetails;
