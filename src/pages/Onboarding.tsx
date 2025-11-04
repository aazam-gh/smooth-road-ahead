import { useState } from "react";
import { ImageCarousel } from "../components/ImageCarousel";
import { SignupForm } from "../components/SignupForm";
import { LanguageToggle } from "../components/LanguageToggle";
import { MapPin } from "lucide-react";
import { LanguageCode } from "../../types";

interface OnboardingProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

export default function Onboarding({ onLanguageChange, currentLang }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);

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

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Panel - Visual Storytelling */}
        <div className="hidden lg:flex lg:w-1/2">
          <ImageCarousel currentStep={currentStep} />
        </div>

        {/* Right Panel - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white">
          <div className="w-full max-w-xl">
            <SignupForm onStepChange={setCurrentStep} />
          </div>
        </div>
      </div>
    </div>
  );
}
