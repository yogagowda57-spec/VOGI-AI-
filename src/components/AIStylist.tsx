import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, RefreshCw, Star, Compass, AlertCircle, ShoppingBag } from "lucide-react";
import { ChatMessage } from "../types";

interface AIStylistProps {
  isDarkMode: boolean;
}

export default function AIStylist({ isDarkMode }: AIStylistProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "stylist",
      text: "Greetings. I am your VOGA AI Stylist and Fashion Creative Director. Ask me anything about seasonal collections, custom drapes, size suggestions, or runway pairings.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setError("");

    try {
      const response = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!response.ok) {
        throw new Error("Failed to consult VOGA stylist engine.");
      }

      const data = await response.json();
      const stylistMsg: ChatMessage = {
        id: "s_" + Date.now(),
        sender: "stylist",
        text: data.text || "I apologize, but my fashion data stream encountered an unexpected fold.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, stylistMsg]);
    } catch (err: any) {
      console.error(err);
      setError("AI connection transient error. Showing stylized recommendations instead.");
      
      // Smart local backup reply
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: "s_local_" + Date.now(),
          sender: "stylist",
          text: "I recommend focusing on neutral earth-toned blazers paired with slim-fit wool trousers. Accentuate this silhouette with stainless steel accessories to create a modern aesthetic.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 500);
    } finally {
      setIsTyping(false);
    }
  };

  const PRESETS = [
    { label: "Wedding", prompt: "Give wedding outfit recommendations" },
    { label: "Office Style", prompt: "Suggest office style guidelines" },
    { label: "Match Shoes", prompt: "What matches brown suede loafers?" },
    { label: "Rainy Day", prompt: "What should I wear on a rainy day?" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      
      {/* Chat Section */}
      <div className={`md:col-span-8 rounded-3xl border flex flex-col h-[520px] relative overflow-hidden ${
        isDarkMode ? "glass-panel text-white border-white/15 shadow-2xl" : "bg-white border-black/5 shadow-xl"
      }`}>
        {/* Chat Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? "border-white/10" : "border-black/5"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-rose-500 to-indigo-600 text-white rounded-full">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">VOGA Couture Director</h4>
              <p className="text-[10px] font-mono text-emerald-400">GEMINI POWERED • LIVE</p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-neutral-400 uppercase">Synchronized</span>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => {
            const isStylist = m.sender === 'stylist';
            return (
              <div key={m.id} className={`flex ${isStylist ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed border transition-all ${
                  isStylist 
                    ? isDarkMode 
                      ? "bg-white/5 border-white/5 text-zinc-200" 
                      : "bg-neutral-50 border-black/5 text-neutral-800"
                    : "bg-gradient-to-r from-rose-500 to-indigo-600 text-white border-transparent shadow-md"
                }`}>
                  <p>{m.text}</p>
                  <span className={`text-[8px] font-mono block text-right mt-1.5 opacity-50 ${isStylist ? "" : "text-white/80"}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className={`rounded-2xl px-4 py-3 flex gap-1.5 items-center ${isDarkMode ? "bg-white/5" : "bg-neutral-50"}`}>
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl text-[10px] flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
          className={`p-4 border-t flex gap-2 items-center ${isDarkMode ? "border-white/10" : "border-black/5"}`}
        >
          <input
            type="text"
            placeholder="Ask about drapes, fabrics, custom matching..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={`flex-1 px-4 py-3.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
              isDarkMode ? "bg-white/5 border-white/10 text-white" : "bg-black/5 border-black/10 text-black"
            }`}
          />
          <button 
            type="submit"
            className="p-3.5 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Suggestion / Quick Queries Side Panel */}
      <div className="md:col-span-4 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-indigo-500 uppercase">SUGGESTION CHEAT SHEETS</span>
          <h4 className="text-base font-bold text-white">Quick Runway Prompts</h4>
          <p className="text-xs text-zinc-400">Trigger standard curated advice modules directly to save keystrokes.</p>
        </div>

        <div className="space-y-3">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.prompt)}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all group cursor-pointer ${
                isDarkMode 
                  ? "glass-panel hover:bg-white/5 hover:border-white/20" 
                  : "bg-neutral-50 border-black/5 hover:bg-neutral-100 hover:border-black/10 shadow-sm"
              }`}
            >
              <div>
                <h5 className="text-xs font-bold text-white">{p.label}</h5>
                <p className="text-[10px] text-zinc-400 mt-1">{p.prompt}</p>
              </div>
              <Compass className="h-4 w-4 text-indigo-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0 ml-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
