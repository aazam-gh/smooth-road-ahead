import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your CareCast AI assistant. How can I help you with your vehicle today?" }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { role: "user", content: message }]);
    setMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I can help you with maintenance schedules, answer questions about your vehicle, and provide tips for optimal care. What would you like to know?" 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-32 flex flex-col">
      <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Assistant</h1>
            <p className="text-sm opacity-90">Ask me anything about your car</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full px-6 py-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`p-4 max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border p-4">
        <div className="max-w-md mx-auto flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your vehicle..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;
