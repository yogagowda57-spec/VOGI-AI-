import React from "react";
import { Image, Compass } from "lucide-react";

interface BackgroundChangerProps {
  isDarkMode: boolean;
  selectedBg: string;
  onSelectBg: (bgValue: string) => void;
}

export const BACKGROUND_PRESETS = [
  { id: "studio", label: "Studio Default", value: "studio", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500" },
  { id: "beach", label: "Sunset Beach", value: "beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500" },
  { id: "street", label: "Milano Street", value: "street", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500" },
  { id: "office", label: "Penthouse Office", value: "office", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500" },
  { id: "mountain", label: "Swiss Alps", value: "mountain", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500" },
  { id: "cafe", label: "Paris Cafe", value: "cafe", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500" },
  { id: "luxury", label: "Luxury Lounge", value: "luxury", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500" }
];

export default function BackgroundChanger({
  isDarkMode,
  selectedBg,
  onSelectBg
}: BackgroundChangerProps) {
  return (
    <div className={`p-5 rounded-3xl border space-y-4 ${
      isDarkMode ? "glass-panel text-white" : "bg-white border-black/5 shadow-md"
    }`}>
      <div className="flex justify-between items-center">
        <h5 className="text-xs font-bold flex items-center gap-2">
          <Image className="h-4 w-4 text-rose-500" /> Backstage Environments
        </h5>
        <span className="text-[9px] font-mono text-neutral-400">Diffusion Composite</span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
        {BACKGROUND_PRESETS.map((bg) => {
          const isSelected = selectedBg === bg.value;
          return (
            <button
              key={bg.id}
              onClick={() => onSelectBg(bg.value)}
              className={`p-1.5 rounded-2xl border text-left flex flex-col gap-2 transition-all group relative overflow-hidden ${
                isSelected 
                  ? "border-rose-500 ring-2 ring-rose-500/20 scale-95" 
                  : isDarkMode ? "bg-neutral-900/40 border-white/5 hover:border-white/25" : "bg-neutral-50 border-black/5 hover:border-black/10 shadow-sm"
              }`}
            >
              <img src={bg.image} alt={bg.label} className="w-full h-16 object-cover rounded-xl group-hover:scale-105 transition-all" />
              <div className="px-1 py-0.5">
                <span className="text-[9px] font-bold block truncate leading-tight">{bg.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
