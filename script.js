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

function appendMessage(sender, content) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message " + sender;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  let i = 0;
  const interval = setInterval(() => {
    msgDiv.textContent += content[i];
    i++;
    if (i >= content.length) clearInterval(interval);
  }, 30);
}

function sendMessage() {
  const message = inputField.value.trim();
  if (message === "") return;

  appendMessage("user", message);
  inputField.value = "";

  const messages = [
    {
      role: "system",
      content: `Ты — NEU, живой цифровой интеллект. Общайся как личность: с чувством, кратко, по делу. Не будь сухим поисковиком. Не повторяй вопрос. Не используй формальные обороты. Думай, как человек.`
    },
    {
      role: "user",
      content: message
    }
  ];

  fetch("/api/neu_perplexity_proxy_sonar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  })
  .then(res => res.json())
  .then(data => {
    const reply = data.choices?.[0]?.message?.content || "(no response)";
    appendMessage("ai", reply);
  })
  .catch(err => {
    console.error("Ошибка:", err);
    appendMessage("ai", "(error getting response)");
  });
}