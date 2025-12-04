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
                <p class="m-0 msg-text" style="white-space: pre-line;">{{ msg.text }}</p>

                <div v-if="msg.products && msg.products.length > 0" class="product-list-container">
                  <div v-for="prod in msg.products" :key="prod.id" class="mini-product-card">
                    <div class="card-img-wrapper" @click="openProductModal(prod.id)">
                        <img :src="prod.image" @error="$event.target.src='/images/default.png'" alt="SP" />
                    </div>
                    
                    <div class="card-info">
                        <p class="prod-name text-truncate" @click="openProductModal(prod.id)">
                            {{ prod.name }}
                        </p>
                        <p class="prod-price">{{ prod.price }} VNĐ</p>
                        
                        <div class="card-actions">
                          <button class="btn-xs btn-outline" @click="openProductModal(prod.id)">
                            <i class="bi bi-eye"></i> Xem ngay
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
                
                <span class="msg-time">{{ msg.time || getCurrentTime() }}</span>
              </div>
            </div>

            <div v-if="isAiTyping" class="message-row ai-msg">
              <div class="message-bubble typing-bubble shadow-sm">
                <div class="typing-dots"><span></span><span></span><span></span></div>
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
              :placeholder="isListening ? 'Đang nghe...' : 'Nhập tin nhắn...'" 
              v-model="userMessage"
              @keyup.enter="sendMessage" />
            <button class="btn-send" @click="sendMessage" :disabled="!userMessage.trim()">
              <i class="bi bi-arrow-up-short"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showModal" class="product-modal-overlay" @click.self="closeProductModal">
        <div class="product-modal-content wide-modal">
          <button class="close-modal-btn" @click="closeProductModal"><i class="bi bi-x-lg"></i></button>
          
          <div v-if="isLoadingDetail" class="text-center p-5">
             <div class="spinner-border text-primary" role="status"></div>
             <p class="mt-3 text-muted fw-bold">Đang tải dữ liệu sản phẩm...</p>
          </div>

          <div v-else class="modal-body-custom container-fluid p-4">
            <div class="row g-4">
                
                <div class="col-md-6 text-center">
                    <div class="main-image-wrapper position-relative bg-white rounded-4 shadow-sm p-3 mb-3">
                        <img :src="currentImage || '/images/default.png'" class="img-fluid rounded-3 main-image" alt="Ảnh chính" />
                    </div>

                    <div v-if="getAllImages().length > 0" class="thumbs-wrapper">
                        <Swiper 
                            :modules="[Navigation]" 
                            :slides-per-view="4" 
                            :space-between="10" 
                            navigation 
                            class="thumb-swiper"
                        >
                            <SwiperSlide v-for="(img, idx) in getAllImages()" :key="idx">
                                <img :src="img" class="thumb" :class="{ active: img === currentImage }" 
                                     @click="currentImage = img" />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="product-info-modal h-100 d-flex flex-column">
                        <h4 class="product-name fw-bold">{{ productDetail.name }}</h4>
                        <p class="product-price text-danger fw-bold fs-4 mb-3">
                             {{ displayPrice.toLocaleString("vi-VN") }} VNĐ
                        </p>

                        <div class="attributes-section mb-3" style="flex: 1;">
                            <div v-for="(attrGroup, index) in attributes" :key="index" class="mb-3">
                                <h6 class="fw-semibold mb-2 fs-6">{{ attrGroup.name }}</h6>
                                <div class="options">
                                    <span v-for="option in getVisibleOptions(attrGroup)" :key="option.name"
                                          class="option"
                                          :class="{ active: selectedAttributes[attrGroup.name] === option.name, disabled: option.disabled }"
                                          @click="!option.disabled && selectAttribute(attrGroup.name, option.name)">
                                        {{ option.name }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="quantity-wrapper mb-4" v-if="selectedSku">
                            <label class="fw-semibold me-2">Số lượng:</label>
                            <div class="quantity-controls d-inline-flex align-items-center">
                                <button class="btn-qty" @click="decreaseQuantity" :disabled="quantity <= 1"><i class="bi bi-dash"></i></button>
                                <input type="number" class="quantity-input" v-model="quantity" readonly />
                                <button class="btn-qty" @click="increaseQuantity" :disabled="quantity >= selectedSku.quantity"><i class="bi bi-plus"></i></button>
                            </div>
                            <small class="text-muted ms-2 d-block mt-1">Còn lại: {{ selectedSku.quantity }}</small>
                        </div>

                        <div class="modal-actions-group d-flex gap-2">
                             <button class="btn btn-dark flex-grow-1 py-2" :disabled="!hasStock" @click="addToCartModal">
                                 <i class="bi bi-cart-plus"></i> Thêm vào giỏ
                             </button>
                             <button class="btn btn-outline-dark" @click="goToFullPage(productDetail.id)">
                                 Chi tiết <i class="bi bi-arrow-right"></i>
                             </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";

// Import Swiper giống ProductDetail
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const router = useRouter();
const isChatOpen = ref(false);
const isAiTyping = ref(false);
const userMessage = ref("");
const chatBodyRef = ref(null);
const isListening = ref(false);
const accountId = ref(null);

// --- STATE CHO MODAL ---
const showModal = ref(false);
const isLoadingDetail = ref(false);
const productDetail = ref({}); // Data chi tiết sản phẩm
const attributes = ref([]);
const selectedAttributes = ref({});
const selectedSku = ref(null);
const currentImage = ref("");
const quantity = ref(1);

const chatMessages = ref([
  { text: "Dạ TDT Store xin chào! Em có thể giúp quý khách tìm sản phẩm nào không ạ?", isUser: false }
]);

// --- 1. AUTH ---
function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
    return JSON.parse(jsonPayload);
  } catch { return null; }
}

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = decodeJwtToken(token);
    accountId.value = payload?.id || null;
  }
});

