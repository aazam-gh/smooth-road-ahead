import { Home, User, MessageSquare, Car } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const BottomNav = () => {
  const location = useLocation();
  const { t } = useI18n();
  
  const tabs = [
    { path: "/dashboard", icon: Home, label: t('nav.home') },
    { path: "/chat", icon: MessageSquare, label: t('nav.chat') },
    { path: "/vehicle-profile", icon: Car, label: t('nav.vehicle') },
    { path: "/account", icon: User, label: t('nav.profile') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
