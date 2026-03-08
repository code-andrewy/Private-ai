const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Show user message
    appendMessage('user', message);
    userInput.value = '';

    // 2. Create AI thinking bubble
    const aiBubble = appendMessage('ai', '...');

    try {
        // Pollinations 'text' endpoint is a simple GET request
        // Parameters: model=openai (default), system=instructions
        const systemPrompt = encodeURIComponent("You are a helpful, premium AI assistant.");
        const userPrompt = encodeURIComponent(message);
        
        const url = `https://text.pollinations.ai/${userPrompt}?system=${systemPrompt}&model=openai`;

        const response = await fetch(url);

        if (!response.ok) throw new Error('Network response was not ok');

        // This API returns the response as plain text, not JSON!
        const aiText = await response.text();
        
        // 3. Update the thinking bubble with the real answer
        aiBubble.innerText = aiText;

    } catch (error) {
        console.error("AI Error:", error);
        aiBubble.innerText = "Error: Could not connect to the AI. Check your internet connection.";
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatLog.appendChild(msgDiv);
    
    // Auto-scroll to the bottom
    chatLog.scrollTop = chatLog.scrollHeight;
    return msgDiv;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
