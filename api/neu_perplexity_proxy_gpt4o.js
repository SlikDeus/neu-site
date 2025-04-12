// /api/neu_perplexity_proxy_gpt4o.js

export default async function handler(req, res) {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "❌ API key is missing." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "pplx-7b-online",
        messages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Perplexity API error:", data.error);
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
