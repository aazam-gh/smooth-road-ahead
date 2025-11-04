import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Car,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Wrench,
  Droplets,
  Battery,
  Edit,
  MapPin,
  Bell,
  Settings,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { LanguageCode, VehicleProfile as VehicleProfileType } from "../../types";

interface VehicleProfileProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const VehicleProfile = ({ onLanguageChange, currentLang }: VehicleProfileProps) => {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  
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

  const vehicle = {
    make: t('vehicle.make.toyota'),
    model: t('vehicle.model.camry'),
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
      dueIn: `2 ${t('time.months')}`,
      status: "upcoming",
      icon: Battery,
      progress: 70,
    },
  ];

  const recentServices = [
    { title: t('service.brake_inspection'), date: `2 ${t('time.weeks_ago')}`, cost: "$89" },
    { title: t('service.air_filter'), date: `1 ${t('time.month_ago')}`, cost: "$35" },
    { title: t('service.oil_change'), date: `2 ${t('time.months_ago')}`, cost: "$55" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8B1538] rounded-lg flex items-center justify-center flex-shrink-0">
                <Car className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-[#8B1538] text-sm sm:text-lg md:text-xl truncate">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h2>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Vehicle Health Section */}
        <Card className="p-6 bg-gradient-to-br from-[#8B1538] to-[#6568F4] text-white border-0 mb-6">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold">{vehicle.health}%</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm text-white/80 mb-3">{t('dashboard.vehicle_health')}</p>
            <Progress value={vehicle.health} className="h-2 bg-white/20" />

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-white/80">{t('vehicle.current_mileage')}</span>
              <span className="font-semibold">{vehicle.mileage.toLocaleString()} mi</span>
            </div>
          </div>
        </Card>

        <div className="max-w-md mx-auto">
        {!showForm ? (
          <>
            {/* Upcoming Maintenance */}
            <Card className="p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
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
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-600">
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
            <Card className="p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{t('dashboard.recent_service')}</h2>
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>

              <div className="space-y-3">
                {recentServices.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">{service.title}</p>
                      <p className="text-sm text-gray-600">{service.date}</p>
                    </div>
                    <span className="font-semibold">{service.cost}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4" variant="outline">
                {t('dashboard.view_all')}
              </Button>
            </Card>

            {/* Edit Profile Button */}
            <Button 
              className="w-full bg-[#8B1538] hover:bg-[#6568F4]" 
              onClick={() => setShowForm(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {t('vehicle.edit_profile')}
            </Button>
          </>
        ) : (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{t('vehicle.edit_profile')}</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowForm(false)}
              >
                {t('common.cancel')}
              </Button>
            </div>
            
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
        )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default VehicleProfile;