import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ArrowRight, ArrowLeft, Check, Briefcase, MapPin, Utensils, Calendar, Coffee, Dumbbell, Music, ShoppingBag, Camera, Palmtree } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  workAddress: string;
  foodPreferences: string[];
  activityPreferences: string[];
}

const TOTAL_STEPS = 5;

const foodOptions = [
  { id: 'arabic', label: 'Arabic Cuisine', icon: Utensils },
  { id: 'international', label: 'International', icon: Coffee },
  { id: 'asian', label: 'Asian Fusion', icon: Utensils },
  { id: 'italian', label: 'Italian', icon: Utensils },
  { id: 'mediterranean', label: 'Mediterranean', icon: Utensils },
  { id: 'fastfood', label: 'Fast Food', icon: Utensils },
  { id: 'vegetarian', label: 'Vegetarian', icon: Utensils },
  { id: 'seafood', label: 'Seafood', icon: Utensils }
];

const activityOptions = [
  { id: 'sports', label: 'Sports & Fitness', icon: Dumbbell },
  { id: 'cultural', label: 'Cultural Events', icon: Music },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'entertainment', label: 'Entertainment', icon: Calendar },
  { id: 'outdoor', label: 'Outdoor Activities', icon: Palmtree },
  { id: 'dining', label: 'Fine Dining', icon: Utensils },
  { id: 'art', label: 'Art & Museums', icon: Camera },
  { id: 'nightlife', label: 'Nightlife', icon: Music }
];

interface SignupFormProps {
  onStepChange?: (step: number) => void;
}

export function SignupForm({ onStepChange }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    workAddress: '',
    foodPreferences: [],
    activityPreferences: []
  });

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const togglePreference = (field: 'foodPreferences' | 'activityPreferences', value: string) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      const nextStep = step + 1;
      setStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(formData));
    console.log('Form submitted:', formData);
    navigate("/dashboard");

  };

  const handleSocialSignIn = (provider: string) => {
    console.log(`Sign in with ${provider}`);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim() !== '' && formData.email.trim() !== '';
      case 2:
        return formData.phone.trim() !== '';
      case 3:
        return formData.jobTitle.trim() !== '' && formData.workAddress.trim() !== '';
      case 4:
        return formData.foodPreferences.length > 0;
      case 5:
        return formData.activityPreferences.length > 0;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Welcome! Let\'s get started';
      case 2:
        return 'Your contact information';
      case 3:
        return 'Tell us about your work';
      case 4:
        return 'What do you like to eat?';
      case 5:
        return 'What are your interests?';
      default:
        return '';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1:
        return 'Create your account to receive personalized recommendations';
      case 2:
        return 'How can we reach you?';
      case 3:
        return 'Help us recommend places near your workplace';
      case 4:
        return 'Select your dining preferences';
      case 5:
        return 'Choose activities and events you enjoy';
      default:
        return '';
    }
  };

  const navigate = useNavigate();

  return (
    <div className="w-full max-w-xl">
      {/* Logo/Brand */}
      <div className="mb-12">
        <div className="w-12 h-12 bg-[#8B1538] rounded-lg mb-4 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-[#8B1538]">QIC</h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="mb-1">{getStepTitle()}</h3>
            <p className="text-gray-600 text-sm">{getStepSubtitle()}</p>
          </div>
          <span className="text-sm text-gray-500">
            {step}/{TOTAL_STEPS}
          </span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                index < step ? 'bg-[#8B1538]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  className="mt-2"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="mt-2"
                />
              </div>

              <div className="pt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">Or sign up with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialSignIn('google')}
                    className="border-gray-300"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialSignIn('apple')}
                    className="border-gray-300"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Apple
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+974 XXXX XXXX"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  className="mt-2"
                  autoFocus
                />
                <p className="text-sm text-gray-500 mt-2">
                  We'll send you updates about events and recommendations
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <div className="relative mt-2">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="jobTitle"
                    type="text"
                    placeholder="e.g. Marketing Manager"
                    value={formData.jobTitle}
                    onChange={handleInputChange('jobTitle')}
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="workAddress">Work Address</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="workAddress"
                    type="text"
                    placeholder="e.g. West Bay, Doha"
                    value={formData.workAddress}
                    onChange={handleInputChange('workAddress')}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  We'll recommend places near your workplace
                </p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-600">
                Select all that apply (choose at least one)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {foodOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.foodPreferences.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => togglePreference('foodPreferences', option.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-[#8B1538] bg-[#8B1538]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                        isSelected ? 'bg-[#8B1538] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm flex-1 text-left">{option.label}</span>
                      {isSelected && (
                        <Check className="h-5 w-5 text-[#8B1538]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-600">
                Select all that apply (choose at least one)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {activityOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.activityPreferences.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => togglePreference('activityPreferences', option.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-[#8B1538] bg-[#8B1538]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                        isSelected ? 'bg-[#8B1538] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm flex-1 text-left">{option.label}</span>
                      {isSelected && (
                        <Check className="h-5 w-5 text-[#8B1538]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 border-gray-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex-1 bg-[#8B1538] hover:bg-[#6D1028] ${step === 1 ? 'w-full' : ''}`}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isStepValid()}
              className="flex-1 bg-[#8B1538] hover:bg-[#6D1028]"
            >
              <Check className="mr-2 h-4 w-4" />
              Complete Setup
            </Button>
          )}
        </div>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account?{' '}
        <a href="#" className="text-[#8B1538] hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