const parseMessageResponse = (rawText) => {
    const itemRegex = /\[ITEM:(.*?)\|(.*?)\|(.*?)\|(.*?)\]/g;
    let products = [];
    let match;
    while ((match = itemRegex.exec(rawText)) !== null) {
        products.push({ id: match[1], image: match[2], name: match[3], price: match[4] });
    }
    let cleanText = rawText.replace(itemRegex, "").trim();
    return { text: cleanText, products: products };
};

// --- 2. LOGIC MODAL "PRODUCT DETAIL" (Copy từ trang chi tiết) ---

// Hàm mở modal và load dữ liệu
const openProductModal = async (productId) => {
    showModal.value = true;
    isLoadingDetail.value = true;
    quantity.value = 1;
    selectedAttributes.value = {};
    selectedSku.value = null;

    try {
        const res = await axios.get(`/api/product/${productId}`);
        productDetail.value = res.data;
        currentImage.value = productDetail.value.image;

        // Xử lý thuộc tính (giống ProductDetail)
        const attrMap = {};
        productDetail.value.skus?.forEach((sku) => {
            sku.skuAttributes?.forEach((attr) => {
                if (!attrMap[attr.optionAttributeName]) attrMap[attr.optionAttributeName] = new Set();
                attrMap[attr.optionAttributeName].add(attr.valueAttributeName);
            });
        });

        attributes.value = Object.entries(attrMap).map(([name, values]) => ({
            name, values: Array.from(values),
        }));

        // Tự chọn SKU đầu tiên
        if (productDetail.value.skus?.length > 0) {
            const firstSku = productDetail.value.skus[0];
            firstSku.skuAttributes.forEach((attr) => {
                selectedAttributes.value[attr.optionAttributeName] = attr.valueAttributeName;
            });
            updateSelectedSku();
        }

    } catch (err) {
        console.error("Lỗi modal:", err);
        Swal.fire("Lỗi", "Không tải được sản phẩm", "error");
        showModal.value = false;
    } finally {
        isLoadingDetail.value = false;
    }
};

const closeProductModal = () => { showModal.value = false; };
const goToFullPage = (id) => { showModal.value = false; isChatOpen.value = false; router.push(`/product/${id}`); };

// --- LOGIC XỬ LÝ SKU ---
const selectAttribute = async (name, value) => {
    if (selectedAttributes.value[name] === value) delete selectedAttributes.value[name];
    else selectedAttributes.value[name] = value;
    await nextTick();
    updateSelectedSku();
};

const updateSelectedSku = () => {
    const keys = Object.keys(selectedAttributes.value);
    selectedSku.value = productDetail.value.skus?.find((sku) =>
        keys.every((key) =>
            sku.skuAttributes.find((a) => a.optionAttributeName === key && a.valueAttributeName === selectedAttributes.value[key])
        )
    ) || null;

    if (selectedSku.value) {
        currentImage.value = selectedSku.value.skuImages?.[0]?.path || productDetail.value.image;
        quantity.value = 1;
    } else {
        currentImage.value = productDetail.value.image;
    }
};

