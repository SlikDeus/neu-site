
module.exports = async function handler(req, res) {
  const PPLX_API_KEY = process.env.PERPLEXITY_API_KEY;

  if (!PPLX_API_KEY) {
    return res.status(500).json({ error: "API key is missing." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages } = req.body;

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PPLX_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "pplx-7b-chat", // Модель Sonar (рабочая версия Perplexity)
        messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
