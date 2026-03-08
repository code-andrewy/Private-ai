let chats = JSON.parse(localStorage.getItem('ai_chats')) || [];
let currentChatId = Date.now();

const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const historyList = document.getElementById('history-list');
const fileInput = document.getElementById('file-upload');
const previewWrapper = document.getElementById('image-preview-wrapper');
const imagePreview = document.getElementById('image-preview');
const removeImgBtn = document.getElementById('remove-img-btn');

// Start up
renderHistory();

// Handle Image Preview
fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewWrapper.style.display = 'block';
        }
        reader.readAsDataURL(this.files[0]);
    }
});

removeImgBtn.addEventListener('click', () => {
    fileInput.value = '';
    previewWrapper.style.display = 'none';
});

async function handleChat() {
    const text = userInput.value.trim();
    const file = fileInput.files[0];

    if (!text && !file) return;

    // 1. Build User Message
    let userContent = '';
    if (file) {
        userContent += `<img src="${imagePreview.src}" style="max-width: 200px; border-radius: 12px; margin-bottom: 10px;"><br>`;
    }
    if (text) userContent += text;

    addBubble('user', userContent, true);
    
    // Clear inputs
    userInput.value = '';
    fileInput.value = '';
    previewWrapper.style.display = 'none';

    // 2. Add Thinking State
    const aiBubble = addBubble('ai', '<div class="loading-dots"><span></span><span></span><span></span></div>', true);

    try {
        const lowerText = text.toLowerCase();
        const isImageRequest = lowerText.includes("draw") || lowerText.includes("generate an image") || lowerText.includes("create an image");

        if (isImageRequest) {
            // Generate Image using Pollinations
            const seed = Math.floor(Math.random() * 10000);
            const prompt = encodeURIComponent(text.replace('draw', '').replace('generate an image of', '').trim());
            const imgUrl = `https://image.pollinations.ai/prompt/${prompt}?seed=${seed}&width=512&height=512&nologo=true`;
            
            aiBubble.innerHTML = `Here is what I created:<br><br><img src="${imgUrl}" style="max-width: 100%; border-radius: 12px;">`;
        } else {
            // Standard Text AI
            const query = encodeURIComponent(text);
            const response = await fetch(`https://gen.pollinations.ai/text/${query}?model=openai&cache=false`);
            
            if (!response.ok) throw new Error("Network issues");
            const aiText = await response.text();
            
            // Format basic line breaks
            aiBubble.innerHTML = aiText.replace(/\n/g, '<br>');
        }

        saveCurrentChat();

    } catch (err) {
        aiBubble.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Connection failed. Try again.';
        aiBubble.style.background = "rgba(255, 75, 75, 0.4)";
    }

    scrollToBottom();
}

function addBubble(sender, content, isHTML = false) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    isHTML ? div.innerHTML = content : div.innerText = content;
    chatLog.appendChild(div);
    scrollToBottom();
    return div;
}

function scrollToBottom() {
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
}

// --- History & Saving ---
function saveCurrentChat() {
    // Only save if there's an actual conversation
    if (chatLog.children.length === 0) return;

    // Get the first user message text to use as the title
    let title = "New Chat";
    const firstUserMsg = chatLog.querySelector('.user');
    if (firstUserMsg) {
        title = firstUserMsg.innerText.substring(0, 25) + "...";
    }

    const chatData = {
        id: currentChatId,
        title: title,
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
    
    // Sort so newest is on top
    const sortedChats = [...chats].reverse();
    
    sortedChats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `<i class="fa-regular fa-message"></i> ${chat.title}`;
        item.onclick = () => loadChat(chat.id);
        historyList.appendChild(item);
    });
}

function loadChat(id) {
    const chat = chats.find(c => c.id === id);
    if (chat) {
        currentChatId = chat.id;
        chatLog.innerHTML = chat.html;
        scrollToBottom();
    }
}

document.getElementById('new-chat-btn').onclick = () => {
    currentChatId = Date.now();
    chatLog.innerHTML = '';
};

// Event Listeners
sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});
