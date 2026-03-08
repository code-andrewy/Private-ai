const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function handleChat() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    addBubble('user', text);
    userInput.value = '';

    // 2. Add Loading State
    const aiBubble = addBubble('ai', `
        <div class="loading-dots">
            <span></span><span></span><span></span>
        </div>
    `, true);

    try {
        // Updated URL to avoid the "Deprecation Notice" bug
        const query = encodeURIComponent(text);
        const response = await fetch(`https://text.pollinations.ai/${query}?model=openai&cache=false`);
        
        if (!response.ok) throw new Error("Network issues");

        const aiText = await response.text();

        // 3. Replace dots with actual answer
        aiBubble.innerHTML = aiText;

    } catch (err) {
        aiBubble.innerText = "Check your connection and try again!";
        aiBubble.style.background = "rgba(255, 75, 75, 0.4)"; // Red tint for errors
    }

    scrollToBottom();
}

function addBubble(sender, content, isHTML = false) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    
    if (isHTML) div.innerHTML = content;
    else div.innerText = content;

    chatLog.appendChild(div);
    scrollToBottom();
    return div;
}

function scrollToBottom() {
    chatLog.scrollTo({
        top: chatLog.scrollHeight,
        behavior: 'smooth'
    });
}

// Event Listeners
sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});
