import React, { useRef, useEffect, useState } from "react";
import { Camera, RefreshCw, Layers, Compass, Video, AlertCircle, Sparkles } from "lucide-react";

interface ARMirrorProps {
  isDarkMode: boolean;
}

export default function ARMirror({ isDarkMode }: ARMirrorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [overlayGarment, setOverlayGarment] = useState<'trench' | 'gown' | 'blazer'>('trench');

  useEffect(() => {
    // Attempt standard webcam capture
    let activeStream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.warn("Camera access denied or unavailable. Falling back to fashion simulation backdrop.", err);
        setPermissionError(true);
      }
    };

    startWebcam();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Video Stream Stage */}
      <div className={`relative rounded-[32px] overflow-hidden flex flex-col items-center justify-center min-h-[480px] lg:col-span-8 border bg-black ${
        isDarkMode ? "border-white/15 shadow-2xl" : "border-black/10 shadow-2xl"
      }`}>
        
        {/* Permission fallback / Simulator backdrop */}
        {permissionError ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950 p-6 text-center space-y-4">
            <div className="absolute inset-0 opacity-25">
              <img 
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000" 
                alt="Runway Backup" 
                className="w-full h-full object-cover filter blur-xs"
              />
            </div>
            
            <div className="relative z-10 space-y-4 max-w-sm">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full w-fit mx-auto animate-pulse">
                <Video className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-white">Interactive Mirror Simulator</p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Allow camera permissions in your browser, or enjoy our high-fidelity virtual model overlay.
              </p>
              <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-neutral-400">
                CAM_FALLBACK_ACTIVE
              </div>
            </div>
          </div>
        ) : !streamActive ? (
          <div className="absolute inset-0 bg-neutral-950 z-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-xs tracking-widest font-mono text-neutral-400">CONNECTING TO DEVICE CAMERA...</p>
          </div>
        ) : null}

        {/* Live Camera View */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-[450px] object-cover"
          style={{ transform: `scaleX(-1) scale(${zoomScale})` }} 
        />

        {/* Target Guide Alignments overlay */}
        <div className="absolute inset-0 border border-indigo-500/10 pointer-events-none flex items-center justify-center">
          
          {/* Head & Neck guides */}
          <div className="absolute top-[15%] w-32 h-32 border-2 border-dashed border-rose-500/30 rounded-full" />
          <div className="absolute top-[20%] w-[1px] h-[60%] border-l border-dashed border-indigo-500/20" />
          
          {/* Shoulders guides */}
          <div className="absolute top-[40%] w-[60%] h-[1px] border-t border-dashed border-indigo-500/30" />
          
          {/* Alignment corner borders */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-indigo-500/40" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-indigo-500/40" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-indigo-500/40" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-indigo-500/40" />
        </div>

        {/* Dynamic fitting garment overlay on camera */}
        <div className="absolute inset-y-0 inset-x-0 pointer-events-none flex items-center justify-center">
          <div className="w-[50%] h-[60%] mt-20 opacity-80 mix-blend-normal transform transition-all duration-300">
            {overlayGarment === 'trench' && (
              <img 
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500" 
                alt="Trench Fit" 
                className="w-full h-full object-contain filter hue-rotate-15 contrast-110 saturate-120"
              />
            )}
            {overlayGarment === 'gown' && (
              <img 
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500" 
                alt="Halter Gown Fit" 
                className="w-full h-full object-contain filter brightness-110 saturate-105"
              />
            )}
            {overlayGarment === 'blazer' && (
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500" 
                alt="Linen Blazer Fit" 
                className="w-full h-full object-contain filter hue-rotate-180 contrast-120 brightness-95"
              />
            )}
          </div>
        </div>

        {/* HUD bottom controls */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-[10px] font-mono tracking-widest text-zinc-300 flex items-center gap-2">
            <Camera className="h-3.5 w-3.5 text-rose-500 animate-pulse" /> Alignment active
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setZoomScale(prev => Math.max(1.0, prev - 0.1))}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-mono text-white active:scale-95 transition-all cursor-pointer"
            >
              Zoom -
            </button>
            <button
              onClick={() => setZoomScale(prev => Math.min(2.0, prev + 0.1))}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-mono text-white active:scale-95 transition-all cursor-pointer"
            >
              Zoom +
            </button>
          </div>
        </div>
      </div>

      {/* Settings Side Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-indigo-500 uppercase">REAL-TIME AUGMENTATION</span>
          <h3 className="text-xl font-bold tracking-tight text-white">Active Fitting Mirror</h3>
          <p className="text-xs text-zinc-400">Position yourself in the center of the viewport guide to let VOGA calibrate alignment points automatically.</p>
        </div>

        {/* Garment Selector */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? "glass-panel text-white" : "bg-neutral-50 border-black/5"}`}>
          <label className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-3">Overlay Garment</label>
          <div className="space-y-2">
            {[
              { id: 'trench', label: "Premium Cashmere Trench", category: "Jacket" },
              { id: 'gown', label: "Silk Halter Gown", category: "Dress" },
              { id: 'blazer', label: "Modern Fit Linen Blazer", category: "Jacket" }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setOverlayGarment(g.id as any)}
                className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                  overlayGarment === g.id
                    ? "bg-gradient-to-r from-rose-500 to-indigo-600 text-white border-transparent shadow-md"
                    : isDarkMode ? "bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10" : "bg-white border-black/10 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span className="text-xs font-semibold">{g.label}</span>
                <span className="text-[9px] font-mono opacity-80 uppercase">{g.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sizing Indicator */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? "glass-panel text-white" : "bg-neutral-50 border-black/5"}`}>
          <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5 text-rose-400">
            <Sparkles className="h-4 w-4 animate-pulse" /> Alignment Quality
          </h4>
          <p className="text-[11px] leading-relaxed text-zinc-400">
            For maximum sizing accuracy, hold position for **3 seconds**. Stand **1.5 meters** back until shoulder coordinates anchor cleanly to the guide markers.
          </p>
        </div>
      </div>
    </div>
  );
}
