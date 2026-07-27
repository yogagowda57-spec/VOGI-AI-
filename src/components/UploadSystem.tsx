import React, { useState } from "react";
import { Upload, Image as ImageIcon, Shirt, User, Check, RefreshCw, Layers } from "lucide-react";
import { UserSilhouette, ClothingItem } from "../types";

interface UploadSystemProps {
  isDarkMode: boolean;
  onSetSilhouette: (silhouette: UserSilhouette) => void;
  onSetClothingItem: (item: ClothingItem) => void;
  currentSilhouette: UserSilhouette | null;
  currentClothingItem: ClothingItem | null;
}

// Beautiful Default Silhouette Presets
const SILHOUETTE_PRESETS: UserSilhouette[] = [
  { id: "s1", label: "Front", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500" },
  { id: "s2", label: "Left", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500" },
  { id: "s3", label: "Right", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500" },
  { id: "s4", label: "Back", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500" }
];

// Beautiful Clothing Presets
const CLOTHING_PRESETS: ClothingItem[] = [
  { id: "c1", name: "Premium Cashmere Trench", category: "jacket", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500", color: "#8E755D", price: "$299", rating: 4.9, occasion: ["Winter", "Casual", "Office"] },
  { id: "c2", name: "Modern Fit Linen Blazer", category: "jacket", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500", color: "#3B4E43", price: "$180", rating: 4.8, occasion: ["Office", "Summer"] },
  { id: "c3", name: "Silk Drapery Halter Gown", category: "dress", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500", color: "#EED9B3", price: "$420", rating: 5.0, occasion: ["Wedding", "Evening"] },
  { id: "c4", name: "Tailored Pleated Wool Pant", category: "pant", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500", color: "#1A1A1D", price: "$150", rating: 4.7, occasion: ["Office", "Casual"] },
  { id: "c5", name: "Structured Heavyweight Shirt", category: "shirt", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500", color: "#FFFFFF", price: "$85", rating: 4.6, occasion: ["Casual", "Office"] },
  { id: "c6", name: "Handcrafted Suede Loafers", category: "shoes", image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500", color: "#4A3B32", price: "$220", rating: 4.9, occasion: ["Casual", "Summer"] }
];

export default function UploadSystem({
  isDarkMode,
  onSetSilhouette,
  onSetClothingItem,
  currentSilhouette,
  currentClothingItem
}: UploadSystemProps) {
  const [dragActiveS, setDragActiveS] = useState(false);
  const [dragActiveC, setDragActiveC] = useState(false);

  // File Upload Handlers (converts to base64 for instant client preview + API upload)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'silhouette' | 'clothing') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (type === 'silhouette') {
        onSetSilhouette({ id: "custom_s_" + Date.now(), label: "Front", image: base64 });
      } else {
        onSetClothingItem({
          id: "custom_c_" + Date.now(),
          name: file.name.split('.')[0] || "Custom Clothing",
          category: "shirt",
          image: base64,
          color: "#4F46E5",
          price: "$120",
          rating: 5.0
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag-and-Drop Handlers
  const handleDrag = (e: React.DragEvent, type: 'silhouette' | 'clothing', active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'silhouette') {
      setDragActiveS(active);
    } else {
      setDragActiveC(active);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'silhouette' | 'clothing') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'silhouette') setDragActiveS(false);
    else setDragActiveC(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (type === 'silhouette') {
        onSetSilhouette({ id: "custom_s_" + Date.now(), label: "Front", image: base64 });
      } else {
        onSetClothingItem({
          id: "custom_c_" + Date.now(),
          name: file.name.split('.')[0] || "Dropped Garment",
          category: "shirt",
          image: base64,
          color: "#4F46E5",
          price: "$120",
          rating: 5.0
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`space-y-12 max-w-6xl mx-auto p-6 ${isDarkMode ? "text-white" : "text-black"}`}>
      
      {/* Step Info */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono tracking-widest text-indigo-500 uppercase">Dual-Input Architecture</span>
        <h3 className="text-2xl font-extrabold tracking-tight">Configure Your Fitting Canvas</h3>
        <p className={`text-xs max-w-md mx-auto ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
          Drag and drop images below, or click to upload. You may also select from our model and luxury clothing presets below to try instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Step 1: Silhouette Upload */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-rose-500" /> Step 1: Body Silhouette Snaps
            </h4>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Interactive Previews</span>
          </div>

          {/* Upload Box */}
          <div 
            onDragOver={(e) => handleDrag(e, 'silhouette', true)}
            onDragLeave={(e) => handleDrag(e, 'silhouette', false)}
            onDrop={(e) => handleDrop(e, 'silhouette')}
            className={`h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all relative overflow-hidden ${
              dragActiveS 
                ? "border-rose-500 bg-rose-500/5 scale-[1.01]" 
                : currentSilhouette 
                  ? "border-emerald-500/40 bg-emerald-500/[0.01]" 
                  : isDarkMode 
                    ? "border-white/10 bg-white/[0.01] hover:border-white/20" 
                    : "border-black/10 bg-black/[0.01] hover:border-black/20"
            }`}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileUpload(e, 'silhouette')}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />

            {currentSilhouette ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={currentSilhouette.image} alt="User Canvas" className="w-full h-full object-contain rounded-2xl" />
                <div className="absolute top-4 right-4 p-2 bg-emerald-500 text-white rounded-full">
                  <Check className="h-4 w-4" />
                </div>
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-white">
                  {currentSilhouette.label} Angle Loaded
                </div>
              </div>
            ) : (
              <div className="space-y-4 pointer-events-none">
                <div className={`p-4 rounded-2xl mx-auto w-fit ${isDarkMode ? "bg-white/5 text-rose-400" : "bg-black/5 text-rose-600"}`}>
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Upload Your Body Profile</p>
                  <p className="text-xs text-neutral-500 mt-1">Drag front or multi-angle photos here</p>
                </div>
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Quick Silhouette Presets</label>
            <div className="grid grid-cols-4 gap-3">
              {SILHOUETTE_PRESETS.map((preset) => {
                const isSelected = currentSilhouette?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSetSilhouette(preset)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center gap-2 transition-all relative ${
                      isSelected 
                        ? "border-rose-500 ring-2 ring-rose-500/20 scale-95" 
                        : isDarkMode ? "glass-panel hover:border-white/20" : "border-black/10 hover:border-black/20"
                    }`}
                  >
                    <img src={preset.image} alt={preset.label} className="w-full h-16 object-cover rounded-lg" />
                    <span className="text-[9px] font-mono tracking-wider font-semibold">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 2: Clothing Upload */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold flex items-center gap-2">
              <Shirt className="h-5 w-5 text-indigo-500" /> Step 2: Luxury Garment Snaps
            </h4>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Instant Layering</span>
          </div>

          {/* Upload Box */}
          <div 
            onDragOver={(e) => handleDrag(e, 'clothing', true)}
            onDragLeave={(e) => handleDrag(e, 'clothing', false)}
            onDrop={(e) => handleDrop(e, 'clothing')}
            className={`h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all relative overflow-hidden ${
              dragActiveC 
                ? "border-indigo-500 bg-indigo-500/5 scale-[1.01]" 
                : currentClothingItem 
                  ? "border-emerald-500/40 bg-emerald-500/[0.01]" 
                  : isDarkMode 
                    ? "border-white/10 glass-panel hover:border-white/20" 
                    : "border-black/10 bg-black/[0.01] hover:border-black/20"
            }`}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileUpload(e, 'clothing')}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />

            {currentClothingItem ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={currentClothingItem.image} alt="Clothing Canvas" className="w-full h-full object-contain rounded-2xl" />
                <div className="absolute top-4 right-4 p-2 bg-emerald-500 text-white rounded-full">
                  <Check className="h-4 w-4" />
                </div>
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono text-white">
                  {currentClothingItem.name} Loaded
                </div>
              </div>
            ) : (
              <div className="space-y-4 pointer-events-none">
                <div className={`p-4 rounded-2xl mx-auto w-fit ${isDarkMode ? "bg-white/5 text-indigo-400" : "bg-black/5 text-indigo-600"}`}>
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Upload Couture Garment</p>
                  <p className="text-xs text-neutral-500 mt-1">Drag coats, shirts, pants or shoes here</p>
                </div>
              </div>
            )}
          </div>

          {/* Curated Presets */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Select Luxury Clothing Presets</label>
            <div className="grid grid-cols-3 gap-3">
              {CLOTHING_PRESETS.map((item) => {
                const isSelected = currentClothingItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSetClothingItem(item)}
                    className={`p-2 rounded-xl border flex gap-3 text-left items-center transition-all relative overflow-hidden ${
                      isSelected 
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 scale-95 bg-[#251e44]/40" 
                        : isDarkMode ? "glass-panel hover:border-white/20" : "bg-neutral-50 border-black/5 hover:border-black/10 shadow-sm"
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0" />
                    <div className="overflow-hidden">
                      <h5 className="text-[10px] font-bold truncate leading-tight">{item.name}</h5>
                      <span className="text-[9px] font-mono text-neutral-400 leading-none">{item.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
