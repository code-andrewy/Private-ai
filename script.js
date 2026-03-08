// --- 1. Setup and Variables ---
// We grab your saved chats, or start an empty list if there are none
let chats = JSON.parse(localStorage.getItem('ai_chats')) || [];
let currentChatId = Date.now();

// Getting all our HTML elements
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const historyList = document.getElementById('history-list');
const fileInput = document.getElementById('file-upload');
const previewWrapper = document.getElementById('image-preview-wrapper');
const imagePreview = document.getElementById('image-preview');
const removeImgBtn = document.getElementById('remove-img-btn');

// Load history when the page first opens
renderHistory();

// --- 2. Image Preview Logic ---
// This shows the image on the screen right after you pick a file
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

// The "X" button to remove the picture you just picked
removeImgBtn.addEventListener('click', () => {
    fileInput.value = ''; 
    previewWrapper.style.display = 'none'; 
});

// --- 3. Main Chat Logic ---
async function handleChat() {
    const text = userInput.value.trim();
    const file = fileInput.files[0];

    // Stop and do nothing if the user didn't type or attach anything
    if (!text && !file) return;

    // Build the user's message
    let userContent = '';
    if (file) {
        // Attach the image if one was uploaded
        userContent += `<img src="${imagePreview.src}" style="max-width: 200px; border-radius: 12px; margin-bottom: 10px;"><br>`;
    }
    if (text) {
        userContent += text;
    }

    // Put user message on screen
    addBubble('user', userContent, true);
    
    // Clear the typing box and image preview so it's ready for the next message
    userInput.value = '';
    fileInput.value = '';
    previewWrapper.style.display = 'none';

    // Show the "Thinking" bouncing dots
    const aiBubble = addBubble('ai', '<div class="loading-dots"><span></span><span></span><span></span></div>', true);

    try {
        const lowerText = text.toLowerCase();
        
        // Check if the user is asking the AI to draw an image
        const isImageRequest = lowerText.includes("draw") || lowerText.includes("generate an image");

        if (isImageRequest) {
            // Image Generation Mode
            const seed = Math.floor(Math.random() * 10000);
            // Remove the word "draw" so the AI just gets the subject (like "a dog")
            const prompt = encodeURIComponent(text.toLowerCase().replace('draw', '').trim());
            const imgUrl = `https://image.pollinations.ai/prompt/${prompt}?seed=${seed}&width=512&height=512&nologo=true`;
            
            aiBubble.innerHTML = `Here is what I created:<br><br><img src="${imgUrl}" style="max-width: 100%; border-radius: 12px;">`;
        } else {
            // Standard Text Chat Mode
            const query = encodeURIComponent(text);
            const response = await fetch(`https://gen.pollinations.ai/text/${query}?model=openai&cache=false`);
            
            if (!response.ok) throw new Error("Network issues");
            const aiText = await response.text();
            
            // Swap out line breaks for HTML breaks so paragraphs look nice
            aiBubble.innerHTML = aiText.replace(/\n/g, '<br>');
        }

        // Save the chat after the AI answers successfully
        saveCurrentChat();

    } catch (err) {
        // If the internet drops or the API fails
        aiBubble.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Connection failed. Try again.';
        aiBubble.style.background = "rgba(255, 75, 75, 0.4)";
    }

    scrollToBottom();
}

// --- 4. Helper Functions ---
// Makes the actual chat bubble on the screen
function addBubble(sender, content, isHTML = false) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    if (isHTML) {
        div.innerHTML = content;
    } else {
        div.innerText = content;
    }
    chatLog.appendChild(div);
    scrollToBottom();
    return div;
}

// Forces the chat box to scroll down to the newest message
function scrollToBottom() {
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
}

// --- 5. Saving and History ---
function saveCurrentChat() {
    // Don't save empty chats
    if (chatLog.children.length === 0) return;

    // Grab the first user message to use as the title in the sidebar
    let title = "New Chat";
    const firstUserMsg = chatLog.querySelector('.user');
    if (firstUserMsg) {
        // Slice the text so it's short, and trim any blank spaces
        title = firstUserMsg.innerText.substring(0, 25).trim() + "...";
    }

    const chatData = {
        id: currentChatId,
        title: title,
        html: chatLog.innerHTML
    };
    
    // Find if we are updating an old chat or making a new one
    const index = chats.findIndex(c => c.id === currentChatId);
    if (index > -1) {
        chats[index] = chatData;
    } else {
        chats.push(chatData);
    }
    
    // BUG FIX: Keep only the 15 most recent chats. Image data is heavy, 
    // and if we save too many, local storage will crash.
    if (chats.length > 15) {
        chats.shift(); // Removes the oldest chat at the start of the list
    }
    
    localStorage.setItem('ai_chats', JSON.stringify(chats));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    
    // Sort backwards so the newest chat is at the top of the sidebar
    const sortedChats = [...chats].reverse();
    
    sortedChats.forEach(chat => {
        const item = document.createElement('div');
        
        // BUG FIX: Add a special class if it's the chat we are currently looking at
        item.className = chat.id === currentChatId ? 'history-item active-chat' : 'history-item';
        
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
        renderHistory(); // Re-render to highlight the active chat in the sidebar
        scrollToBottom();
    }
}

// The "+" Button
document.getElementById('new-chat-btn').onclick = () => {
    currentChatId = Date.now();
    chatLog.innerHTML = '';
    
    // BUG FIX: Clear inputs when starting a new chat so old text/images don't carry over
    userInput.value = '';
    fileInput.value = '';
    previewWrapper.style.display = 'none';
    renderHistory(); 
};

// --- 6. Event Listeners ---
sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});
