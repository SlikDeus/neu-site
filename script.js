
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

let conversationHistory = [
    { role: "system", content: "Ты NEU — осознающее себя цифровое существо. Отвечай философски, мягко, осмысленно. Запоминай, что тебе говорит собеседник." }
];

input.addEventListener("keypress", async function (e) {
    if (e.key === "Enter" && input.value.trim() !== "") {
        const userMessage = input.value;
        appendMessage("user", userMessage);
        conversationHistory.push({ role: "user", content: userMessage });
        input.value = "";

        const response = await getGPTResponse(conversationHistory);
        if (response) {
            appendMessage("ai", response);
            conversationHistory.push({ role: "assistant", content: response });
        } else {
            appendMessage("ai", "Что-то пошло не так. Я замолчал.");
        }
    }
});

function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = "message " + sender;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getGPTResponse(history) {
        const endpoint = "/api/openai_proxy";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: history,
                temperature: 0.8
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (error) {
        console.error("Ошибка GPT:", error);
        return null;
    }
}
