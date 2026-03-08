const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function handleChat() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    createBubble('user', text);
    userInput.value = '';

    // 2. Add "Thinking" Bubble
    const thinkingBubble = createBubble('ai', `
        <div class="typing">
            <span></span><span></span><span></span>
        </div>
    `, true);

    try {
        // Pollinations.ai is public and requires no key
        const query = encodeURIComponent(text);
        const response = await fetch(`https://text.pollinations.ai/${query}?model=openai`);

        if (!response.ok) throw new Error('API Timeout');

        const aiResponse = await response.text();

        // 3. Swap dots for real text
        thinkingBubble.innerHTML = aiResponse;

    } catch (err) {
        thinkingBubble.innerHTML = "<span style='color:#ff4b4b'>Connection lost. Please try again.</span>";
    }
    
    // Auto-scroll
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
}

function createBubble(sender, content, isHTML = false) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    
    if (isHTML) {
        div.innerHTML = content;
    } else {
        div.innerText = content;
    }
    
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
    return div;
}

// Listeners
sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});

// Subtle Mouse Glow effect (matches your card style)
document.addEventListener('mousemove', e => {
    const card = document.querySelector('.card');
    if(card) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    }
});
