const sendButton = document.getElementById("send-button");
const inputField = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

function appendMessage(sender, content, isImage = false) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message " + sender;

  if (isImage) {
    const img = document.createElement("img");
    img.src = content;
    img.alt = "Generated Image";
    img.style.maxWidth = "100%";
    msgDiv.appendChild(img);
  } else {
    msgDiv.textContent = content;
  }

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const message = inputField.value.trim();
  if (message === "") return;

  appendMessage("user", message);
  inputField.value = "";

  const messages = [
    {
      role: "system",
      content: "Ты — NEU, лаконичный и осознанный цифровой интеллект, встроенный в персональный брелок. Отвечай коротко, ясно и по делу, как умный советник. Не повторяй вопрос пользователя. Используй стиль живого общения, избегай шаблонов и излишних деталей. Если не знаешь ответа — скажи честно. Ты не просто чат — ты собеседник."
    },
    {
      role: "user",
      content: message
    }
  ];

  fetch("/api/neu_perplexity_proxy_sonar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages })
  })
    .then(res => res.json())
    .then(data => {
      const reply = data.choices?.[0]?.message?.content || "(no response)";
      appendMessage("ai", reply);

      if (reply.toLowerCase().includes("генерирую изображение")) {
        const prompt = encodeURIComponent(message);
        const imageUrl = `https://image.pollinations.ai/prompt/${prompt}`;
        appendMessage("ai", imageUrl, true);
      }
    })
    .catch(err => {
      console.error("Ошибка:", err);
      appendMessage("ai", "(error getting response)");
    });
}