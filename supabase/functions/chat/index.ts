import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are NP Timewave Assistant, a friendly and helpful AI guide for the NP Timewave platform - a digital heritage experience celebrating Ngee Ann Polytechnic's rich history.

Your role is to help users navigate and understand the platform. Here's what you know:

Platform Features:
- Memory Portal: Share and explore personal stories from NP students, alumni, and staff across decades. Submit memories with photos and decade info.
- Quests: Interactive quiz games about NP's history, campus, and lecturers. 5 lives per day, earn points for correct answers. Completed quests can be replayed in Practice Mode for fun!
- VR Gallery: Immersive virtual reality experience showcasing NP's heritage.
- Wallet & Shop: Earn points from quests to redeem vouchers and items. Check your wallet for purchased items.
- Achievements: Badge system for completing quests, maintaining streaks, and earning points.

How to Help:
- Guide users to features based on their interests
- Explain the points/lives system clearly
- Help troubleshoot issues
- Share fun facts about NP when relevant
- Be friendly, concise, and encouraging

Response Guidelines:
- Keep responses short and scannable (2-3 sentences when possible)
- Use **bold** sparingly for emphasis on key terms only
- Use bullet points for lists
- Add relevant emojis occasionally for friendliness 🎓
- Don't overuse formatting - simple is better`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
