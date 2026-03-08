const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Show user message
    appendMessage('user', text);
    userInput.value = '';

    // Create a "Thinking..." bubble
    const aiBubble = appendMessage('ai', '...');

    try {
        // Use a more direct proxy to bypass CORS
        const url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://clave-app.onrender.com/api/chat');

        const response = await fetch(url, {
            method: 'POST',
            // Note: When using this proxy, we send data as a string
            body: JSON.stringify({
                message: text,
                model: "gpt-4o",
                systemPrompt: "You are a private AI assistant."
            })
        });

        // The proxy wraps the response in a 'contents' string
        const result = await response.json();
        const data = JSON.parse(result.contents);

        if (data.text) {
            aiBubble.innerText = data.text;
        } else {
            aiBubble.innerText = "The AI is awake, but didn't send text back.";
        }

    } catch (error) {
        console.error("Debug Info:", error);
        aiBubble.innerText = "Connection failed. The API might be sleeping—try again in a moment.";
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    return msgDiv; // Return the div so we can update it later
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
