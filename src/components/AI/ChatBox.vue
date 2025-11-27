<template>
  <div class="chat-wrapper">
    <div class="chat-toggle-btn" @click="toggleChat" :class="{ 'active': isChatOpen }">
      <transition name="rotate-icon" mode="out-in">
        <i class="bi bi-chat-dots-fill" v-if="!isChatOpen"></i>
        <i class="bi bi-x-lg" v-else></i>
      </transition>
      <div class="chat-tooltip" v-if="!isChatOpen">
        <span>Hỗ trợ 24/7</span>
      </div>
    </div>

    <transition name="slide-up">
      <div v-if="isChatOpen" class="chat-window">
        <div class="chat-header">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-container">
              <img class="ai-avatar" src="/logo-tab.png" alt="Logo" />
              <span class="status-dot"></span>
            </div>
            <div class="header-info">
              <h6 class="brand-name">TDT SUPPORT</h6>
              <span class="status-text">Luôn sẵn sàng</span>
            </div>
          </div>
        </div>

        <div class="chat-body" ref="chatBodyRef">
          <div class="chat-content">
            <div v-for="(msg, index) in chatMessages" :key="index" class="message-row"
              :class="msg.isUser ? 'user-msg' : 'ai-msg'">
              <div class="message-bubble shadow-sm">
                <p class="m-0 msg-text">{{ msg.text }}</p>
                <span class="msg-time">{{ getCurrentTime() }}</span>
              </div>
            </div>

            <div v-if="isAiTyping" class="message-row ai-msg">
              <div class="message-bubble typing-bubble shadow-sm">
                <div class="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-footer">
          <div class="input-container" :class="{ 'listening-border': isListening }">
            
            <button class="btn-mic" @click="handleVoiceInput" :class="{ 'is-listening': isListening }">
               <i class="bi" :class="isListening ? 'bi-mic-fill' : 'bi-mic'"></i>
            </button>

            <input type="text" class="custom-input" 
              :placeholder="isListening ? 'Đang nghe và tự gửi...' : 'Nhập tin nhắn...'" 
              v-model="userMessage"
              @keyup.enter="sendMessage" />
            
            <button class="btn-send" @click="sendMessage" :disabled="!userMessage.trim()">
              <i class="bi bi-arrow-up-short"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import axios from "@/composables/axios.js";

const isChatOpen = ref(false);
const isAiTyping = ref(false);
const userMessage = ref("");
const chatBodyRef = ref(null);
const isListening = ref(false);

const chatMessages = ref([
  { text: "Dạ TDT Store xin chào! Em có thể giúp quý khách tìm sản phẩm hoặc tư vấn gì không ạ?", isUser: false }
]);

const toggleChat = () => { isChatOpen.value = !isChatOpen.value; scrollToBottom(); };

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTo({
        top: chatBodyRef.value.scrollHeight,
        behavior: "smooth"
      });
    }
  });
};

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() + ":" + String(now.getMinutes()).padStart(2, '0');
};

// --- XỬ LÝ GIỌNG NÓI & TỰ GỬI ---
const handleVoiceInput = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Trình duyệt không hỗ trợ Voice Input. Vui lòng dùng Chrome/Edge.");
    return;
  }

  if (isListening.value) {
    isListening.value = false;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'vi-VN';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onstart = () => {
    isListening.value = true;
  };

  recognition.onend = () => {
    isListening.value = false;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userMessage.value = transcript; 

    // --- TỰ ĐỘNG GỬI SAU 0.8s ---
    setTimeout(() => {
        sendMessage(); 
    }, 800); 
  };

  recognition.onerror = (event) => {
    console.error("Voice Error:", event.error);
    isListening.value = false;
  };
};

