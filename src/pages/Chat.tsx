import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, MapPin, Mic } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { chatService, getMapsGroundedResponse } from "../lib/geminiService";
import { GoogleGenAI, Modality, LiveServerMessage, Blob as GenBlob } from "@google/genai";
import { encode } from "../lib/audio";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { LanguageCode } from "../../types";

interface ChatProps {
  onLanguageChange: (lang: LanguageCode) => void;
  currentLang: LanguageCode;
}

type ChatMessage = {
  sender: "user" | "model";
  content: string;
  groundingChunks?: any[];
};

const Chat = ({ onLanguageChange, currentLang }: ChatProps) => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "model", content: t('chat.initial_greeting') },
  ]);
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
    setMessages((prev) => [...prev, userMsg, { sender: "model", content: "" }]);
    setMessage("");
    setIsLoading(true);

    try {
      const stream = chatService.sendMessageStream(message);
      for await (const chunk of stream) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content += chunk;
          return newMsgs;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].content = t('chat.trouble_connecting');
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

  const isVoiceActive = voiceStatus === "connecting" || voiceStatus === "connected";

  // ---- UI ----
  return (
    <div className="min-h-screen bg-background pb-32 flex flex-col">
      <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t('chat.title')}</h1>
                <p className="text-sm opacity-90">{t('chat.ask_anything')}</p>
              </div>
            </div>
            <LanguageToggle currentLang={currentLang} onToggle={onLanguageChange} />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full px-6 py-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <Card className={`p-4 max-w-[80%] ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.groundingChunks && (
                  <div className="mt-2 space-y-2">
                    {msg.groundingChunks.map((chunk, idx) => (
                      <div key={idx} className="p-2 border rounded-lg">
                        <a href={chunk.maps.uri} target="_blank" className="text-primary font-semibold hover:underline">
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
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border p-4">
        <div className="max-w-md mx-auto flex gap-2 items-center">
          <Button onClick={handleFindGarages} disabled={isLoading || isVoiceActive} variant="outline" size="icon">
            <MapPin className="w-4 h-4" />
          </Button>
          <Button
            onClick={isVoiceActive ? handleStopVoice : handleStartVoice}
            disabled={isLoading}
            size="icon"
            className={isVoiceActive ? "bg-red-500 hover:bg-red-600" : ""}
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isVoiceActive ? t('chat.connecting') : t('chat.placeholder')}
            className="flex-1"
            disabled={isLoading || isVoiceActive}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} size="icon" disabled={isLoading || isVoiceActive}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {voiceError && <p className="text-red-500 text-center mt-2 text-sm">{voiceError}</p>}
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;
