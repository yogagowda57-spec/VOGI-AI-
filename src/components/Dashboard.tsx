import React from "react";
import { Sparkles, Heart, Clock, Shirt, TrendingUp, Award, Ruler, ArrowRight, Star } from "lucide-react";
import { ClothingItem } from "../types";

interface DashboardProps {
  isDarkMode: boolean;
  savedLooks: any[];
  favorites: ClothingItem[];
  history: any[];
  setCurrentTab: (tab: string) => void;
  onSelectRecent: (look: any) => void;
}

export default function Dashboard({
  isDarkMode,
  savedLooks,
  favorites,
  history,
  setCurrentTab,
  onSelectRecent
}: DashboardProps) {

  const stats = [
    { label: "Fits Modeled", value: savedLooks.length + history.length + 3, icon: Shirt, color: "text-indigo-500 bg-indigo-500/10" },
    { label: "Saved Outfits", value: savedLooks.length + 2, icon: Heart, color: "text-rose-500 bg-rose-500/10" },
    { label: "AI Match Quality", value: "98.2%", icon: Award, color: "text-amber-500 bg-amber-500/10" },
    { label: "Locked Size", value: "M (EU 40)", icon: Ruler, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className={`p-6 max-w-6xl mx-auto space-y-8 ${isDarkMode ? "text-white" : "text-black"}`}>
      {/* Welcome Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-8 border ${
        isDarkMode 
          ? "bg-gradient-to-r from-neutral-900 to-indigo-950/30 border-white/10" 
          : "bg-gradient-to-r from-indigo-50 to-white border-indigo-100 shadow-sm"
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-lg space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-indigo-500 uppercase flex items-center gap-1">
            <Sparkles className="h-3 w-3 animate-pulse" /> Digital Fitting Space
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Your Fashion Intelligence</h2>
          <p className={`text-xs ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            Track wardrobe categories, saved looks, 3D measurements, and let VOGA suggest runway pairings dynamically.
          </p>
          <button
            onClick={() => setCurrentTab("tryon")}
            className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-semibold text-xs flex items-center gap-2 hover:opacity-95 transition-all shadow-md shadow-rose-500/10"
          >
            Launch AI Studio <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 ${
            isDarkMode ? "glass-panel text-white" : "bg-white border-black/5 shadow-sm text-neutral-900"
          }`}>
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-[10px] font-mono uppercase tracking-wider ${isDarkMode ? "text-zinc-400" : "text-neutral-500"}`}>{stat.label}</p>
              <h4 className="text-xl font-bold font-sans mt-0.5">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Layout: Left side Try-on list, Right side Favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Looks */}
        <div className={`lg:col-span-8 p-6 rounded-3xl border ${
          isDarkMode ? "glass-panel text-white" : "bg-white border-black/5 shadow-sm text-neutral-900"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" /> Recent Fit Runs
            </h3>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Synchronized</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-xs text-neutral-400">No fits recorded yet.</p>
              <button 
                onClick={() => setCurrentTab("tryon")}
                className="text-xs font-semibold text-indigo-400 hover:underline"
              >
                Simulate your first look now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((look, i) => (
                <div 
                  key={i} 
                  onClick={() => onSelectRecent(look)}
                  className={`p-4 rounded-xl border flex gap-4 items-center cursor-pointer hover:scale-[1.01] transition-all ${
                    isDarkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-neutral-50 border-black/5 hover:border-black/10"
                  }`}
                >
                  <img 
                    src={look.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300"} 
                    alt="Draped Silhouette" 
                    className="w-16 h-16 object-cover rounded-lg border border-white/10"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="text-xs font-bold truncate">{look.clothingName || "Runway Style"}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono">FIT QUALITY: {look.confidence}%</p>
                    <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md text-[9px] font-mono">
                      {look.background || "Studio"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Clothes */}
        <div className={`lg:col-span-4 p-6 rounded-3xl border flex flex-col ${
          isDarkMode ? "glass-panel text-white" : "bg-white border-black/5 shadow-sm text-neutral-900"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" /> Wardrobe Favorites
            </h3>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">{favorites.length} Saved</span>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12 space-y-3 flex-1 flex flex-col justify-center">
              <p className="text-xs text-neutral-400">Your clothing favorites list is empty.</p>
              <p className="text-[10px] text-neutral-500">Tap the heart icon in AI Studio to bookmark clothing styles.</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[300px] flex-1">
              {favorites.map((item) => (
                <div key={item.id} className={`p-3 rounded-xl border flex items-center gap-3 ${
                  isDarkMode ? "bg-white/5 border-white/5" : "bg-neutral-50 border-black/5"
                }`}>
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-white/10" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-xs font-bold truncate">{item.name}</h4>
                    <p className="text-[10px] text-neutral-400">{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-mono font-bold">{item.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bonus Features: Sizing Recommendation & Measurement Banner */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
        <div className={`p-6 rounded-3xl border ${
          isDarkMode ? "glass-panel text-white" : "bg-white border-black/5 shadow-sm text-neutral-900"
        }`}>
          <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-rose-400" /> Fashion Trends & Suggestions
          </h4>
          <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-neutral-600"} leading-relaxed`}>
            Currently trending: **Monochromatic tailoring** and **oversized wool overcoats**. Our AI models suggest pairing structured charcoal jackets with wide-leg pants for standard fall weather.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border ${
          isDarkMode ? "glass-panel text-white" : "bg-white border-black/5 shadow-sm text-neutral-900"
        }`}>
          <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-indigo-400" /> AI Confidence Profile
          </h4>
          <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-neutral-600"} leading-relaxed`}>
            Your digital avatar frame is optimized for an **M Size (Slim-Fit)**. Recommended jacket size is **38R**. Fabric stretch dynamics are adjusted to avoid bunching on shoulder alignments.
          </p>
        </div>
      </div>
    </div>
  );
}
