const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add User Bubble
    addBubble('user', text);
    userInput.value = '';

    // 2. Add Loading Bubble
    const aiBubble = addBubble('ai', '<div class="typing-dots"><span></span><span></span><span></span></div>', true);

    try {
        // Fix: Switched to gen.pollinations.ai to remove the notice bug
        const query = encodeURIComponent(text);
        const url = `https://gen.pollinations.ai/text/${query}?model=openai`;

        const response = await fetch(url);
        if (!response.ok) throw new Error();

        const aiResponse = await response.text();
        
        // 3. Update the exact bubble we made
        aiBubble.innerHTML = aiResponse;

    } catch (error) {
        aiBubble.innerText = "Check your connection and try again!";
        aiBubble.style.background = "rgba(255, 75, 75, 0.3)";
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
    chatLog.scrollTop = chatLog.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