const getVisibleOptions = (attrGroup) => {
    const selected = { ...selectedAttributes.value };
    delete selected[attrGroup.name];
    const filteredSkus = productDetail.value.skus.filter((sku) =>
        Object.entries(selected).every(([k, v]) => sku.skuAttributes.some((a) => a.optionAttributeName === k && a.valueAttributeName === v))
    );
    const visibleOptions = new Set(filteredSkus.flatMap((sku) => sku.skuAttributes.filter((a) => a.optionAttributeName === attrGroup.name).map((a) => a.valueAttributeName)));
    return attrGroup.values.map((opt) => ({ name: opt, disabled: !visibleOptions.has(opt) }));
};

const getAllImages = () => {
    const images = new Set();
    if (selectedSku.value && selectedSku.value.skuImages?.length > 0) {
        selectedSku.value.skuImages.forEach((img) => images.add(img.path));
        return Array.from(images);
    }
    if (productDetail.value.image) images.add(productDetail.value.image);
    return Array.from(images);
};

const displayPrice = computed(() => {
    if (selectedSku.value?.price) return selectedSku.value.price;
    if (productDetail.value.price) return productDetail.value.price;
    return productDetail.value.skus?.[0]?.price || 0;
});

const hasStock = computed(() => selectedSku.value?.quantity > 0);

const increaseQuantity = () => { if (selectedSku.value && quantity.value < selectedSku.value.quantity) quantity.value++; };
const decreaseQuantity = () => { if (quantity.value > 1) quantity.value--; };

// --- 3. THÊM GIỎ HÀNG TỪ MODAL ---
const addToCartModal = async () => {
    if (!selectedSku.value) {
        Swal.fire("Chưa chọn đủ", "Vui lòng chọn màu/size", "warning");
        return;
    }
    if (!accountId.value) {
        Swal.fire("Chưa đăng nhập", "Vui lòng đăng nhập", "info");
        router.push("/auth/login");
        closeProductModal();
        return;
    }

    try {
        await axios.post("/api/cart-details", {
            accountId: accountId.value,
            skuId: selectedSku.value.id,
            quantity: quantity.value,
        });

        closeProductModal();
        Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Đã thêm vào giỏ hàng.",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: 'top-end'
        });
        window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
        Swal.fire("Lỗi", "Không thể thêm vào giỏ hàng", "error");
    }
};

// --- 4. CHAT CORE ---
const sendMessage = async () => {
  if (!userMessage.value.trim()) return;
  const text = userMessage.value;
  chatMessages.value.push({ text: text, isUser: true, time: getCurrentTime() });
  userMessage.value = "";
  scrollToBottom();
  isAiTyping.value = true;
  try {
    const res = await axios.post('/api/chat/ask', { message: text });
    setTimeout(() => {
      isAiTyping.value = false;
      const rawReply = (res.data && res.data.reply) ? res.data.reply : "Mất kết nối.";
      const parsedData = parseMessageResponse(rawReply);
      chatMessages.value.push({ text: parsedData.text, products: parsedData.products, isUser: false, time: getCurrentTime() });
      scrollToBottom();
    }, 600);
  } catch (error) { isAiTyping.value = false; chatMessages.value.push({ text: "Lỗi kết nối.", isUser: false }); }
};

const toggleChat = () => { isChatOpen.value = !isChatOpen.value; scrollToBottom(); };
const scrollToBottom = () => { nextTick(() => { if (chatBodyRef.value) chatBodyRef.value.scrollTo({ top: chatBodyRef.value.scrollHeight, behavior: "smooth" }); }); };
const getCurrentTime = () => { const now = new Date(); return now.getHours() + ":" + String(now.getMinutes()).padStart(2, '0'); };
const handleVoiceInput = () => { /* Giữ nguyên code voice */ };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

/* --- CẤU TRÚC CHUNG --- */
.chat-wrapper {
  font-family: 'Manrope', sans-serif;
  --primary-color: #000;
  --accent-color: #2563eb;
  --bg-light: #f3f4f6;
  --border-color: #e5e7eb;
}

/* --- 1. NÚT TOGGLE CHAT (SỬA LỖI HIỂN THỊ) --- */
.chat-toggle-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  cursor: pointer;
  z-index: 10000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.chat-toggle-btn.active {
  transform: rotate(90deg);
  background: #333;
}

/* Tooltip "Hỗ trợ 24/7" (Sửa lại đẹp hơn) */
.chat-tooltip {
  position: absolute;
  right: 75px; /* Cách nút chat 1 khoảng */
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  color: #000;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap; /* Chống xuống dòng */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  opacity: 0;
  animation: fadeInLeft 0.5s forwards 1s; /* Hiện sau 1s */
}

