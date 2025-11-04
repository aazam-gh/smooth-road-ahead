import { useState } from "react";
import { ImageCarousel } from "../components/ImageCarousel";
import { SignupForm } from "../components/SignupForm";
import { LanguageCode } from "../../types";

interface OnboardingProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

export default function Onboarding({ onLanguageChange, currentLang }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="flex min-h-screen">
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
  );
}
