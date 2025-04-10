module.exports = async function handler(req, res) {
  console.log(">>> NEU API: Incoming request...");

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is missing.");
    return res.status(500).json({ error: "API key is missing." });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages } = req.body;

  console.log("✅ Received messages:", messages);

  if (!messages || !Array.isArray(messages)) {
    console.error("❌ Invalid messages format.");
    return res.status(400).json({ error: "Invalid messages format." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ OpenAI API Error:", data.error);
      return res.status(500).json({ error: data.error });
    }

    console.log("✅ GPT reply:", data.choices?.[0]?.message?.content);
    return res.status(200).json(data);

  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