/* Mũi tên tooltip */
.chat-tooltip::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 0 6px 6px;
  border-style: solid;
  border-color: transparent transparent transparent #fff;
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translate(10px, -50%); }
  to { opacity: 1; transform: translate(0, -50%); }
}

/* --- 2. CỬA SỐ CHAT (WINDOW) --- */
.chat-window {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 380px; /* Rộng hơn chút */
  height: 600px;
  max-height: 80vh;
  background: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0,0,0,0.05);
  overflow: hidden;
}

/* Header Chat */
.chat-header {
  background: var(--primary-color);
  padding: 18px 20px;
  color: #fff;
}
.avatar-container { position: relative; width: 42px; height: 42px; }
.ai-avatar { width: 100%; height: 100%; border-radius: 50%; background: #fff; padding: 2px; object-fit: contain; }
.status-dot { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #22c55e; border-radius: 50%; border: 2px solid #000; }
.brand-name { font-weight: 800; font-size: 1.1rem; margin: 0; letter-spacing: 0.5px; }
.status-text { font-size: 0.75rem; opacity: 0.8; }

/* Body Chat */
.chat-body {
  flex: 1;
  overflow-y: auto;
  background-color: #f8f9fa;
  padding: 20px;
  scroll-behavior: smooth;
}

/* Bong bóng chat */
.message-row { display: flex; width: 100%; margin-bottom: 20px; }
.user-msg { justify-content: flex-end; }
.ai-msg { justify-content: flex-start; }

.message-bubble {
  max-width: 85%;
  padding: 14px 16px;
  border-radius: 16px;
  position: relative;
  font-size: 0.95rem;
  line-height: 1.6;
}
.ai-msg .message-bubble {
  background: #fff;
  color: #374151;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  border: 1px solid var(--border-color);
}
.user-msg .message-bubble {
  background: var(--primary-color);
  color: #fff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
.msg-time { display: block; font-size: 0.65rem; margin-top: 6px; opacity: 0.6; text-align: right; }

/* Thẻ sản phẩm nhỏ trong chat */
.product-list-container { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
.mini-product-card {
  display: flex; gap: 12px; background: #fff;
  padding: 10px; border-radius: 12px; border: 1px solid var(--border-color);
  transition: transform 0.2s;
}
.mini-product-card:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
.card-img-wrapper { width: 70px; height: 70px; border-radius: 8px; overflow: hidden; flex-shrink: 0; border: 1px solid #eee; }
.card-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.card-info { flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.prod-name { font-weight: 700; font-size: 0.9rem; margin: 0 0 4px 0; color: #111; cursor: pointer; }
.prod-name:hover { color: var(--accent-color); }
.prod-price { color: #dc2626; font-weight: 700; font-size: 0.85rem; margin: 0 0 8px 0; }
.btn-xs {
  font-size: 0.75rem; padding: 5px 12px; border-radius: 6px; border: none; font-weight: 600; cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px; transition: 0.2s;
}
.btn-outline { background: #f3f4f6; color: #333; }
.btn-outline:hover { background: #e5e7eb; }

/* Typing Dots */
.typing-dots span { width: 6px; height: 6px; background: #9ca3af; border-radius: 50%; display: inline-block; animation: bounce 1.4s infinite; margin: 0 2px; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

/* Footer Input */
.chat-footer { padding: 15px 20px; background: #fff; border-top: 1px solid var(--border-color); }
.input-container {
  display: flex; align-items: center; background: #f9fafb;
  border-radius: 30px; padding: 6px 6px 6px 16px; border: 1px solid var(--border-color);
  transition: 0.3s;
}
.input-container:focus-within { border-color: #aaa; background: #fff; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }
.input-container.listening-border { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
.custom-input { flex: 1; border: none; background: transparent; outline: none; font-size: 0.95rem; padding: 0 10px; color: #333; }
.btn-mic { width: 36px; height: 36px; border-radius: 50%; border: none; background: transparent; color: #6b7280; cursor: pointer; transition: 0.2s; }
.btn-mic:hover { background: #e5e7eb; color: #000; }
.btn-mic.is-listening { color: #ef4444; animation: pulse 1.5s infinite; }
.btn-send {
  width: 36px; height: 36px; border-radius: 50%; border: none;
  background: var(--primary-color); color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: 0.2s; margin-left: 5px;
}
.btn-send:disabled { background: #e5e5e5; cursor: default; }
.btn-send:not(:disabled):hover { transform: scale(1.05); background: #333; }

/* --- 3. MODAL CHI TIẾT SẢN PHẨM (REFACTORED) --- */
.product-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7); /* Tối hơn chút để nổi bật modal */
  z-index: 20000;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(5px);
  padding: 20px;
}

.product-modal-content.wide-modal {
  background: #fff;
  width: 100%;
  max-width: 950px; /* Rộng chuẩn desktop */
  height: auto;
  max-height: 90vh;
  border-radius: 20px;
  position: relative;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.close-modal-btn {
  position: absolute; top: 15px; right: 15px;
  width: 40px; height: 40px;
  border: none; background: #f3f4f6;
  border-radius: 50%;
  font-size: 1.2rem; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: 0.2s; z-index: 10;
  color: #666;
}
.close-modal-btn:hover { background: #e5e7eb; color: #000; transform: rotate(90deg); }

/* Layout Modal Body */
.modal-body-custom { padding: 30px !important; }

/* Cột Ảnh */
.main-image-wrapper {
  height: 400px; /* Cố định chiều cao ảnh */
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; background: #fff; border: 1px solid #f3f4f6;
}
.main-image { max-height: 100%; object-fit: contain; transition: transform 0.4s ease; }
.main-image-wrapper:hover .main-image { transform: scale(1.05); }

.thumbs-wrapper { margin-top: 15px; padding: 0 5px; }
.thumb {
  width: 100%; height: 70px; /* Thumbnail to hơn */
  border-radius: 10px; object-fit: cover;
  cursor: pointer; border: 2px solid transparent;
  background: #f8f9fa; opacity: 0.7; transition: 0.2s;
}
.thumb:hover { opacity: 1; }
.thumb.active { border-color: var(--primary-color); opacity: 1; transform: translateY(-2px); }

/* Cột Thông tin */
.product-info-modal { padding-left: 10px; }
.product-name { font-size: 1.75rem; line-height: 1.3; margin-bottom: 10px; color: #111; }
.product-price { color: #dc2626; font-size: 1.5rem; letter-spacing: -0.5px; }

/* Thuộc tính (Options) */
.attributes-section h6 { font-size: 0.9rem; color: #666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.option {
  display: inline-block;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 16px;
  margin-right: 8px; margin-bottom: 8px;
  cursor: pointer; font-size: 0.9rem; font-weight: 500;
  transition: all 0.2s; min-width: 40px; text-align: center;
}
.option:hover { border-color: #999; }
.option.active {
  background: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.option.disabled {
  background: #f3f4f6; color: #ccc;
  border-color: #eee; cursor: not-allowed; text-decoration: line-through;
}

/* Số lượng */
.quantity-controls {
  border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;
}
.btn-qty {
  width: 36px; height: 36px; background: #fff; border: none;
  cursor: pointer; font-size: 1.1rem; transition: 0.2s;
}
.btn-qty:hover:not(:disabled) { background: #f3f4f6; }
.btn-qty:disabled { color: #ccc; cursor: default; }
.quantity-input {
  width: 40px; text-align: center; border: none; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;
  font-weight: 600; color: #111;
  /* Ẩn nút tăng giảm mặc định của input number */
  -moz-appearance: textfield;
}
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

/* Nút Action Modal */
.modal-actions-group { margin-top: auto; padding-top: 20px; }
.modal-actions-group .btn {
  border-radius: 10px; font-weight: 700; font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}
.modal-actions-group .btn-dark { background: var(--primary-color); border: none; }
.modal-actions-group .btn-dark:hover { background: #222; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
.modal-actions-group .btn-outline-dark { border: 2px solid #e5e7eb; color: #111; }
.modal-actions-group .btn-outline-dark:hover { border-color: #111; background: #fff; }

/* --- RESPONSIVE MOBILE --- */
@media (max-width: 768px) {
  .chat-tooltip { display: none; /* Ẩn tooltip trên mobile cho đỡ rối */ }
  .chat-window { width: 100%; height: 100%; bottom: 0; right: 0; border-radius: 0; max-height: 100vh; }
  .chat-toggle-btn { bottom: 20px; right: 20px; }
  
  /* Modal trên mobile */
  .modal-body-custom { padding: 15px !important; }
  .main-image-wrapper { height: 250px; }
  .product-info-modal { padding-left: 0; margin-top: 20px; }
  .product-name { font-size: 1.4rem; }
  .modal-actions-group { position: sticky; bottom: 0; background: #fff; padding-bottom: 0; }
}

/* Animations */
.rotate-icon-enter-active, .rotate-icon-leave-active { transition: all 0.3s; }
.rotate-icon-enter-from, .rotate-icon-leave-to { opacity: 0; transform: rotate(-90deg); }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>