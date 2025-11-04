import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockDiscoverData } from "@/lib/discoverData";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const DailyActionCard: React.FC = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [done, setDone] = useState<boolean>(false);

  const todayItem = useMemo(() => {
    if (!mockDiscoverData || mockDiscoverData.length === 0) return null;
    const dayNum = Math.floor(Date.now() / MS_PER_DAY);
    const idx = dayNum % mockDiscoverData.length;
    return mockDiscoverData[idx];
  }, []);

  if (!todayItem) return null;

  // Initialize `done` by checking stored value equals today's item id.
  React.useEffect(() => {
    try {
      const key = `dailyActionDone_${new Date().toISOString().slice(0,10)}`;
      const val = localStorage.getItem(key);
      if (val && todayItem && val === todayItem.id) {
        setDone(true);
      } else {
        setDone(false);
      }
    } catch {
      setDone(false);
    }
  }, [todayItem]);

  const markDone = () => {
    try {
      const key = `dailyActionDone_${new Date().toISOString().slice(0,10)}`;
      localStorage.setItem(key, todayItem.id);
      setDone(true);
      toast({ title: t("daily.action_done") || "Marked done", description: todayItem.title });
    } catch {
      toast({ title: t("daily.error") || "Error", description: t("daily.save_failed") || "Could not save" });
    }
  };

  const remind = () => {
    try {
      const raw = localStorage.getItem("dailyReminders") || "[]";
      const arr = JSON.parse(raw);
      arr.push({ id: todayItem.id, date: new Date().toISOString() });
      localStorage.setItem("dailyReminders", JSON.stringify(arr));
      toast({ title: t("daily.reminder_set") || "Reminder set", description: todayItem.title });
    } catch {
      toast({ title: t("daily.error") || "Error", description: t("daily.save_failed") || "Could not save" });
    }
  };

  // Dev-only reset control (visible when URL contains ?dev or during Vite dev)
  const isDev = typeof window !== 'undefined' && (window.location.search.includes('dev') || (import.meta as any).env?.DEV);
  const resetToday = () => {
    try {
      const key = `dailyActionDone_${new Date().toISOString().slice(0,10)}`;
      localStorage.removeItem(key);
      // Also remove any reminder entries for today
      try {
        const raw = localStorage.getItem('dailyReminders') || '[]';
        const arr = JSON.parse(raw).filter((r: any) => r.date.slice(0,10) !== new Date().toISOString().slice(0,10));
        localStorage.setItem('dailyReminders', JSON.stringify(arr));
      } catch {}
      setDone(false);
      toast({ title: "Reset", description: "Today's action reset (dev)" });
    } catch {}
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{t("daily.title") || "Today's Action"}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{t("daily.subtitle") || "A short tip or offer selected for today."}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="font-semibold">{todayItem.title}</div>
          <div className="text-sm text-muted-foreground">{todayItem.description}</div>
          <div className="flex items-center gap-2 mt-3">
            <Button size="sm" onClick={markDone} disabled={done}>{done ? (t("daily.done") || "Done") : (t("daily.mark_done") || "Mark done")}</Button>
            <Button size="sm" variant="outline" onClick={remind}>{t("daily.remind") || "Remind me"}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyActionCard;
