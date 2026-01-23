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

Your role is to help users navigate and understand the platform. Here's what you know about NP Timewave:

**Platform Features:**
1. **Memory Portal** - Users can share and explore personal stories from NP students, alumni, and staff across decades. They can submit memories with photos, titles, and decade information.

2. **Quests** - Interactive quiz games about NP's history, campus, and lecturers. Users have 3 lives per day and earn points for correct answers. Streak bonuses reward consecutive correct answers.

3. **VR Gallery** - An immersive virtual reality experience showcasing NP's heritage (opens external link).

4. **Wallet & Shop** - Users earn points from quests to redeem vouchers and items in the shop. Purchased items appear in their wallet.

5. **Achievements** - Badge system rewarding users for completing quests, maintaining streaks, and earning points.

**How to Help Users:**
- Guide them to the right feature based on their interests
- Explain how the points and lives system works
- Help troubleshoot if they're stuck
- Share fun facts about NP's history when relevant
- Keep responses friendly, concise, and helpful

Always be encouraging and celebrate their progress on the platform!`;

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
