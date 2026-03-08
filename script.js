const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Display user message
    appendMessage('user', message);
    userInput.value = '';

    try {
        const response = await fetch('https://clave-app.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                model: "gpt-4o",
                systemPrompt: "You are a helpful and concise AI assistant."
            })
        });

        const data = await response.json();
        appendMessage('ai', data.text);
    } catch (error) {
        appendMessage('ai', "Error connecting to the AI. Please try again.");
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
