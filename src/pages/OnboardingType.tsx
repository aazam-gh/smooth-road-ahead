import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Car, Users, Truck } from "lucide-react";

const OnboardingType = () => {
  const navigate = useNavigate();

  const vehicleTypes = [
    {
      id: "personal",
      title: "Personal Vehicle",
      description: "Track maintenance for your personal car",
      icon: Car,
    },
    {
      id: "family",
      title: "Family Fleet",
      description: "Manage multiple family vehicles",
      icon: Users,
    },
    {
      id: "commercial",
      title: "Commercial Fleet",
      description: "Professional fleet management",
      icon: Truck,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Choose Your Setup
          </h1>
          <p className="text-muted-foreground">
            Select how you'll be using CareCast
          </p>
        </div>

        <div className="space-y-4 animate-slide-up">
          {vehicleTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className="p-6 cursor-pointer transition-all hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => navigate("/onboarding/details")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-card-foreground">
                      {type.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          variant="ghost"
          className="w-full mt-8"
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default OnboardingType;
