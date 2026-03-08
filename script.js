let chats = JSON.parse(localStorage.getItem('ai_chats')) || [];
let currentChatId = Date.now();

const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const historyList = document.getElementById('history-list');

// Initialize
renderHistory();

async function handleChat() {
    const text = userInput.value.trim();
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (!text && !file) return;

    // 1. Show User Message (with Image if exists)
    let userContent = text;
    if (file) {
        const imgUrl = URL.createObjectURL(file);
        userContent = `<img src="${imgUrl}" class="uploaded-img"><br>${text}`;
    }
    addBubble('user', userContent, true);
    userInput.value = '';
    fileInput.value = ''; // Reset file input

    // 2. Add Thinking State
    const aiBubble = addBubble('ai', '<div class="loading-dots"><span></span><span></span><span></span></div>', true);

    try {
        // Pollinations supports image generation if you ask for it!
        // We check if the user wants an image
        const isImageRequest = text.toLowerCase().includes("draw") || text.toLowerCase().includes("generate image");
        
        let url = `https://gen.pollinations.ai/text/${encodeURIComponent(text)}?model=openai`;
        
        if (isImageRequest) {
            const seed = Math.floor(Math.random() * 1000000);
            aiBubble.innerHTML = `<img src="https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?seed=${seed}&width=512&height=512" class="uploaded-img">`;
        } else {
            const response = await fetch(url);
            const aiText = await response.text();
            aiBubble.innerHTML = aiText;
        }

        saveCurrentChat();

    } catch (err) {
        aiBubble.innerText = "Error connecting to AI.";
    }
}

function addBubble(sender, content, isHTML = false) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    isHTML ? div.innerHTML = content : div.innerText = content;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
    return div;
}

function saveCurrentChat() {
    const chatData = {
        id: currentChatId,
        title: chatLog.firstChild?.innerText.substring(0, 20) || "New Chat",
        html: chatLog.innerHTML
    };
    
    const index = chats.findIndex(c => c.id === currentChatId);
    if (index > -1) chats[index] = chatData;
    else chats.push(chatData);
    
    localStorage.setItem('ai_chats', JSON.stringify(chats));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerText = chat.title;
        item.onclick = () => loadChat(chat.id);
        historyList.appendChild(item);
    });
}

function loadChat(id) {
    const chat = chats.find(c => c.id === id);
    if (chat) {
        currentChatId = chat.id;
        chatLog.innerHTML = chat.html;
    }
}

document.getElementById('new-chat-btn').onclick = () => {
    currentChatId = Date.now();
    chatLog.innerHTML = '';
};

sendBtn.onclick = handleChat;
userInput.onkeypress = (e) => { if (e.key === 'Enter') handleChat(); };
