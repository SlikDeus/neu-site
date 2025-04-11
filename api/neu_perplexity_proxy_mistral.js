
module.exports = async function handler(req, res) {
  const PPLX_API_KEY = process.env.PERPLEXITY_API_KEY;

  if (!PPLX_API_KEY) {
    console.error("❌ PERPLEXITY_API_KEY is missing.");
    return res.status(500).json({ error: "API key is missing." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages." });
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PPLX_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct",
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
    return res.status(500).json({ error: "Internal server error." });
  }
};