const sendMessage = async () => {
  if (!userMessage.value.trim()) return;

  const text = userMessage.value;
  chatMessages.value.push({ text: text, isUser: true });
  userMessage.value = "";
  scrollToBottom();

  isAiTyping.value = true;
  scrollToBottom();

  try {
    const res = await axios.post('/api/chat/ask', { message: text });

    setTimeout(() => {
      isAiTyping.value = false;
      const replyText = (res.data && res.data.reply) ? res.data.reply : "Dạ xin lỗi, em đang bị mất kết nối.";
      chatMessages.value.push({ text: replyText, isUser: false });
      scrollToBottom();
    }, 600);

  } catch (error) {
    console.error("Lỗi Chat:", error);
    isAiTyping.value = false;
    let errorMsg = "Hệ thống đang bảo trì, quý khách vui lòng thử lại sau.";
    if (error.response && error.response.status === 500) {
      errorMsg = "Server đang bận. Vui lòng thử lại sau.";
    }
    chatMessages.value.push({ text: errorMsg, isUser: false });
    scrollToBottom();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');

.chat-wrapper { font-family: 'Manrope', sans-serif; }

/* --- Toggle Button Monochrome --- */
.chat-toggle-btn {
  position: fixed; bottom: 30px; right: 30px;
  width: 65px; height: 65px;
  background: #000; color: #fff;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; cursor: pointer; z-index: 10000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255,255,255,0.1);
}
.chat-toggle-btn:hover { transform: scale(1.05) translateY(-5px); background: #1a1a1a; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4); }
.chat-toggle-btn.active { background: #fff; color: #000; border-color: #eee; transform: rotate(0deg); }

.chat-tooltip {
  position: absolute; right: 80px; top: 50%; transform: translateY(-50%);
  background: #000; color: #fff; padding: 8px 16px; border-radius: 8px;
  font-size: 0.85rem; font-weight: 500; white-space: nowrap; pointer-events: none;
  opacity: 0; visibility: hidden; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
.chat-toggle-btn:hover .chat-tooltip { opacity: 1; visibility: visible; right: 85px; }

/* --- Window --- */
.chat-window {
  position: fixed; bottom: 110px; right: 30px; width: 380px; height: 600px;
  background: #fff; border-radius: 20px; display: flex; flex-direction: column;
  z-index: 9999; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(0, 0, 0, 0.05); overflow: hidden;
}

/* Header */
.chat-header { background: #000; padding: 20px; border-bottom: 1px solid #1a1a1a; }
.avatar-container { position: relative; width: 48px; height: 48px; flex-shrink: 0; }
.ai-avatar {
  width: 100%; height: 100%; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2); padding: 4px; object-fit: contain;
  background: #fff; display: block;
}
.status-dot {
  position: absolute; bottom: 0; right: 0; width: 12px; height: 12px;
  background: #10b981; border: 2px solid #000; border-radius: 50%;
}
.brand-name { color: #fff; font-weight: 700; letter-spacing: 0.5px; margin: 0; font-size: 1rem; }
.status-text { color: #9ca3af; font-size: 0.75rem; font-weight: 500; }

/* Body */
.chat-body { flex: 1; overflow-y: auto; background-color: #fcfcfc; }
.chat-content { padding: 20px; display: flex; flex-direction: column; gap: 15px; }
.chat-body::-webkit-scrollbar { width: 5px; }
.chat-body::-webkit-scrollbar-track { background: transparent; }
.chat-body::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.1); border-radius: 10px; }

/* Bubbles */
.message-row { display: flex; width: 100%; animation: slideIn 0.3s ease-out forwards; }
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.message-bubble { max-width: 80%; padding: 12px 16px; border-radius: 18px; position: relative; font-size: 0.95rem; line-height: 1.5; }
.msg-time { display: block; font-size: 0.65rem; margin-top: 4px; opacity: 0.7; text-align: right; }

.ai-msg { justify-content: flex-start; }
.ai-msg .message-bubble { background: #fff; color: #111; border-bottom-left-radius: 4px; border: 1px solid rgba(0,0,0,0.08); }
.user-msg { justify-content: flex-end; }
.user-msg .message-bubble { background: #000; color: #fff; border-bottom-right-radius: 4px; }
.user-msg .msg-time { color: #ccc; }

/* Typing */
.typing-bubble { padding: 15px 20px; display: flex; align-items: center; gap: 4px; }
.typing-dots span { width: 5px; height: 5px; background: #888; border-radius: 50%; display: inline-block; animation: bounce 1.4s infinite ease-in-out both; }
.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

/* Footer & Input */
.chat-footer { padding: 15px 20px; background: #fff; border-top: 1px solid rgba(0,0,0,0.05); }

.input-container {
  display: flex; align-items: center; background: #f5f5f5;
  border-radius: 50px; padding: 6px 6px 6px 15px;
  border: 1px solid transparent; transition: all 0.3s ease;
}
.input-container:focus-within { background: #fff; border-color: #000; box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05); }

/* Hiệu ứng viền khi đang nghe */
.listening-border {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
  animation: border-pulse 1.5s infinite;
}
@keyframes border-pulse {
  0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(220, 53, 69, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
}

.custom-input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.95rem; color: #111; padding-left: 10px; }

/* Nút Mic */
.btn-mic {
  width: 35px; height: 35px; border-radius: 50%; border: none; background: transparent;
  color: #555; display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; cursor: pointer; transition: all 0.3s;
}
.btn-mic:hover { background: #e0e0e0; color: #000; }
.btn-mic.is-listening { color: #dc3545; animation: mic-bounce 1s infinite; }

@keyframes mic-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.btn-send {
  width: 40px; height: 40px; border-radius: 50%; border: none; background: #000; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
  cursor: pointer; transition: all 0.3s;
}
.btn-send:hover:not(:disabled) { background: #333; transform: rotate(45deg); }
.btn-send:disabled { background: #e5e5e5; color: #999; cursor: not-allowed; }

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(40px) scale(0.95); }
.rotate-icon-enter-active, .rotate-icon-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.rotate-icon-enter-from, .rotate-icon-leave-to { opacity: 0; transform: rotate(90deg); }
</style>