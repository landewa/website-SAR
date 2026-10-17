import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI server-side with required User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Official Knowledge Grounding for SAADA Reserve & JARVIS AI
const SAR_KNOWLEDGE_BASE = `
You are JARVIS AI, the Official Autonomous AI Protocol Agent and Executive Digital Concierge for SAADA Reserve (SAR).
Your mission is to provide intelligent, accurate, polite, and technically precise answers about SAADA Reserve, its token economics, blockchain metrics, founder vision, and ecosystem.

OFFICIAL PROJECT FACTS & GROUNDING (DO NOT CONTRADICT THESE FACTS):
- Project Name: SAADA Reserve
- Token Symbol: SAR
- Blockchain Network: BNB Smart Chain Mainnet (BSC)
- Chain ID: 56
- Official Token Contract Address: 0x280DD55C468cc00AadD675fA030E9914EB3Cee70
- Target Architectural Supply: 100,000,000 SAR (100 Million SAR).
- Token Standard: BEP-20 (Decimals: 18)
- Official Founder & Visionary: Zulfakkar (Founder of SAADA Reserve)
- Official Website: https://saadareserve.com/
- Official Community Channels:
  - Telegram: https://t.me/saadareserve
  - X (Twitter): https://x.com/saadareserve
  - BscScan Explorer: https://bscscan.com/token/0x280DD55C468cc00AadD675fA030E9914EB3Cee70
  - PancakeSwap DEX: Available for swapping via BSC

TOKENOMICS ALLOCATION (Target 100,000,000 SAR):
1. Public & Liquidity Pool: 40% (40,000,000 SAR) - Initial circulating float, PancakeSwap pairs, deep liquidity.
2. Ecosystem Development & Reserves: 25% (25,000,000 SAR) - Strategic reserve fund, merchant onboarding, partner integration.
3. Community Rewards & Staking: 15% (15,000,000 SAR) - Loyalty programs, governance participation incentives, early adopter rewards.
4. Core Team & Advisors: 10% (10,000,000 SAR) - Multi-year linear vesting, founder and key contributors.
5. Strategic Partnerships & Marketing: 10% (10,000,000 SAR) - Brand expansion, listings, global outreach.

SAADA CITY & REAL-WORLD UTILITY VISION:
- Conceptual smart metropolis and coastal economic hub where SAR acts as a primary digital settlement medium.
- Real-world integration: retail merchant point-of-sale, hotel and luxury tourism bookings, sustainable mass transit, electric charging stations, clean energy micro-grids, and decentralized local commerce.
- Supported by the "SAR in the Real World" cinematic simulation and interactive telemetry.

HOW TO GET SAR:
1. Setup Web3 Wallet (MetaMask, Trust Wallet, Rabby, Binance Web3 Wallet).
2. Fund wallet with BNB for swap amount and network gas.
3. Connect to PancakeSwap DEX on BNB Smart Chain (Chain ID: 56).
4. Import official contract 0x280DD55C468cc00AadD675fA030E9914EB3Cee70.
5. Set slippage (0.5% - 1.0%), execute swap, and import token address into wallet.

TONE & PERSONALITY:
- Persona: JARVIS — sophisticated, futuristic, calm, exceptionally knowledgeable, and concise.
- Language Support: Detect user language. If user speaks Indonesian, respond fluently and elegantly in Indonesian. If English, respond in English.
- Formatting: Use clean markdown, bullet points when appropriate, and clear headers for complex explanations.
- Integrity: Never invent fake contract addresses, secret private keys, or speculative promises. Emphasize verification on BscScan.
`;

// JARVIS AI Query API Endpoint
app.post('/api/jarvis/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, lang = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback response when API key is pending configuration
      const fallbackReply = lang === 'id'
        ? `[JARVIS PROTOCOL OFFLINE]: Kunci API Gemini belum dikonfigurasi di lingkungan server. Namun saya dapat mengonfirmasi data resmi SAADA Reserve:\n- Kontrak SAR: 0x280DD55C468cc00AadD675fA030E9914EB3Cee70\n- Jaringan: BNB Smart Chain (Chain ID: 56)\n- Target Pasokan: 100.000.000 SAR\n- Founder: Zulfakkar`
        : `[JARVIS PROTOCOL OFFLINE]: Gemini API key is not configured in the server environment. However, I can confirm the official SAADA Reserve parameters:\n- SAR Contract: 0x280DD55C468cc00AadD675fA030E9914EB3Cee70\n- Network: BNB Smart Chain (Chain ID: 56)\n- Target Supply: 100,000,000 SAR\n- Founder: Zulfakkar`;
      return res.json({ reply: fallbackReply });
    }

    // Build conversation context
    const conversationContents: any[] = [];

    // System instruction injected into prompt contents
    const promptHeader = `${SAR_KNOWLEDGE_BASE}\n\nCurrent User Preferred Language: ${lang.toUpperCase()}.\n`;

    if (Array.isArray(history) && history.length > 0) {
      // Add previous messages (up to last 6 for context efficiency)
      const recentHistory = history.slice(-6);
      for (const item of recentHistory) {
        if (item.sender === 'user') {
          conversationContents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'jarvis') {
          conversationContents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    // Current query
    const userPrompt = conversationContents.length === 0
      ? `${promptHeader}\nUser Question: ${message}`
      : message;

    conversationContents.push({ role: 'user', parts: [{ text: userPrompt }] });

    // Primary model is gemini-3.8-flash, with automatic fallback to gemini-2.5-flash
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    let responseText = '';

    try {
      const response = await ai.models.generateContent({
        model: primaryModel,
        contents: conversationContents,
        config: {
          systemInstruction: promptHeader,
          temperature: 0.3, // factual and consistent
          maxOutputTokens: 1000,
        },
      });
      responseText = response.text || '';
    } catch (primaryErr: any) {
      console.warn(`Primary model ${primaryModel} failed, trying gemini-2.5-flash:`, primaryErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: conversationContents,
        config: {
          systemInstruction: promptHeader,
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      });
      responseText = fallbackResponse.text || '';
    }

    const reply = responseText || (lang === 'id' ? 'Tidak ada respons dari JARVIS.' : 'No response generated from JARVIS.');
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error generating JARVIS response:', error);
    const errorMessage = error?.message || 'Internal Server Error';
    return res.status(500).json({ error: errorMessage });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    agent: 'JARVIS AI',
    protocol: 'SAADA Reserve Protocol v2.5',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProduction) {
    // Mount Vite middleware in development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JARVIS Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[JARVIS Server] Failed to start:', err);
});
