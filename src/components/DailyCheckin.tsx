import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getStreak, hasCheckedInToday, recordCheckin } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const DailyCheckin: React.FC = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [streak, setStreak] = useState<number>(0);
  const [checkedToday, setCheckedToday] = useState<boolean>(false);

  useEffect(() => {
    setStreak(getStreak());
    setCheckedToday(hasCheckedInToday());
  }, []);

  const onCheckin = () => {
    if (hasCheckedInToday()) {
      toast({ title: t("checkin.already" ) || "Already checked in", description: t("checkin.keep_it_up") || "Keep it up!" });
      setCheckedToday(true);
      return;
    }

    const newStreak = recordCheckin();
    setStreak(newStreak);
    setCheckedToday(true);
    toast({ title: t("checkin.thanks") || "Checked in!", description: `${t("checkin.streak") || "Current streak"}: ${newStreak}` });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4>{t("checkin.title") || "Daily Check-in"}</h4>
        <Badge variant="secondary" className="bg-[#8B1538]/10 text-[#8B1538] border-0">
          {streak} {t("checkin.days") || "days"}
        </Badge>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{t("checkin.subtitle") || "Tap to check-in and keep your streak going."}</p>
        <Button 
          onClick={onCheckin} 
          size="sm" 
          disabled={checkedToday}
          className={checkedToday ? "w-full" : "w-full bg-[#8B1538] hover:bg-[#6D1028]"}
        >
          {checkedToday ? (t("checkin.checked") || "✓ Checked In") : (t("checkin.check_in") || "Check In")}
        </Button>
        {streak > 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-[#8B1538]">{streak}</div>
            <div className="text-xs text-gray-500">{t("checkin.days") || "day"} streak</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-[#8B1538] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {streak < 30 ? `${30 - streak} ${t("checkin.days_to_milestone") || "days to milestone"}` : (t("checkin.milestone_reached") || "🎉 Milestone reached!")}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DailyCheckin;
