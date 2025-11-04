import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, MapPin, Mic, Bell, Settings, Users, Calendar, Star, Route, Shield, Cloud, Navigation } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { chatService, getMapsGroundedResponse } from "../lib/geminiService";
import { GoogleGenAI, Modality, LiveServerMessage, Blob as GenBlob } from "@google/genai";
import { encode } from "../lib/audio";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LanguageCode } from "../../types";

interface ChatProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

type ChatMessage = {
  sender: "user" | "model";
  content: string;
  groundingChunks?: any[];
  isStreaming?: boolean;
};

const Chat = ({ onLanguageChange, currentLang }: ChatProps) => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || undefined;

  // Voice chat state
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const currentInputTranscriptionRef = useRef("");
  const currentOutputTranscriptionRef = useRef("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Voice Session Handlers ----
  const cleanupVoiceSession = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then((s) => s.close()).catch(console.error);
      sessionPromiseRef.current = null;
    }
    scriptProcessorRef.current?.disconnect();
    mediaStreamSourceRef.current?.disconnect();
    inputAudioContextRef.current?.close().catch(console.error);
    inputAudioContextRef.current = null;
    setVoiceStatus("idle");
  };

  const handleStartVoice = async () => {
    setVoiceStatus("connecting");
    setVoiceError(null);
    setMessages((prev) => [...prev, { sender: "model", content: t('chat.voice_connecting') }]);

    try {
      if (!API_KEY) throw new Error("Missing API key");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        callbacks: {
          onopen: () => {
            setVoiceStatus("connected");
            setMessages((prev) => {
              const copy = [...prev];
              copy[copy.length - 1].content = t('chat.voice_connected');
              return copy;
            });

            mediaStreamSourceRef.current = inputAudioContextRef.current!.createMediaStreamSource(stream);
            scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob: GenBlob = {
                data: encode(new Uint8Array(new Int16Array(inputData.map((x) => x * 32768)).buffer)),
                mimeType: "audio/pcm;rate=16000",
              };
              sessionPromise.then((s) => s.sendRealtimeInput({ media: pcmBlob }));
            };
            mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription)
              currentInputTranscriptionRef.current += msg.serverContent.inputTranscription.text;
            if (msg.serverContent?.outputTranscription)
              currentOutputTranscriptionRef.current += msg.serverContent.outputTranscription.text;
            if (msg.serverContent?.turnComplete) {
              const inputText = currentInputTranscriptionRef.current.trim();
              const outputText = currentOutputTranscriptionRef.current.trim();
              const newMsgs: ChatMessage[] = [];
              if (inputText) newMsgs.push({ sender: "user", content: `${t('chat.voice_prefix')} ${inputText}` });
              if (outputText) newMsgs.push({ sender: "model", content: outputText });
              if (newMsgs.length) setMessages((prev) => [...prev, ...newMsgs]);
              currentInputTranscriptionRef.current = "";
              currentOutputTranscriptionRef.current = "";
            }
          },
          onerror: (e) => {
            console.error("Voice error:", e);
            setVoiceError(t('chat.voice_error'));
            cleanupVoiceSession();
          },
          onclose: () => {
            setMessages((prev) => [...prev, { sender: "model", content: t('chat.voice_ended') }]);
            cleanupVoiceSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });

      sessionPromiseRef.current = sessionPromise;
      await sessionPromise;
    } catch (err) {
      console.error(err);
      setVoiceError(t('chat.voice_unable'));
      setVoiceStatus("error");
    }
  };

  const handleStopVoice = () => cleanupVoiceSession();

  // ---- Text Chat ----
  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg: ChatMessage = { sender: "user", content: message };
    setMessages((prev) => [...prev, userMsg, { sender: "model", content: "", isStreaming: true }]);
    setMessage("");
    setIsLoading(true);

    try {
      const limitedMessage = `${message}\n\nPlease keep your response to a maximum of 500 characters.`;
      const stream = chatService.sendMessageStream(limitedMessage);
      for await (const chunk of stream) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content += chunk;
          return newMsgs;
        });
      }
      // Mark streaming as complete
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].isStreaming = false;
        return newMsgs;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].content = t('chat.trouble_connecting');
        copy[copy.length - 1].isStreaming = false;
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Maps & Booking ----
  const handleFindGarages = () => {
    if (isLoading) return;
    setMessages((prev) => [...prev, { sender: "user", content: t('chat.find_garages_msg') }]);
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await getMapsGroundedResponse(pos.coords.latitude, pos.coords.longitude);
          const textGetter: any = (res as any).text;
          const text = typeof textGetter === "function" ? await textGetter.call(res) : (textGetter ?? "");
          setMessages((prev) => [
            ...prev,
            { sender: "model", content: text, groundingChunks: res.candidates?.[0]?.groundingMetadata?.groundingChunks || [] },
          ]);
        } catch {
          setMessages((prev) => [...prev, { sender: "model", content: t('chat.error_garages') }]);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setMessages((prev) => [...prev, { sender: "model", content: t('chat.unable_location') }]);
        setIsLoading(false);
      }
    );
  };

  const handleBookService = (garage: string) => {
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + 2);
    const time = "10:00 AM";
    const date = bookingDate.toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', { weekday: "short", month: "short", day: "numeric" });
    setMessages((prev) => [
      ...prev,
      { sender: "user", content: `${t('chat.book_at')} ${garage}.` },
      { sender: "model", content: `${t('chat.booking_confirmed')} ${garage} ${t('chat.booking_for')} ${date} ${t('chat.booking_at')} ${time}. ${t('chat.loyalty_added')}` },
    ]);
  };

  // ---- Family Activities Planner ----
  const handleFamilyActivities = async () => {
    if (isLoading) return;
    setMessages((prev) => [...prev, { sender: "user", content: t('chat.family_activities_request') || "Plan family activities for this weekend" }]);
    setIsLoading(true);

    try {
      const familyPrompt = `Plan fun family activities for this weekend. Please provide:

• Activities for different age groups (toddlers, kids, teens, adults)
• Both indoor and outdoor options
• Estimated costs for each activity
• Duration and time requirements
• Any special considerations or requirements

Format your response with clear sections and bullet points for easy reading.

Please keep your response to a maximum of 500 characters.`;
      
      const stream = chatService.sendMessageStream(familyPrompt);
      setMessages((prev) => [...prev, { sender: "model", content: "", isStreaming: true }]);
      
      for await (const chunk of stream) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content += chunk;
          return newMsgs;
        });
      }
      
      // Mark streaming as complete
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].isStreaming = false;
        return newMsgs;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { sender: "model", content: t('chat.trouble_connecting') || "Sorry, I'm having trouble connecting right now.", isStreaming: false };
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Travel Optimization ----
  const handleTravelOptimization = async () => {
    if (isLoading) return;
    setMessages((prev) => [...prev, { sender: "user", content: t('chat.travel_optimization_request') || "Plan an optimized weekend trip" }]);
    setIsLoading(true);

    try {
      const travelPrompt = `Plan an optimized weekend trip. Please provide:

• Destination recommendations based on current season
• Route suggestions with timing considerations
• Weather-aware planning and alternatives
• Traffic optimization tips
• Packing recommendations
• Budget estimates for different trip types
• Safety and preparation checklist

Format your response with clear sections and actionable advice.

Please keep your response to a maximum of 500 characters.`;
      
      const stream = chatService.sendMessageStream(travelPrompt);
      setMessages((prev) => [...prev, { sender: "model", content: "", isStreaming: true }]);
      
      for await (const chunk of stream) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content += chunk;
          return newMsgs;
        });
      }
      
      // Mark streaming as complete
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].isStreaming = false;
        return newMsgs;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { sender: "model", content: t('chat.trouble_connecting') || "Sorry, I'm having trouble connecting right now.", isStreaming: false };
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Insurance Assistant ----
  const handleInsuranceQuery = async () => {
    if (isLoading) return;
    setMessages((prev) => [...prev, { sender: "user", content: t('chat.insurance_query_request') || "Help me with insurance questions" }]);
    setIsLoading(true);

    try {
      const insurancePrompt = `Help me understand vehicle insurance. Please provide information about:

• Types of coverage (liability, comprehensive, collision, etc.)
• How to file and track insurance claims
• Policy renewal process and timing
• Factors that affect insurance rates
• Tips for choosing the right coverage
• Common insurance terms and what they mean
• Steps to take after an accident
• How to save money on premiums

Format your response with clear sections and practical advice.

Please keep your response to a maximum of 500 characters.`;
      
      const stream = chatService.sendMessageStream(insurancePrompt);
      setMessages((prev) => [...prev, { sender: "model", content: "", isStreaming: true }]);
      
      for await (const chunk of stream) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content += chunk;
          return newMsgs;
        });
      }
      
      // Mark streaming as complete
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].isStreaming = false;
        return newMsgs;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { sender: "model", content: t('chat.trouble_connecting') || "Sorry, I'm having trouble connecting right now.", isStreaming: false };
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isVoiceActive = voiceStatus === "connecting" || voiceStatus === "connected";

  // ---- UI ----
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#6568F4] rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h2 className="text-[#6568F4] text-lg sm:text-xl truncate">{t('chat.title')}</h2>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="hidden md:block">
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 pb-32">
          <div className="max-w-md mx-auto">
          {/* Family Activities Feature Card */}
          <Card className="mb-4 bg-gradient-to-r from-[#6568F4]/5 to-[#6568F4]/5 border-[#6568F4]/20">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#6568F4] to-[#6568F4] rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('chat.family_activities_title') || 'Family Activities'}</h3>
                  <p className="text-sm text-gray-600">{t('chat.family_activities_subtitle') || 'AI planner for group and family experiences'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-[#6568F4]" />
                <span className="text-sm text-gray-700">{t('chat.family_activities_features') || 'Weekend plans • Age-appropriate • Budget-friendly'}</span>
              </div>
              <Button 
                onClick={handleFamilyActivities} 
                disabled={isLoading || isVoiceActive}
                className="w-full bg-[#6568F4] hover:bg-[#6568F4] transition-colors"
              >
                <Star className="w-4 h-4 mr-2" />
                {t('chat.plan_activities_btn') || 'Plan Family Activities'}
              </Button>
            </div>
          </Card>

          {/* Travel Optimization Feature Card */}
          <Card className="mb-4 bg-gradient-to-r from-[#6568F4]/5 to-[#6568F4]/5 border-[#6568F4]/20">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#6568F4] to-[#6568F4] rounded-lg flex items-center justify-center">
                  <Route className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('chat.travel_optimization_title') || 'Travel Optimization'}</h3>
                  <p className="text-sm text-gray-600">{t('chat.travel_optimization_subtitle') || 'AI-assisted weekend trips considering traffic, weather, and preferences'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="h-4 w-4 text-[#6568F4]" />
                <span className="text-sm text-gray-700">{t('chat.travel_optimization_features') || 'Weather-aware • Traffic optimization • Route planning'}</span>
              </div>
              <Button 
                onClick={handleTravelOptimization} 
                disabled={isLoading || isVoiceActive}
                className="w-full bg-[#6568F4] hover:bg-[#6568F4] transition-colors"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t('chat.optimize_travel_btn') || 'Optimize My Trip'}
              </Button>
            </div>
          </Card>

          {/* Insurance Assistant Feature Card */}
          <Card className="mb-4 bg-gradient-to-r from-gray-50 to-[#6568F4]/5 border-gray-200">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#6568F4] rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('chat.insurance_title') || 'Insurance Assistant'}</h3>
                  <p className="text-sm text-gray-600">{t('chat.insurance_subtitle') || 'AI-assisted queries to your insurance'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-[#6568F4]" />
                <span className="text-sm text-gray-700">{t('chat.insurance_features') || 'Policy guidance • Claims help • Coverage advice'}</span>
              </div>
              <Button 
                onClick={handleInsuranceQuery} 
                disabled={isLoading || isVoiceActive}
                className="w-full bg-[#6568F4] hover:bg-[#6568F4] transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                {t('chat.insurance_help_btn') || 'Get Insurance Help'}
              </Button>
            </div>
          </Card>

          {/* Messages Area */}
          {messages.length > 0 && (
            <div className="space-y-4 mt-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <Card className={`p-3 sm:p-4 max-w-[85%] sm:max-w-[80%] ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed break-words">
                      <div 
                        className="prose prose-sm max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-ul:text-inherit prose-li:text-inherit prose-ol:text-inherit"
                        style={{ 
                          color: 'inherit',
                          lineHeight: '1.6',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {msg.content}
                      </div>
                      {msg.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-current opacity-75 animate-pulse ml-1">|</span>
                      )}
                    </div>
                    {msg.groundingChunks && (
                      <div className="mt-2 space-y-2">
                        {msg.groundingChunks.map((chunk, idx) => (
                          <div key={idx} className="p-2 border rounded-lg">
                            <a href={chunk.maps.uri} target="_blank" className="text-primary font-semibold hover:underline break-words">
                              {chunk.maps.title}
                            </a>
                            <Button size="sm" className="w-full mt-2" onClick={() => handleBookService(chunk.maps.title)}>
                              {t('chat.book_service_btn')}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 pb-20">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto flex gap-2 items-center">
            <Button onClick={handleFindGarages} disabled={isLoading || isVoiceActive} variant="outline" size="icon" className="flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </Button>
            <Button
              onClick={isVoiceActive ? handleStopVoice : handleStartVoice}
              disabled={isLoading}
              size="icon"
              className={`flex-shrink-0 ${isVoiceActive ? "bg-red-500 hover:bg-red-600" : ""}`}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isVoiceActive ? t('chat.connecting') : t('chat.placeholder')}
              className="flex-1 min-w-0"
              disabled={isLoading || isVoiceActive}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} size="icon" disabled={isLoading || isVoiceActive} className="flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {voiceError && <p className="text-red-500 text-center mt-2 text-sm">{voiceError}</p>}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;
