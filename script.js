const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Using a CORS proxy to prevent the "Blocked by CORS policy" error
const PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_URL = 'https://clave-app.onrender.com/api/chat';

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Show user message in UI
    appendMessage('user', message);
    userInput.value = '';

    // 2. Add a "Thinking..." indicator
    const typingId = 'typing-' + Date.now();
    appendMessage('ai', '...', typingId);

    try {
        // NOTE: You must visit https://cors-anywhere.herokuapp.com/corsdemo 
        // and click "Request temporary access" for this proxy to work!
        const response = await fetch(PROXY + API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest' 
            },
            body: JSON.stringify({
                message: message,
                model: "gpt-4o",
                systemPrompt: "You are a helpful, high-end private AI assistant."
            })
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Data:", data); // Debugging: Check this in F12 Console

        // 3. Remove "Thinking..." and show actual response
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();

        // Clave API usually returns data in 'text' or 'response'
        const aiText = data.text || data.response || "I received an empty response.";
        appendMessage('ai', aiText);

    } catch (error) {
        console.error("Critical Error:", error);
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();
        
        appendMessage('ai', "Error: Check the console (F12) for details. It might be a CORS or Server issue.");
    }
}

function appendMessage(sender, text, id = null) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    if (id) msgDiv.id = id;
    msgDiv.innerText = text;
    chatLog.appendChild(msgDiv);
    
    // Auto-scroll to bottom
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
