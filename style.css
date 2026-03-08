:root {
  --accent-blue: #00d2ff;
  --accent-yellow: #ffd700;
  --glass: rgba(15, 20, 35, 0.72);
  --glass-light: rgba(255, 255, 255, 0.9); /* New for black text bubbles */
  --border: rgba(255, 255, 255, 0.12);
  --text: #ffffff;
  --text-dark: #000000;
  --muted: #cbd5e1;
  --bg-fallback: url('https://raw.githubusercontent.com/code-andrewy/jumpman64beta/refs/heads/main/charlie-brown-snoopy-stargazing-desktop-wallpaper-preview.jpg');
  --ease-smooth: cubic-bezier(0.23, 1, 0.32, 1);
  --card-radius: 40px;
  --glass-blur: 35px;
}

/* Full Center Layout */
body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)), var(--bg-fallback);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text);
  margin: 0;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 1100px;
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  backdrop-filter: blur(var(--glass-blur)) saturate(180%);
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  padding: 40px;
  box-shadow: 0 45px 100px rgba(0,0,0,.65);
}

@media (min-width: 850px) {
  .card { grid-template-columns: 300px 1fr; }
}

/* Chat Section */
.chat-section {
  display: flex;
  flex-direction: column;
  height: 500px;
}

#chat-log {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 10px;
}

/* Scrollbar Fix */
#chat-log::-webkit-scrollbar { width: 4px; }
#chat-log::-webkit-scrollbar-thumb { background: var(--accent-blue); border-radius: 10px; }

/* Message Bubbles */
.message {
  padding: 14px 20px;
  border-radius: 20px;
  font-size: 0.95rem;
  max-width: 85%;
  line-height: 1.5;
  animation: cardAppear 0.4s var(--ease-smooth);
}

.user {
  align-self: flex-end;
  background: var(--accent-blue);
  color: var(--text-dark); /* Black text for user */
  border-bottom-right-radius: 4px;
}

.ai {
  align-self: flex-start;
  background: var(--glass-light); /* Light glass for AI */
  color: var(--text-dark); /* Black text for AI */
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(0,0,0,0.1);
}

/* Input Area */
.input-area {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

#user-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 18px;
  color: #fff; /* White typing text for contrast */
  outline: none;
}

#send-btn {
  background: var(--accent-blue);
  color: var(--text-dark);
  border: none;
  padding: 0 20px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
}

/* Loading Animation */
.dots { display: flex; gap: 4px; }
.dots span {
  width: 6px; height: 6px;
  background: var(--text-dark);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}
.dots span:nth-child(1) { animation-delay: -0.32s; }
.dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes cardAppear {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
