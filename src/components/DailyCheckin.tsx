import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("checkin.title") || "Daily Check-in"}</span>
          <Badge variant="secondary">{streak} {t("checkin.days") || "days"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("checkin.subtitle") || "Tap to check-in and keep your streak going."}</p>
          </div>
          <div>
            <Button onClick={onCheckin} size="sm" disabled={checkedToday}>
              {checkedToday ? (t("checkin.checked") || "Checked") : (t("checkin.check_in") || "Check in")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyCheckin;
