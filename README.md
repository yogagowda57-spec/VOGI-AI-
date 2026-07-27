# VOGA AI

> "Try Before You Buy."

VOGA AI is an elite, production-grade Virtual Fashion Try-On platform designed for luxury retail digital mirroring. Engineered with full-stack Node.js Express serving a React 19 / Vite frontend, VOGA AI harnesses Google's Gemini 3.5 LLMs and WebGL Three.js mannequins to deliver a futuristic digital fitting room sandbox.

---

## Architecture & Core Modules

1. **Custom Full-Stack Server (`/server.ts`)**:
   - Built on Express with full Vite middleware integration.
   - Hosts secure server-side API endpoints (`/api/stylist`, `/api/tryon`) to safely interact with the `@google/genai` model family without exposing secret keys to the browser.

2. **2D Canvas Compositor (`StudioWorkspace.tsx`)**:
   - Performs client-side image rendering to blend user silhouettes with premium couture garments.
   - Supports real-time adjustments (Hue, Saturation, Brightness, Background shifts) using direct HTML5 rendering coordinates.

3. **3D Interactive Mannequin (`ThreeAvatar.tsx`)**:
   - Uses WebGL standard vanilla Three.js inside custom React refs for robust multi-device rendering.
   - Incorporates hierarchical skeletal structures to animate Walking, Running, and Breathing (Idle) motions under adjustable lighting rigs.

4. **Conversational Stylist Director (`AIStylist.tsx`)**:
   - Connects to the server-side Gemini 3.5 Flash engine.
   - Provides tailored seasonal runway pairings, wedding recommendations, and garment coordinate advisory.

5. **Active AR Mirror (`ARMirror.tsx`)**:
   - Uses standard browser webcam feeds to overlay target alignment guides and real-time garment silhouettes.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Three.js, Lucide Icons.
- **Backend**: Node.js, Express, dotenv.
- **AI**: Google Gemini API SDK (`@google/genai`).
- **Build / Dev**: Vite, esbuild, tsx.
