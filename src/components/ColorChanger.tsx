import React from "react";
import { Sliders, Sun, ShieldCheck } from "lucide-react";

interface ColorChangerProps {
  isDarkMode: boolean;
  hueValue: number; // 0 to 360
  setHueValue: (val: number) => void;
  saturation: number; // 0 to 200
  setSaturation: (val: number) => void;
  brightness: number; // 50 to 150
  setBrightness: (val: number) => void;
  presetColor: string;
  setPresetColor: (col: string) => void;
}

const LUXURY_COLORS = [
  { name: "Original", code: "transparent", hue: 0, sat: 100, bri: 100 },
  { name: "Obsidian", code: "#1C1C1E", hue: 0, sat: 0, bri: 50 },
  { name: "Olive Sage", code: "#5A6E58", hue: 115, sat: 30, bri: 95 },
  { name: "Crimson Silk", code: "#9C2A2A", hue: 355, sat: 130, bri: 85 },
  { name: "Arctic White", code: "#F2F4F7", hue: 0, sat: 10, bri: 140 },
  { name: "Champagne Glimmer", code: "#D4AF37", hue: 45, sat: 110, bri: 110 }
];

export default function ColorChanger({
  isDarkMode,
  hueValue,
  setHueValue,
  saturation,
  setSaturation,
  brightness,
  setBrightness,
  presetColor,
  setPresetColor
}: ColorChangerProps) {

  const handlePresetSelect = (preset: typeof LUXURY_COLORS[0]) => {
    setPresetColor(preset.name);
    setHueValue(preset.hue);
    setSaturation(preset.sat);
    setBrightness(preset.bri);
  };

  return (
    <div className={`p-5 rounded-3xl border space-y-5 ${
      isDarkMode ? "glass-panel text-white" : "bg-white border-black/5 shadow-md"
    }`}>
      <div className="flex justify-between items-center">
        <h5 className="text-xs font-bold flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-500" /> Color Chromatix
        </h5>
        <span className="text-[9px] font-mono text-neutral-400">Real-Time Canvas Matrix</span>
      </div>

      {/* Preset Row */}
      <div className="space-y-2">
        <label className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">Luxury Color Presets</label>
        <div className="flex flex-wrap gap-2">
          {LUXURY_COLORS.map((col) => {
            const isSelected = presetColor === col.name;
            return (
              <button
                key={col.name}
                onClick={() => handlePresetSelect(col)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono border font-semibold flex items-center gap-2 transition-all ${
                  isSelected 
                    ? "bg-indigo-500 text-white border-transparent shadow-md" 
                    : isDarkMode ? "bg-neutral-900 border-white/5 text-neutral-300 hover:bg-neutral-800" : "bg-neutral-100 border-black/5 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {col.code !== "transparent" && (
                  <span className="w-2.5 h-2.5 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: col.code }} />
                )}
                {col.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slider Inputs */}
      <div className="space-y-4 pt-2 border-t border-white/5">
        
        {/* Hue */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-neutral-400">
            <span>Garment Hue Shift</span>
            <span>{hueValue}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={hueValue}
            onChange={(e) => { setHueValue(parseInt(e.target.value)); setPresetColor("Custom"); }}
            className="w-full accent-indigo-500 h-1 bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500 rounded-lg appearance-none"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-neutral-400">
            <span>Garment Saturation</span>
            <span>{saturation}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={saturation}
            onChange={(e) => { setSaturation(parseInt(e.target.value)); setPresetColor("Custom"); }}
            className="w-full accent-rose-500"
          />
        </div>

        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono text-neutral-400">
            <span>Garment Luster / Brightness</span>
            <span>{brightness}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={brightness}
            onChange={(e) => { setBrightness(parseInt(e.target.value)); setPresetColor("Custom"); }}
            className="w-full accent-indigo-600"
          />
        </div>

      </div>
    </div>
  );
}
