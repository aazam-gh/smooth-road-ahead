import { LanguageCode } from "../../types";

interface VehicleProfileProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

const VehicleProfile = ({ onLanguageChange, currentLang }: VehicleProfileProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-4">
        <h1>Vehicle Profile</h1>
        <p>Vehicle profile page coming soon...</p>
      </div>
    </div>
  );
};

export default VehicleProfile;