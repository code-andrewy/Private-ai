const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Using a more stable proxy that doesn't require a "click to activate" page
const PROXY = 'https://api.allorigins.win/raw?url=';
const API_URL = 'https://clave-app.onrender.com/api/chat';

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    userInput.value = '';

    // Create placeholder for AI response
    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.classList.add('message', 'ai');
    aiMessageDiv.innerText = '...';
    chatLog.appendChild(aiMessageDiv);

    try {
        const response = await fetch(PROXY + encodeURIComponent(API_URL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                model: "gpt-4o"
            })
        });

        if (!response.ok) throw new Error('API is down or busy');

        const data = await response.json();
        
        // Final fallback: check for any possible text field the API might return
        const finalContent = data.text || data.response || data.output || "No response received.";
        aiMessageDiv.innerText = finalContent;

    } catch (error) {
        console.error("Error:", error);
        aiMessageDiv.innerText = "Error: API might be sleeping. Try again in 30 seconds.";
    }
    
    chatLog.scrollTop = chatLog.scrollHeight;
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
