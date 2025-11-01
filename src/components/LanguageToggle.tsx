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
      className="gap-2"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {currentLang === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  );
};
