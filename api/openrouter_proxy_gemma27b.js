
module.exports = async function handler(req, res) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY is missing.");
    return res.status(500).json({ error: "API key is missing." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    console.error("❌ Invalid messages format.");
    return res.status(400).json({ error: "Invalid messages format." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://neu-site-pearl.vercel.app",
        "X-Title": "NEU AI"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages,
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ OpenRouter API Error:", data.error);
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
