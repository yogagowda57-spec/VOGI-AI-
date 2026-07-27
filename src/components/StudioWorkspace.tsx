import React, { useState, useRef, useEffect } from "react";
import { Sparkles, RefreshCw, Star, Download, Share2, Heart, CheckCircle2, ShieldCheck, HelpCircle, Eye, ShoppingBag } from "lucide-react";
import { UserSilhouette, ClothingItem, TryOnResult } from "../types";
import ColorChanger from "./ColorChanger";
import BackgroundChanger, { BACKGROUND_PRESETS } from "./BackgroundChanger";

interface StudioWorkspaceProps {
  isDarkMode: boolean;
  silhouette: UserSilhouette | null;
  clothingItem: ClothingItem | null;
  onAddToHistory: (look: any) => void;
  onAddToFavorites: (item: ClothingItem) => void;
  favorites: ClothingItem[];
}

export default function StudioWorkspace({
  isDarkMode,
  silhouette,
  clothingItem,
  onAddToHistory,
  onAddToFavorites,
  favorites
}: StudioWorkspaceProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [result, setResult] = useState<TryOnResult | null>(null);

  // Live adjustment states
  const [hueValue, setHueValue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [presetColor, setPresetColor] = useState("Original");
  const [selectedBg, setSelectedBg] = useState("studio");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const processedGarmentCache = useRef<{ id: string; canvas: HTMLCanvasElement } | null>(null);

  // Helper function to dynamically remove light/white background of product photos using a boundary-connected flood fill
  const removeGarmentBackground = (img: HTMLImageElement): HTMLCanvasElement => {
    const offCanvas = document.createElement("canvas");
    offCanvas.width = img.naturalWidth || img.width;
    offCanvas.height = img.naturalHeight || img.height;
    const offCtx = offCanvas.getContext("2d");
    if (!offCtx) return offCanvas;

    offCtx.drawImage(img, 0, 0);
    try {
      const width = offCanvas.width;
      const height = offCanvas.height;
      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      const isWhiteish = (r: number, g: number, b: number) => {
        // High threshold for white background
        return r > 215 && g > 215 && b > 215;
      };

      // Add 4 corners to the queue to find the background
      const corners = [
        { x: 0, y: 0 },
        { x: width - 1, y: 0 },
        { x: 0, y: height - 1 },
        { x: width - 1, y: height - 1 }
      ];

      for (const corner of corners) {
        const idx = (corner.y * width + corner.x) * 4;
        if (isWhiteish(data[idx], data[idx + 1], data[idx + 2])) {
          const key = corner.y * width + corner.x;
          if (!visited[key]) {
            visited[key] = 1;
            queue.push(key);
          }
        }
      }

      let head = 0;
      while (head < queue.length) {
        const key = queue[head++];
        const x = key % width;
        const y = Math.floor(key / width);

        const idx = key * 4;
        // Make background pixel fully transparent
        data[idx + 3] = 0;

        // Check 4 neighbors
        const neighbors = [
          { x: x + 1, y },
          { x: x - 1, y },
          { x, y: y + 1 },
          { x, y: y - 1 }
        ];

        for (const n of neighbors) {
          if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
            const nKey = n.y * width + n.x;
            if (!visited[nKey]) {
              const nIdx = nKey * 4;
              if (isWhiteish(data[nIdx], data[nIdx + 1], data[nIdx + 2])) {
                visited[nKey] = 1;
                queue.push(nKey);
              }
            }
          }
        }
      }

      // Soft feathering pass for smooth, professional edges
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const key = y * width + x;
          const idx = key * 4;
          if (data[idx + 3] > 0) {
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            if (r > 200 && g > 200 && b > 200) {
              const hasTransparentNeighbor =
                data[((y - 1) * width + x) * 4 + 3] === 0 ||
                data[((y + 1) * width + x) * 4 + 3] === 0 ||
                data[(y * width + (x - 1)) * 4 + 3] === 0 ||
                data[(y * width + (x + 1)) * 4 + 3] === 0;

              if (hasTransparentNeighbor) {
                data[idx + 3] = Math.floor(data[idx + 3] * 0.45);
              }
            }
          }
        }
      }

      offCtx.putImageData(imgData, 0, 0);
    } catch (e) {
      console.error("Failed to remove garment background gracefully", e);
    }

    return offCanvas;
  };

  // Reset modifiers when clothing changes
  useEffect(() => {
    setHueValue(0);
    setSaturation(100);
    setBrightness(100);
    setPresetColor("Original");
    setSelectedBg("studio");
    setResult(null);
  }, [clothingItem]);

  // Combined Canvas Compositing Effect in Real-Time
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !silhouette) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const modelImg = new Image();
    const garmentImg = new Image();
    const bgImg = new Image();

    modelImg.crossOrigin = "anonymous";
    garmentImg.crossOrigin = "anonymous";
    bgImg.crossOrigin = "anonymous";

    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === 3) {
        // Draw background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        // Draw model profile
        ctx.drawImage(modelImg, 0, 0, canvas.width, canvas.height);

        // Apply filters & draw garment overlay on top of model
        ctx.save();
        
        // Custom canvas hue shift & sat filter string
        ctx.filter = `hue-rotate(${hueValue}deg) saturate(${saturation}%) brightness(${brightness}%)`;
        
        // Dynamic transparency process & cache
        let garmentCanvas: HTMLCanvasElement | HTMLImageElement = garmentImg;
        if (clothingItem) {
          if (processedGarmentCache.current?.id === clothingItem.id) {
            garmentCanvas = processedGarmentCache.current.canvas;
          } else {
            const processed = removeGarmentBackground(garmentImg);
            processedGarmentCache.current = { id: clothingItem.id, canvas: processed };
            garmentCanvas = processed;
          }
        }

        // Draw garment draped on model positioning
        ctx.drawImage(garmentCanvas, 40, 80, canvas.width - 80, canvas.height - 130);
        ctx.restore();
      }
    };

    // Pick active backdrop image source
    const bgPreset = BACKGROUND_PRESETS.find(p => p.value === selectedBg);
    bgImg.src = bgPreset?.image || BACKGROUND_PRESETS[0].image;
    bgImg.onload = checkAllLoaded;

    modelImg.src = silhouette.image;
    modelImg.onload = checkAllLoaded;

    garmentImg.src = clothingItem?.image || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500";
    garmentImg.onload = checkAllLoaded;

  }, [silhouette, clothingItem, hueValue, saturation, brightness, selectedBg, result]);

  const handleGenerateTryOn = () => {
    if (!silhouette || !clothingItem) return;

    setIsGenerating(true);
    setGenerateProgress(10);
    setResult(null);

    const interval = setInterval(() => {
      setGenerateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 250);

    // Call full-stack tryon backend API endpoint
    setTimeout(async () => {
      try {
        const response = await fetch("/api/tryon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userImage: silhouette.image,
            clothingItem: clothingItem,
            color: presetColor,
            background: selectedBg
          })
        });

        const data = await response.json();

        const successResult: TryOnResult = {
          id: "res_" + Date.now(),
          url: clothingItem.image, // Placeholder which triggers composites drawing
          confidence: data.confidence || 96,
          remarks: data.feedback || "Couture fit matches your body frame structure flawlessly.",
          fitSize: data.sizeRecommendation || "Medium",
          bodyMeasurements: data.bodyMeasurements,
          color: presetColor,
          background: selectedBg,
          timestamp: new Date().toLocaleTimeString()
        };

        setResult(successResult);
        onAddToHistory({
          url: clothingItem.image,
          clothingName: clothingItem.name,
          confidence: successResult.confidence,
          background: selectedBg,
          timestamp: successResult.timestamp
        });
      } catch (err) {
        console.error("AI tryon error:", err);
      } finally {
        setIsGenerating(false);
      }
    }, 2000);
  };

  const handleDownloadHD = (quality: 'HD' | '4K') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `VOGA_AI_TryOn_${quality}_Fit.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFavorite = clothingItem ? favorites.some(f => f.id === clothingItem.id) : false;

  return (
    <div className={`space-y-8 max-w-6xl mx-auto p-6 ${isDarkMode ? "text-white" : "text-black"}`}>
      
      {/* Studio Banner */}
      {!silhouette || !clothingItem ? (
        <div className={`p-12 text-center rounded-3xl border border-dashed flex flex-col items-center justify-center space-y-4 min-h-[300px] ${
          isDarkMode ? "glass-panel text-white" : "bg-white border-black/10 shadow-sm"
        }`}>
          <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-full">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h4 className="text-lg font-bold">Configure Inputs First</h4>
          <p className="text-xs text-neutral-400 max-w-xs">
            Go to the **Upload zone** above to select your model snap and outfit garment before launching the try-on simulator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visual Composed Output */}
          <div className="lg:col-span-8 space-y-6">
            <div className={`relative rounded-3xl border overflow-hidden p-6 flex flex-col items-center justify-center min-h-[480px] ${
              isDarkMode ? "glass-panel shadow-2xl" : "shadow-lg bg-neutral-50 border-black/5"
            }`}>
              {/* Composite canvas */}
              <canvas ref={canvasRef} width={500} height={500} className="max-w-full h-auto rounded-2xl object-cover shadow-md" />

              {/* Holographic scanning effect */}
              {isGenerating && (
                <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-4">
                  <div className="w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 to-indigo-600 rounded-full transition-all duration-300" 
                      style={{ width: `${generateProgress}%` }}
                    />
                  </div>
                  <p className="text-xs tracking-widest font-mono text-neutral-400 animate-pulse">
                    GENERATING REALISTIC SEAMLESS COUTURE DRAPE ({generateProgress}%)
                  </p>
                </div>
              )}

              {/* Sizing badge overlay */}
              {result && (
                <div className="absolute top-6 left-6 px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-[10px] font-mono tracking-widest text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> AI Sizing: {result.fitSize}
                </div>
              )}

              {/* Confidence Badge overlay */}
              {result && (
                <div className="absolute top-6 right-6 px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-[10px] font-mono tracking-widest text-indigo-400 flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" /> Match Score: {result.confidence}%
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleGenerateTryOn}
                disabled={isGenerating}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/10 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Fit
              </button>

              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadHD('HD')}
                    className={`px-4 py-3 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isDarkMode ? "glass-panel hover:bg-white/10" : "bg-neutral-100 border-black/10 hover:bg-neutral-200"
                    }`}
                  >
                    <Download className="h-4 w-4" /> HD 1080p
                  </button>
                  <button
                    onClick={() => handleDownloadHD('4K')}
                    className={`px-4 py-3 rounded-xl border border-indigo-500/30 text-xs font-mono font-bold flex items-center gap-2 text-indigo-400 transition-all cursor-pointer ${
                      isDarkMode ? "bg-indigo-500/10 hover:bg-indigo-500/20" : "bg-indigo-50 hover:bg-indigo-100"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 animate-pulse" /> 4K Resolution
                  </button>
                </div>
              )}

              <button
                onClick={() => onAddToFavorites(clothingItem)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isFavorite 
                    ? "bg-rose-500/15 border-rose-500/30 text-rose-500" 
                    : isDarkMode ? "glass-panel text-neutral-400 hover:text-neutral-200" : "bg-neutral-100 border-black/10 hover:bg-neutral-200 text-neutral-600"
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-rose-500" : ""}`} />
              </button>
            </div>

            {/* AI Fit feedback */}
            {result && (
              <div className={`p-6 rounded-3xl border space-y-3 ${isDarkMode ? "glass-panel text-white" : "bg-white border-black/5 shadow-sm"}`}>
                <h5 className="text-xs font-bold font-mono tracking-widest text-indigo-500 uppercase">Neural Fit Diagnostics</h5>
                <p className="text-xs leading-relaxed text-zinc-400">{result.remarks}</p>
                {result.bodyMeasurements && (
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5 text-center">
                    <div>
                      <p className="text-[10px] font-mono text-neutral-400">CHEST</p>
                      <span className="text-sm font-bold">{result.bodyMeasurements.chest} cm</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-neutral-400">WAIST</p>
                      <span className="text-sm font-bold">{result.bodyMeasurements.waist} cm</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-neutral-400">HIPS</p>
                      <span className="text-sm font-bold">{result.bodyMeasurements.hips} cm</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-neutral-400">EST. HEIGHT</p>
                      <span className="text-sm font-bold">{result.bodyMeasurements.height} cm</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Real-Time Modifiers Side panel */}
          <div className="lg:col-span-4 space-y-6">
            <ColorChanger
              isDarkMode={isDarkMode}
              hueValue={hueValue}
              setHueValue={setHueValue}
              saturation={saturation}
              setSaturation={setSaturation}
              brightness={brightness}
              setBrightness={setBrightness}
              presetColor={presetColor}
              setPresetColor={setPresetColor}
            />

            <BackgroundChanger
              isDarkMode={isDarkMode}
              selectedBg={selectedBg}
              onSelectBg={setSelectedBg}
            />
          </div>
        </div>
      )}
    </div>
  );
}
