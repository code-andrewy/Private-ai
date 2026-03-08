const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function handleChat() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add User Bubble
    addBubble('user', text);
    userInput.value = '';

    // 2. Add Thinking Bubble
    const aiBubble = addBubble('ai', '<div class="dots"><span></span><span></span><span></span></div>', true);

    try {
        const query = encodeURIComponent(text);
        // Using Pollinations for "no-key" reliability
        const response = await fetch(`https://text.pollinations.ai/${query}?model=openai`);
        
        if (!response.ok) throw new Error('Offline');

        const aiText = await response.text();

        // 3. Update the exact bubble we created
        aiBubble.innerHTML = aiText;

    } catch (err) {
        aiBubble.innerText = "Error: Check your internet or try again later.";
        aiBubble.style.background = "rgba(255, 75, 75, 0.2)";
    }

    // Bug fix: Ensure scroll happens after content is added
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

// Listeners
sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});
