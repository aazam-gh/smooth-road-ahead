import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { LanguageCode } from "../../types";

interface LanguageToggleProps {
  currentLang: LanguageCode;
  onToggle: (lang: LanguageCode) => void;
}

export const LanguageToggle = ({ currentLang, onToggle }: LanguageToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToggle(currentLang === 'en' ? 'ar' : 'en')}
      className="gap-1 sm:gap-2 p-2"
      aria-label={`Switch to ${currentLang === 'en' ? 'Arabic' : 'English'}`}
    >
      <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
      <span className="text-xs sm:text-sm font-medium hidden sm:inline">
        {currentLang === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  );
};
