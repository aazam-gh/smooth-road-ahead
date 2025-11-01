import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Bell, HelpCircle, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Account = () => {
  const menuItems = [
    { icon: User, title: "Profile Settings", description: "Edit your personal information" },
    { icon: Settings, title: "App Settings", description: "Customize your experience" },
    { icon: Bell, title: "Notifications", description: "Manage alerts and reminders" },
    { icon: HelpCircle, title: "Help & Support", description: "Get assistance" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">Account</h1>
          <p className="text-sm opacity-90">Manage your profile and settings</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4">
        <Card className="p-6 shadow-elevated bg-card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
          </div>
          <Button className="w-full" variant="outline">
            Edit Profile
          </Button>
        </Card>

        <Card className="p-4 shadow-card mb-6">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-card-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Account;
