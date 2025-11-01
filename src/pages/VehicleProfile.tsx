import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, AlertCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { LanguageCode, VehicleProfile as VehicleProfileType } from "../../types";

interface VehicleProfileProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const VehicleProfile = ({ onLanguageChange, currentLang }: VehicleProfileProps) => {
  const { t } = useI18n();
  
  const [formData, setFormData] = useState<VehicleProfileType>({
    vin: "",
    odometer: "",
    lastServiceDate: "",
    lastOilChangeDate: "",
    lastOilChangeMileage: "",
    lastAirFilterChangeMiles: "",
    tireAgeMonths: "",
    batteryAgeMonths: "",
    insuranceExpiryDate: "",
    zipCode: "",
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // VIN validation function
  const validateVIN = (vin: string): boolean => {
    // VIN should be exactly 17 characters, alphanumeric (excluding I, O, Q)
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinRegex.test(vin.toUpperCase());
  };

  // Numeric validation function
  const validateNumeric = (value: string): boolean => {
    return value === '' || (!isNaN(Number(value)) && Number(value) >= 0);
  };

  const handleInputChange = (field: keyof VehicleProfileType, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Real-time validation
    if (field === 'vin' && typeof value === 'string') {
      if (value.length > 0 && !validateVIN(value)) {
        setValidationErrors(prev => ({
          ...prev,
          vin: t('vehicle.validation.vin_invalid')
        }));
      }
    }

    // Numeric field validation
    if (['odometer', 'lastOilChangeMileage', 'lastAirFilterChangeMiles', 'tireAgeMonths', 'batteryAgeMonths'].includes(field) && typeof value === 'string') {
      if (value.length > 0 && !validateNumeric(value)) {
        setValidationErrors(prev => ({
          ...prev,
          [field]: t('vehicle.validation.number_invalid')
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {t('vehicle.title')}
                </h1>
                <p className="text-sm opacity-90">
                  {t('vehicle.subtitle')}
                </p>
              </div>
            </div>
            <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4">
        <Card className="p-6 shadow-card animate-slide-up">
          <div className="space-y-6">
            {/* VIN - Full width */}
            <div className="space-y-2">
              <Label htmlFor="vin">{t('vehicle.vin')}</Label>
              <Input
                id="vin"
                placeholder={t('vehicle.vin_placeholder')}
                value={formData.vin}
                onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                maxLength={17}
                className={validationErrors.vin ? 'border-red-500' : ''}
              />
              {validationErrors.vin && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.vin}
                </div>
              )}
            </div>

            {/* Two-column grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Odometer */}
              <div className="space-y-2">
                <Label htmlFor="odometer">{t('vehicle.odometer')}</Label>
                <Input
                  id="odometer"
                  type="number"
                  placeholder={t('vehicle.number_placeholder')}
                  min="0"
                  value={formData.odometer}
                  onChange={(e) => handleInputChange('odometer', e.target.value ? Number(e.target.value) : '')}
                  className={validationErrors.odometer ? 'border-red-500' : ''}
                />
                {validationErrors.odometer && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.odometer}
                  </div>
                )}
              </div>

              {/* Last Service Date */}
              <div className="space-y-2">
                <Label htmlFor="lastServiceDate">{t('vehicle.lastServiceDate')}</Label>
                <Input
                  id="lastServiceDate"
                  type="date"
                  value={formData.lastServiceDate}
                  onChange={(e) => handleInputChange('lastServiceDate', e.target.value)}
                />
              </div>

              {/* Last Oil Change Date */}
              <div className="space-y-2">
                <Label htmlFor="lastOilChangeDate">{t('vehicle.lastOilChangeDate')}</Label>
                <Input
                  id="lastOilChangeDate"
                  type="date"
                  value={formData.lastOilChangeDate}
                  onChange={(e) => handleInputChange('lastOilChangeDate', e.target.value)}
                />
              </div>

              {/* Last Oil Change Mileage */}
              <div className="space-y-2">
                <Label htmlFor="lastOilChangeMileage">{t('vehicle.lastOilChangeMileage')}</Label>
                <Input
                  id="lastOilChangeMileage"
                  type="number"
                  placeholder={t('vehicle.number_placeholder')}
                  min="0"
                  value={formData.lastOilChangeMileage}
                  onChange={(e) => handleInputChange('lastOilChangeMileage', e.target.value ? Number(e.target.value) : '')}
                  className={validationErrors.lastOilChangeMileage ? 'border-red-500' : ''}
                />
                {validationErrors.lastOilChangeMileage && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.lastOilChangeMileage}
                  </div>
                )}
              </div>

              {/* Last Air Filter Change */}
              <div className="space-y-2">
                <Label htmlFor="lastAirFilterChangeMiles">{t('vehicle.lastAirFilterChangeMiles')}</Label>
                <Input
                  id="lastAirFilterChangeMiles"
                  type="number"
                  placeholder={t('vehicle.number_placeholder')}
                  min="0"
                  value={formData.lastAirFilterChangeMiles}
                  onChange={(e) => handleInputChange('lastAirFilterChangeMiles', e.target.value ? Number(e.target.value) : '')}
                  className={validationErrors.lastAirFilterChangeMiles ? 'border-red-500' : ''}
                />
                {validationErrors.lastAirFilterChangeMiles && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.lastAirFilterChangeMiles}
                  </div>
                )}
              </div>

              {/* Tire Age */}
              <div className="space-y-2">
                <Label htmlFor="tireAgeMonths">{t('vehicle.tireAgeMonths')}</Label>
                <Input
                  id="tireAgeMonths"
                  type="number"
                  placeholder={t('vehicle.number_placeholder')}
                  min="0"
                  value={formData.tireAgeMonths}
                  onChange={(e) => handleInputChange('tireAgeMonths', e.target.value ? Number(e.target.value) : '')}
                  className={validationErrors.tireAgeMonths ? 'border-red-500' : ''}
                />
                {validationErrors.tireAgeMonths && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.tireAgeMonths}
                  </div>
                )}
              </div>

              {/* Battery Age */}
              <div className="space-y-2">
                <Label htmlFor="batteryAgeMonths">{t('vehicle.batteryAgeMonths')}</Label>
                <Input
                  id="batteryAgeMonths"
                  type="number"
                  placeholder={t('vehicle.number_placeholder')}
                  min="0"
                  value={formData.batteryAgeMonths}
                  onChange={(e) => handleInputChange('batteryAgeMonths', e.target.value ? Number(e.target.value) : '')}
                  className={validationErrors.batteryAgeMonths ? 'border-red-500' : ''}
                />
                {validationErrors.batteryAgeMonths && (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.batteryAgeMonths}
                  </div>
                )}
              </div>

              {/* Insurance Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="insuranceExpiryDate">{t('vehicle.insuranceExpiryDate')}</Label>
                <Input
                  id="insuranceExpiryDate"
                  type="date"
                  value={formData.insuranceExpiryDate}
                  onChange={(e) => handleInputChange('insuranceExpiryDate', e.target.value)}
                />
              </div>
            </div>

            {/* Zip Code - Full width */}
            <div className="space-y-2">
              <Label htmlFor="zipCode">{t('vehicle.zipCode')}</Label>
              <Input
                id="zipCode"
                placeholder={t('vehicle.zipcode_placeholder')}
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default VehicleProfile;