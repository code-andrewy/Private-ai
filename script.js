// --- 1. Setup & Variables ---
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

renderHistory();

// --- 2. Image Handling Logic ---
fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewWrapper.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    }
});

removeImgBtn.onclick = () => {
    fileInput.value = '';
    previewWrapper.style.display = 'none';
};

// --- 3. Main AI Logic ---
async function handleChat() {
    const text = userInput.value.trim();
    const hasImage = previewWrapper.style.display === 'block';
    const imageData = hasImage ? imagePreview.src : null;

    if (!text && !hasImage) return;

    // Build User Bubble
    let userHTML = hasImage ? `<img src="${imageData}" class="uploaded-img"><br>` : '';
    userHTML += text;
    addBubble('user', userHTML, true);

    // Reset Inputs
    userInput.value = '';
    fileInput.value = '';
    previewWrapper.style.display = 'none';

    // Thinking State
    const aiBubble = addBubble('ai', '<div class="loading-dots"><span></span><span></span><span></span></div>', true);

    try {
        const isImageRequest = text.toLowerCase().includes("draw") || text.toLowerCase().includes("generate");

        if (isImageRequest) {
            // Image Generation
            const prompt = encodeURIComponent(text.replace(/draw|generate/g, '').trim());
            const seed = Math.floor(Math.random() * 10000);
            const imgUrl = `https://image.pollinations.ai/prompt/${prompt}?seed=${seed}&width=512&height=512&nologo=true`;
            aiBubble.innerHTML = `Done!<br><img src="${imgUrl}" class="uploaded-img" style="margin-top:10px">`;
        } else {
            // Text Generation (Updated to 'gen' endpoint to fix bugs)
            const response = await fetch(`https://gen.pollinations.ai/text/${encodeURIComponent(text)}?model=openai&cache=false`);
            if (!response.ok) throw new Error();
            
            const aiText = await response.text();
            aiBubble.innerHTML = aiText.replace(/\n/g, '<br>');
        }
        saveCurrentChat();
    } catch (err) {
        aiBubble.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Connection failed. Pollinations might be busy!';
        aiBubble.style.background = "rgba(255, 75, 75, 0.3)";
    }
    scrollToBottom();
}

// --- 4. UI Helpers ---
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

// --- 5. Storage & History ---
function saveCurrentChat() {
    if (chatLog.children.length === 0) return;

    const firstMsg = chatLog.querySelector('.user')?.innerText || "New Chat";
    const chatData = {
        id: currentChatId,
        title: firstMsg.substring(0, 25) + "...",
        html: chatLog.innerHTML
    };

    const index = chats.findIndex(c => c.id === currentChatId);
    index > -1 ? chats[index] = chatData : chats.push(chatData);

    // Limit to 15 chats to prevent localStorage crashes
    if (chats.length > 15) chats.shift();

    localStorage.setItem('ai_chats', JSON.stringify(chats));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    [...chats].reverse().forEach(chat => {
        const item = document.createElement('div');
        item.className = `history-item ${chat.id === currentChatId ? 'active-chat' : ''}`;
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
        renderHistory();
        scrollToBottom();
    }
}

document.getElementById('new-chat-btn').onclick = () => {
    currentChatId = Date.now();
    chatLog.innerHTML = '';
    renderHistory();
};

sendBtn.onclick = handleChat;
userInput.onkeypress = (e) => { if (e.key === 'Enter') handleChat(); };
