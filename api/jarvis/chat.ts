import { GoogleGenAI } from '@google/genai';

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

export default async function handler(req: any, res: any) {
  // CORS & headers
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { message, history, lang = 'en' } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallbackReply =
        lang === 'id'
          ? `[JARVIS PROTOCOL OFFLINE]: Kunci API Gemini belum dikonfigurasi di dashboard Vercel (Environment Variables). Namun saya dapat mengonfirmasi data resmi SAADA Reserve:\n- Kontrak SAR: 0x280DD55C468cc00AadD675fA030E9914EB3Cee70\n- Jaringan: BNB Smart Chain (Chain ID: 56)\n- Target Pasokan: 100.000.000 SAR\n- Founder: Zulfakkar`
          : `[JARVIS PROTOCOL OFFLINE]: Gemini API key is not configured in the Vercel dashboard (Environment Variables). However, I can confirm the official SAADA Reserve parameters:\n- SAR Contract: 0x280DD55C468cc00AadD675fA030E9914EB3Cee70\n- Network: BNB Smart Chain (Chain ID: 56)\n- Target Supply: 100,000,000 SAR\n- Founder: Zulfakkar`;
      return res.status(200).json({ reply: fallbackReply });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build conversation context
    const conversationContents: any[] = [];
    const promptHeader = `${SAR_KNOWLEDGE_BASE}\n\nCurrent User Preferred Language: ${lang.toUpperCase()}.\n`;

    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const item of recentHistory) {
        if (item.sender === 'user') {
          conversationContents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'jarvis') {
          conversationContents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    const userPrompt =
      conversationContents.length === 0 ? `${promptHeader}\nUser Question: ${message}` : message;

    conversationContents.push({ role: 'user', parts: [{ text: userPrompt }] });

    // Primary model is gemini-3.8-flash, with automatic fallback to gemini-2.5-flash for universal compatibility
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    let responseText = '';

    try {
      const response = await ai.models.generateContent({
        model: primaryModel,
        contents: conversationContents,
        config: {
          systemInstruction: promptHeader,
          temperature: 0.3,
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

    const reply =
      responseText ||
      (lang === 'id' ? 'Tidak ada respons dari JARVIS.' : 'No response generated from JARVIS.');

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Error generating JARVIS response:', error);
    const errorMessage = error?.message || 'Internal Server Error';
    return res.status(500).json({ error: errorMessage });
  }
}
