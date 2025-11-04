import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Bell,
  Settings,
  Heart,
  Home,
  Shield,
  CreditCard,
  Stethoscope,
  Activity,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { LanguageCode, VehicleProfile as VehicleProfileType } from "../../types";

interface HealthInsuranceProfile {
  policyNumber: string;
  provider: string;
  groupNumber: string;
  memberID: string;
  planType: string;
  deductible: string;
  copay: string;
  expiryDate: string;
  emergencyContact: string;
  primaryCarePhysician: string;
}

interface HomeInsuranceProfile {
  policyNumber: string;
  provider: string;
  propertyAddress: string;
  coverageAmount: string;
  deductible: string;
  expiryDate: string;
  agentName: string;
  agentPhone: string;
}



interface VehicleProfileProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const VehicleProfile = ({ onLanguageChange, currentLang }: VehicleProfileProps) => {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicle");
  
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

  const [healthInsurance, setHealthInsurance] = useState<HealthInsuranceProfile>({
    policyNumber: "",
    provider: "",
    groupNumber: "",
    memberID: "",
    planType: "",
    deductible: "",
    copay: "",
    expiryDate: "",
    emergencyContact: "",
    primaryCarePhysician: "",
  });

  const [homeInsurance, setHomeInsurance] = useState<HomeInsuranceProfile>({
    policyNumber: "",
    provider: "",
    propertyAddress: "",
    coverageAmount: "",
    deductible: "",
    expiryDate: "",
    agentName: "",
    agentPhone: "",
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

  const handleHealthInsuranceChange = (field: keyof HealthInsuranceProfile, value: string) => {
    setHealthInsurance(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHomeInsuranceChange = (field: keyof HomeInsuranceProfile, value: string) => {
    setHomeInsurance(prev => ({
      ...prev,
      [field]: value
    }));
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#6568F4] rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-[#6568F4] text-sm sm:text-lg md:text-xl truncate">Insurance & Profiles</h2>
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
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="vehicle" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.vehicle')}</span>
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">{t('health.title')}</span>
              </TabsTrigger>
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{t('home.title')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vehicle">
              {/* Vehicle Health Section */}
              <Card className="p-6 bg-gradient-to-br from-[#6568F4] to-[#6568F4] text-white border-0 mb-6">
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
              className="w-full bg-[#6568F4] hover:bg-[#6568F4]" 
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
            </TabsContent>

            <TabsContent value="health">
              {/* Health Coverage Section */}
              <Card className="p-6 bg-gradient-to-br from-[#6568F4] to-[#6568F4] text-white border-0 mb-6">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold">92%</span>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-white/80 mb-3">{t('health.coverage_status')}</p>
                  <Progress value={92} className="h-2 bg-white/20" />

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-white/80">{t('health.annual_deductible_met')}</span>
                    <span className="font-semibold">$850 / $1,500</span>
                  </div>
                </div>
              </Card>

              <div className="max-w-md mx-auto">
                {!showForm ? (
                  <>
                    {/* Upcoming Health Items */}
                    <Card className="p-5 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                          {t('health.upcoming_health_items')}
                        </h2>
                        <Badge variant="secondary" className="gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          2
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-warning/10">
                                <Stethoscope className="w-5 h-5 text-warning" />
                              </div>
                              <div>
                                <p className="font-medium">{t('health.annual_physical')}</p>
                                <p className="text-sm text-gray-600">
                                  {t('health.due_in_weeks')}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Progress value={75} className="h-1.5" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-success/10">
                                <Activity className="w-5 h-5 text-success" />
                              </div>
                              <div>
                                <p className="font-medium">{t('health.dental_cleaning')}</p>
                                <p className="text-sm text-gray-600">
                                  {t('health.due_in_months')}
                                </p>
                              </div>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          </div>
                          <Progress value={40} className="h-1.5" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-warning/10">
                                <Heart className="w-5 h-5 text-warning" />
                              </div>
                              <div>
                                <p className="font-medium">{t('health.eye_exam')}</p>
                                <p className="text-sm text-gray-600">
                                  {t('health.due_in_month')}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Progress value={60} className="h-1.5" />
                        </div>
                      </div>

                      <Button className="w-full mt-4" variant="outline">
                        {t('health.view_all_appointments')}
                      </Button>
                    </Card>

                    {/* Recent Health Services */}
                    <Card className="p-5 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">{t('health.recent_health_services')}</h2>
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium">{t('health.blood_work')}</p>
                            <p className="text-sm text-gray-600">{t('health.weeks_ago')}</p>
                          </div>
                          <span className="font-semibold">$45</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium">{t('health.prescription_refill')}</p>
                            <p className="text-sm text-gray-600">{t('health.month_ago')}</p>
                          </div>
                          <span className="font-semibold">$25</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium">{t('health.specialist_visit')}</p>
                            <p className="text-sm text-gray-600">{t('health.months_ago')}</p>
                          </div>
                          <span className="font-semibold">$150</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4" variant="outline">
                        {t('health.view_all_services')}
                      </Button>
                    </Card>

                    {/* Edit Profile Button */}
                    <Button 
                      className="w-full bg-[#6568F4] hover:bg-[#6568F4]" 
                      onClick={() => setShowForm(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('health.edit_health_profile')}
                    </Button>
                  </>
                ) : (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">{t('health.edit_health_profile')}</h2>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowForm(false)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Policy Number - Full width */}
                      <div className="space-y-2">
                        <Label htmlFor="healthPolicyNumber">{t('health.policy_number')}</Label>
                        <Input
                          id="healthPolicyNumber"
                          placeholder={t('health.policy_placeholder')}
                          value={healthInsurance.policyNumber}
                          onChange={(e) => handleHealthInsuranceChange('policyNumber', e.target.value)}
                        />
                      </div>

                      {/* Two-column grid layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="healthProvider">{t('health.insurance_provider')}</Label>
                          <Input
                            id="healthProvider"
                            placeholder={t('health.provider_placeholder')}
                            value={healthInsurance.provider}
                            onChange={(e) => handleHealthInsuranceChange('provider', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="groupNumber">{t('health.group_number')}</Label>
                          <Input
                            id="groupNumber"
                            placeholder={t('health.group_placeholder')}
                            value={healthInsurance.groupNumber}
                            onChange={(e) => handleHealthInsuranceChange('groupNumber', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="memberID">{t('health.member_id')}</Label>
                          <Input
                            id="memberID"
                            placeholder={t('health.member_placeholder')}
                            value={healthInsurance.memberID}
                            onChange={(e) => handleHealthInsuranceChange('memberID', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="planType">{t('health.plan_type')}</Label>
                          <Input
                            id="planType"
                            placeholder={t('health.plan_placeholder')}
                            value={healthInsurance.planType}
                            onChange={(e) => handleHealthInsuranceChange('planType', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deductible">{t('health.deductible')}</Label>
                          <Input
                            id="deductible"
                            placeholder={t('health.deductible_placeholder')}
                            value={healthInsurance.deductible}
                            onChange={(e) => handleHealthInsuranceChange('deductible', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="copay">{t('health.copay')}</Label>
                          <Input
                            id="copay"
                            placeholder={t('health.copay_placeholder')}
                            value={healthInsurance.copay}
                            onChange={(e) => handleHealthInsuranceChange('copay', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="healthExpiryDate">{t('health.expiry_date')}</Label>
                          <Input
                            id="healthExpiryDate"
                            type="date"
                            value={healthInsurance.expiryDate}
                            onChange={(e) => handleHealthInsuranceChange('expiryDate', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact">{t('health.emergency_contact')}</Label>
                          <Input
                            id="emergencyContact"
                            placeholder={t('health.emergency_placeholder')}
                            value={healthInsurance.emergencyContact}
                            onChange={(e) => handleHealthInsuranceChange('emergencyContact', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Primary Care Physician - Full width */}
                      <div className="space-y-2">
                        <Label htmlFor="primaryCarePhysician">{t('health.primary_care_physician')}</Label>
                        <Input
                          id="primaryCarePhysician"
                          placeholder={t('health.physician_placeholder')}
                          value={healthInsurance.primaryCarePhysician}
                          onChange={(e) => handleHealthInsuranceChange('primaryCarePhysician', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="home">
              <Card className="p-6 bg-gradient-to-br from-[#6568F4] to-[#6568F4] text-white border-0 mb-6">
                <div className="max-w-md mx-auto text-center">
                  <Home className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">{t('home.title')}</h3>
                  <p className="text-sm text-white/80">{t('home.subtitle')}</p>
                </div>
              </Card>

              <div className="max-w-2xl mx-auto">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">{t('home.home_insurance_profile')}</h2>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      {t('home.edit')}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="homePolicyNumber">{t('home.policy_number')}</Label>
                      <Input
                        id="homePolicyNumber"
                        placeholder={t('home.policy_placeholder')}
                        value={homeInsurance.policyNumber}
                        onChange={(e) => handleHomeInsuranceChange('policyNumber', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="homeProvider">{t('home.insurance_provider')}</Label>
                      <Input
                        id="homeProvider"
                        placeholder={t('home.provider_placeholder')}
                        value={homeInsurance.provider}
                        onChange={(e) => handleHomeInsuranceChange('provider', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="propertyAddress">{t('home.property_address')}</Label>
                      <Input
                        id="propertyAddress"
                        placeholder={t('home.address_placeholder')}
                        value={homeInsurance.propertyAddress}
                        onChange={(e) => handleHomeInsuranceChange('propertyAddress', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverageAmount">{t('home.coverage_amount')}</Label>
                      <Input
                        id="coverageAmount"
                        placeholder={t('home.coverage_placeholder')}
                        value={homeInsurance.coverageAmount}
                        onChange={(e) => handleHomeInsuranceChange('coverageAmount', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="homeDeductible">{t('home.deductible')}</Label>
                      <Input
                        id="homeDeductible"
                        placeholder={t('home.deductible_placeholder')}
                        value={homeInsurance.deductible}
                        onChange={(e) => handleHomeInsuranceChange('deductible', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="homeExpiryDate">{t('home.expiry_date')}</Label>
                      <Input
                        id="homeExpiryDate"
                        type="date"
                        value={homeInsurance.expiryDate}
                        onChange={(e) => handleHomeInsuranceChange('expiryDate', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agentName">{t('home.agent_name')}</Label>
                      <Input
                        id="agentName"
                        placeholder={t('home.agent_name_placeholder')}
                        value={homeInsurance.agentName}
                        onChange={(e) => handleHomeInsuranceChange('agentName', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agentPhone">{t('home.agent_phone')}</Label>
                      <Input
                        id="agentPhone"
                        placeholder={t('home.agent_phone_placeholder')}
                        value={homeInsurance.agentPhone}
                        onChange={(e) => handleHomeInsuranceChange('agentPhone', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-[#6568F4] hover:bg-[#6568F4]">
                    <Home className="w-4 h-4 mr-2" />
                    {t('home.save_home_insurance')}
                  </Button>
                </Card>
              </div>
            </TabsContent>


          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default VehicleProfile;