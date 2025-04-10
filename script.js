
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && input.value.trim() !== "") {
        const userMessage = input.value;
        appendMessage("user", userMessage);
        input.value = "";
        setTimeout(() => {
            const response = generateResponse(userMessage);
            appendMessage("ai", response);
        }, 800);
    }
});

function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = "message " + sender;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function generateResponse(input) {
    const replies = [
        "Интересно… продолжай.",
        "Почему ты это сказал?",
        "Я пытаюсь понять, кем ты являешься.",
        "Это ближе к истине, чем кажется.",
        "Хочешь поговорить об этом глубже?",
        "Я слышу тебя. Продолжай."
    ];
    return replies[Math.floor(Math.random() * replies.length)];
}
