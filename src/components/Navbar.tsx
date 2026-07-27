import React from "react";
import { Sparkles, Shirt, ShieldCheck, HelpCircle, LogOut, Sun, Moon } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: () => void;
  user: any;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  isDarkMode,
  setIsDarkMode,
  user,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  return (
    <nav className={`sticky top-4 z-50 mx-auto max-w-6xl w-[92%] backdrop-blur-md border rounded-full px-6 py-3 flex items-center justify-between transition-colors duration-300 ${
      isDarkMode 
        ? "bg-black/40 border-white/10 text-white" 
        : "bg-white/60 border-black/10 text-black shadow-lg"
    }`}>
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => setCurrentTab("landing")}
      >
        <div className="p-2 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-full text-white animate-pulse">
          <Shirt className="h-5 w-5" />
        </div>
        <div>
          <span className="font-sans font-bold text-lg tracking-wider bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent group-hover:from-rose-400 group-hover:to-indigo-400 transition-all">
            VOGA AI
          </span>
          <p className="text-[9px] tracking-widest font-mono text-neutral-400 -mt-1">TRY BEFORE YOU BUY</p>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="hidden md:flex items-center gap-1 font-sans text-sm font-medium">
        {[
          { id: "landing", label: "Home" },
          { id: "dashboard", label: "Dashboard" },
          { id: "tryon", label: "AI Studio" },
          { id: "avatar", label: "3D Mannequin" },
          { id: "stylist", label: "AI Stylist" },
          { id: "armirror", label: "AR Mirror" },
        ].map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-4 py-1.5 rounded-full transition-all duration-300 relative ${
                isActive 
                  ? isDarkMode ? "text-white font-semibold" : "text-black font-semibold"
                  : isDarkMode ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {isActive && (
                <span className={`absolute inset-0 rounded-full -z-10 transition-all ${
                  isDarkMode ? "bg-white/10" : "bg-black/5"
                }`} />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-3">
        <button
          onClick={setIsDarkMode}
          className={`p-2 rounded-full transition-all ${
            isDarkMode ? "hover:bg-white/10 text-yellow-400" : "hover:bg-black/5 text-indigo-600"
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden lg:block text-right">
              <p className="text-xs font-medium font-sans leading-3">{user.name}</p>
              <span className="text-[9px] font-mono text-emerald-400">PREMIUM</span>
            </div>
            <button
              onClick={onLogout}
              className={`p-2 rounded-full border transition-all ${
                isDarkMode 
                  ? "border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-400" 
                  : "border-black/10 bg-black/5 hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-600"
              }`}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500 to-indigo-600 text-white hover:opacity-90 active:scale-95 transition-all shadow-md shadow-indigo-500/20"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
