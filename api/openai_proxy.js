export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key is missing." });
  }

  // Обработка тела запроса
  let messages;
  try {
    messages = JSON.parse(req.body).messages;
  } catch (error) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.8
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
