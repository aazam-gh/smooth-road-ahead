import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { LanguageCode } from "../types";
import Welcome from "./pages/Welcome";
import OnboardingType from "./pages/OnboardingType";
import OnboardingDetails from "./pages/OnboardingDetails";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import DiscoverFeed from "./pages/DiscoverFeed";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ar' || saved === 'en' ? saved : 'en') as LanguageCode;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider lang={language}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Welcome onLanguageChange={setLanguage} currentLang={language} />} />
              <Route path="/onboarding/type" element={<OnboardingType onLanguageChange={setLanguage} currentLang={language} />} />
              <Route path="/onboarding/details" element={<OnboardingDetails onLanguageChange={setLanguage} currentLang={language} />} />
              <Route path="/dashboard" element={<Dashboard onLanguageChange={setLanguage} currentLang={language} />} />
              <Route path="/chat" element={<Chat onLanguageChange={setLanguage} currentLang={language} />} />
              <Route
                path="/discover"
                element={
                  <ErrorBoundary>
                    <DiscoverFeed onLanguageChange={setLanguage} currentLang={language} />
                  </ErrorBoundary>
                }
              />
              <Route path="/account" element={<Account onLanguageChange={setLanguage} currentLang={language} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};

export default App;
