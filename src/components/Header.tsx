import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import ProfileModal from "./ProfileModal";
import { LanguageCode } from "../../types";

interface HeaderProps {
  title: string;
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
  showProfileButton?: boolean;
}

const Header = ({ 
  title, 
  onLanguageChange, 
  currentLang, 
  showProfileButton = true 
}: HeaderProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex items-center gap-2">
              <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
              {showProfileButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleProfileClick}
                  className="gap-2 hover:bg-white/20 transition-colors"
                  aria-label="Open profile"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleProfileModalClose}
        onLanguageChange={onLanguageChange}
        currentLang={currentLang}
      />
    </>
  );
};

export default Header;