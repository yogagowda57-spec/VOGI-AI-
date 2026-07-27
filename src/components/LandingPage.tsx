import React, { useRef, useEffect } from "react";
import { Sparkles, ArrowRight, Play, CheckCircle2, ShoppingBag, ShieldAlert, Star, Compass, RefreshCw, Layers } from "lucide-react";

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
  isDarkMode: boolean;
  onOpenAuth: () => void;
}

export default function LandingPage({ setCurrentTab, isDarkMode, onOpenAuth }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hologram background particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 450);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }> = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = 450;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw wireframe mannequin outline
      ctx.strokeStyle = isDarkMode ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      // Head
      ctx.arc(width / 2, height * 0.2, 25, 0, Math.PI * 2);
      // Neck
      ctx.moveTo(width / 2, height * 0.25);
      ctx.lineTo(width / 2, height * 0.3);
      // Shoulders
      ctx.lineTo(width / 2 - 50, height * 0.35);
      ctx.lineTo(width / 2 + 50, height * 0.35);
      ctx.lineTo(width / 2, height * 0.3);
      // Torso
      ctx.moveTo(width / 2, height * 0.3);
      ctx.lineTo(width / 2, height * 0.6);
      // Hips
      ctx.lineTo(width / 2 - 35, height * 0.65);
      ctx.lineTo(width / 2 + 35, height * 0.65);
      // Arms
      ctx.moveTo(width / 2 - 50, height * 0.35);
      ctx.lineTo(width / 2 - 70, height * 0.55);
      ctx.moveTo(width / 2 + 50, height * 0.35);
      ctx.lineTo(width / 2 + 70, height * 0.55);
      // Legs
      ctx.moveTo(width / 2 - 35, height * 0.65);
      ctx.lineTo(width / 2 - 40, height * 0.9);
      ctx.moveTo(width / 2 + 35, height * 0.65);
      ctx.lineTo(width / 2 + 40, height * 0.9);

      ctx.stroke();

      // Render futuristic hologram particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle connecting lines to center mannequin
        const distToCenter = Math.abs(p.x - width / 2);
        if (distToCenter < 120 && Math.random() < 0.15) {
          ctx.strokeStyle = `rgba(244, 63, 94, ${p.alpha * 0.25})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(width / 2, height * 0.45);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDarkMode]);

  return (
    <div className={`font-sans min-h-screen transition-colors duration-500 overflow-hidden relative ${
      isDarkMode ? "bg-[#050505] text-[#F5F5F7]" : "bg-neutral-50 text-neutral-900"
    }`}>
      {/* Ambient Background Glows */}
      {isDarkMode && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2D1B69] rounded-full blur-[120px] opacity-20 pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1B4D69] rounded-full blur-[120px] opacity-20 pointer-events-none" />
        </>
      )}

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        <div className="md:col-span-7 space-y-6">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase border transition-all ${
            isDarkMode ? "bg-white/5 border-white/10 text-zinc-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-700 font-semibold"
          }`}>
            <Sparkles className="h-3 w-3" />
            <span>Revolutionizing Fashion Technology</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-[0.95] text-white">
            <span className={`${isDarkMode ? "gradient-text" : "bg-gradient-to-r from-neutral-800 to-neutral-500 bg-clip-text text-transparent"}`}>
              Try Before<br />You Buy.
            </span>
          </h1>

          <p className={`text-base sm:text-lg max-w-xl font-light leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-neutral-600"}`}>
            Upload your silhouette and witness your wardrobe come to life with photorealistic 3D AI fitting technology.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => setCurrentTab("tryon")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-medium text-sm flex items-center gap-3 shadow-lg shadow-rose-500/20 hover:opacity-95 active:scale-95 transition-all"
            >
              <span>Start Virtual Try-On</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex flex-col pl-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Powered by</span>
              <span className={`text-xs font-bold ${isDarkMode ? "text-zinc-300" : "text-zinc-800"}`}>Gemini Vision Pro</span>
            </div>
          </div>

          {/* Stats Grid under Hero */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
            <div>
              <div className="text-2xl font-bold">99.4%</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Fit Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4K</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Render Output</div>
            </div>
            <div>
              <div className="text-2xl font-bold">360°</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Avatar View</div>
            </div>
          </div>
        </div>

        {/* 3D Mannequin Visual Ref with custom orbit-circle aesthetics */}
        <div className="md:col-span-5 relative flex justify-center items-center h-[550px]">
          {isDarkMode && (
            <>
              <div className="absolute w-[500px] h-[500px] orbit-circle opacity-20 pointer-events-none" />
              <div className="absolute w-[350px] h-[350px] orbit-circle opacity-40 pointer-events-none" />
            </>
          )}

          <div className={`relative w-[380px] h-[520px] rounded-[40px] overflow-hidden p-6 flex flex-col justify-between ${
            isDarkMode ? "glass-panel" : "bg-white border border-black/5 shadow-2xl"
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Rendering Canvas_01</span>
            </div>

            {/* Mannequin / Hologram particles canvas inside container */}
            <div className="flex-1 relative flex items-center justify-center">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-90" />
              
              {/* Overlaying "Cloth" Glow */}
              {isDarkMode && (
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent mix-blend-screen mannequin-glow pointer-events-none" />
              )}

              {/* Floating detail cards inside design spec */}
              <div className="absolute top-6 right-0 glass-panel p-3 rounded-xl border border-indigo-500/30 w-32 backdrop-blur-md shadow-lg">
                <div className="text-[8px] text-indigo-400 font-bold uppercase mb-1 font-mono">Fabric Physics</div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-indigo-500"></div>
                </div>
                <div className="text-[9px] mt-1 text-zinc-300">Silk/Satin Blend</div>
              </div>

              <div className="absolute bottom-6 left-0 glass-panel p-3 rounded-xl border border-emerald-500/30 w-36 backdrop-blur-md shadow-lg">
                <div className="text-[8px] text-emerald-400 font-bold uppercase mb-1 font-mono">Lighting Match</div>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-900"></div>
                </div>
                <div className="text-[9px] mt-1 text-zinc-300">Studio Environment</div>
              </div>
            </div>

            {/* UI Controls row at the bottom of the canvas card */}
            <div className="grid grid-cols-4 gap-2">
              <div className={`h-10 rounded-lg border flex items-center justify-center ${isDarkMode ? "bg-white/5 border-white/5" : "bg-neutral-100 border-black/5"}`}>
                <div className="w-3.5 h-3.5 rounded-full border border-white/40"></div>
              </div>
              <div className={`h-10 rounded-lg border flex items-center justify-center ${isDarkMode ? "bg-white/10 border-indigo-500/50" : "bg-neutral-200 border-indigo-400/50"}`}>
                <div className="w-3.5 h-3.5 rounded-sm border-2 border-indigo-500 rotate-45"></div>
              </div>
              <div className={`h-10 rounded-lg border flex items-center justify-center ${isDarkMode ? "bg-white/5 border-white/5" : "bg-neutral-100 border-black/5"}`}>
                <div className="w-3.5 h-3.5 bg-white/40 rounded-sm"></div>
              </div>
              <div className={`h-10 rounded-lg border flex items-center justify-center ${isDarkMode ? "bg-white/5 border-white/5" : "bg-neutral-100 border-black/5"}`}>
                <div className="w-3.5 h-3.5 border-2 border-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={`py-20 border-y transition-colors duration-300 ${isDarkMode ? "bg-neutral-950/40 border-white/10" : "bg-neutral-100 border-black/5"}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">How VOGA Works</h2>
            <p className={`text-sm mt-2 max-w-md mx-auto ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
              Three high-tech steps to rendering custom couture on your own digital canvas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Profile",
                desc: "Provide front-facing portrait photos. Optional side and back profile snaps to enable our 3D Mannequin render pipeline."
              },
              {
                step: "02",
                title: "Select Your Outfit",
                desc: "Choose from our curated runway, jackets, shirts, pants or simply upload a raw clothing web image."
              },
              {
                step: "03",
                title: "Simulate & Modify",
                desc: "Our neural simulation fits fabric folds, lighting, shadows and tone. Adjust colors and custom environments in real-time."
              }
            ].map((item, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border relative transition-all ${
                isDarkMode ? "bg-white/[0.02] border-white/10 hover:border-indigo-500/40" : "bg-white border-black/5 hover:border-indigo-600/30 shadow-md"
              }`}>
                <span className="text-4xl font-extrabold text-indigo-500/30 font-mono block mb-4">{item.step}</span>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className={`text-xs ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">High-End Virtual Mirroring</h2>
          <p className={`text-sm mt-2 max-w-md mx-auto ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
            Engineered to replace fitting rooms entirely with robust modeling mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main big feature */}
          <div className={`md:col-span-8 p-8 rounded-3xl border flex flex-col justify-between min-h-[300px] transition-all relative overflow-hidden ${
            isDarkMode ? "bg-gradient-to-tr from-neutral-900 to-neutral-950 border-white/10" : "bg-gradient-to-tr from-neutral-100 to-white border-black/5 shadow-lg"
          }`}>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl w-fit mb-6">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Fabric Physics</h3>
              <p className={`text-sm max-w-lg ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                VOGA models evaluate lighting, skin folds, wrinkles, fabric stiffness, and stretch factors. The rendered output features real shadows and studio illumination.
              </p>
            </div>
            <div className="pt-6">
              <button 
                onClick={() => setCurrentTab("tryon")}
                className="text-xs font-semibold font-mono tracking-wider uppercase text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
              >
                PROCEED TO AI STUDIO <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sub feature */}
          <div className={`md:col-span-4 p-8 rounded-3xl border flex flex-col justify-between min-h-[300px] transition-all ${
            isDarkMode ? "bg-white/[0.02] border-white/10" : "bg-white border-black/5 shadow-lg"
          }`}>
            <div>
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl w-fit mb-6">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">3D Avatar Core</h3>
              <p className={`text-xs ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                Upload multiple angles to trigger our neural 3D avatar pipeline. Spin the model 360° under customizable lighting setups.
              </p>
            </div>
            <button 
              onClick={() => setCurrentTab("avatar")}
              className="text-xs font-semibold font-mono tracking-wider uppercase text-rose-400 hover:text-rose-300 flex items-center gap-2 mt-6"
            >
              ROTATE 3D MANNEQUIN <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={`py-20 border-t transition-colors duration-300 ${isDarkMode ? "bg-neutral-950/60 border-white/10" : "bg-neutral-100/60 border-black/5"}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Flexible Membership plans</h2>
            <p className={`text-sm mt-2 max-w-md mx-auto ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>
              Unlock ultra-high resolution 4K exports and limitless AI styler recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between relative transition-all ${
              isDarkMode ? "bg-black border-white/10" : "bg-white border-black/5 shadow-md"
            }`}>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">STANDARD</span>
                <h3 className="text-2xl font-bold mt-1">VOGA Free</h3>
                <p className="text-4xl font-extrabold mt-4 mb-2">$0</p>
                <p className="text-xs text-neutral-500">Perfect for trying basic 2D overlays</p>
                
                <ul className="space-y-3 mt-6 text-xs text-neutral-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Basic 2D simulation tries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Curated default wardrobe selection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>AI Stylist smart advice (Basic)</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setCurrentTab("tryon")}
                className={`w-full py-3 rounded-full text-xs font-semibold mt-8 transition-all ${
                  isDarkMode ? "bg-white/10 hover:bg-white/15 text-white" : "bg-black/5 hover:bg-black/10 text-black"
                }`}
              >
                Access Free Mirror
              </button>
            </div>

            {/* Premium */}
            <div className="p-8 rounded-3xl border border-indigo-500/50 bg-gradient-to-tr from-neutral-900 to-indigo-950/40 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-rose-500 text-[9px] font-mono tracking-widest font-semibold px-4 py-1.5 rounded-bl-2xl">
                MOST POPULAR
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase">ULTRA PREMIUM</span>
                <h3 className="text-2xl font-bold mt-1">VOGA Pro</h3>
                <p className="text-4xl font-extrabold mt-4 mb-2">$19<span className="text-sm font-normal text-neutral-400">/mo</span></p>
                <p className="text-xs text-neutral-400">Ideal for power fashion creators and luxury shoppers</p>

                <ul className="space-y-3 mt-6 text-xs text-neutral-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>Unmatched HD & 4K model exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>Dynamic 3D Mannequin simulation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>Infinite Gemini AI conversational advice</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>Uncapped wardrobe clothing storage</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setCurrentTab("tryon")}
                className="w-full py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500 to-indigo-600 text-white mt-8 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-indigo-500/20"
              >
                Unlock Pro Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How accurate is the 2D fitment technology?",
              a: "Our core fitment engine respects original skin tones, drapes fabric correctly across folds, and simulates natural environment shadows. Visual outcomes look highly professional."
            },
            {
              q: "How many photo inputs are required for the 3D mannequin?",
              a: "To generate the full 360° rotatable mannequin, we suggest uploading Front, Left, Right, and Back views of yourself. If some angles are missing, VOGA's generative model safely predicts the other structures."
            },
            {
              q: "Does VOGA sell clothing items directly?",
              a: "VOGA is an interactive virtual simulation sandbox. We provide links, recommendations, and size suggestions to partner boutiques, but we do not fulfill retail operations."
            }
          ].map((item, idx) => (
            <details key={idx} className={`p-6 rounded-2xl border transition-all ${
              isDarkMode ? "bg-white/[0.02] border-white/10" : "bg-white border-black/5 shadow-sm"
            }`}>
              <summary className="font-bold text-sm cursor-pointer select-none list-none flex justify-between items-center">
                <span>{item.q}</span>
                <span className="text-rose-500 text-lg">+</span>
              </summary>
              <p className={`text-xs mt-3 ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t text-center text-xs transition-colors duration-300 ${
        isDarkMode ? "bg-black border-white/10 text-neutral-500" : "bg-neutral-100 border-black/5 text-neutral-600"
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="font-bold tracking-wider font-sans">VOGA AI</span>
            <p className="text-[10px] mt-1">Try Before You Buy. Engineered for elite digital couture.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact Boutique</a>
          </div>
          <p>© 2026 VOGA AI Corporation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
