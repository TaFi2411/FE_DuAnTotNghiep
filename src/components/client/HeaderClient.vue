<template>
  <nav :class="[
    'navbar navbar-expand-lg position-fixed top-0 end-0 start-0 glass-dark-header transition-all',
    isScrolled ? 'scrolled shadow-lg' : ''
  ]">
    <div class="container align-items-center">
      <router-link class="navbar-brand d-flex align-items-center gap-2" to="/">
        <img src="/images/Logo.png" alt="Logo" height="36" width="110" class="logo-glow" />
      </router-link>

      <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <div class="d-flex flex-column flex-lg-row justify-content-between w-100 align-items-lg-center">
          <ul class="navbar-nav mx-lg-auto mb-2 mb-lg-0 fw-semibold text-uppercase">
            <li v-for="item in menu" :key="item.to" class="nav-item px-2">
              <router-link class="nav-link fancy-link text-white text-nowrap py-2" :to="item.to"
                exact-active-class="active-link">
                {{ item.label }}
              </router-link>
            </li>
          </ul>

          <div class="search-box mx-3 my-2 my-lg-0 position-relative d-none d-lg-block">
            <input type="text" class="form-control search-input bg-transparent text-white"
              placeholder="Tìm kiếm..." v-model="searchQuery" @keyup.enter="handleSearch" />
            
            <i class="bi bi-mic-fill voice-icon" 
               :class="{ 'listening': isListening }"
               @click="startVoiceSearch" 
               title="Tìm bằng giọng nói">
            </i>

            <i class="bi bi-search search-icon" @click="handleSearch"></i>
          </div>

          <div class="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            <button class="btn btn-link text-white p-0 d-lg-none" @click="showSearch = !showSearch">
              <i class="bi bi-search fs-5"></i>
            </button>

            <router-link to="/cart" class="nav-link position-relative cart-icon text-white">
              <i class="bi bi-cart3 fs-5"></i>
              <span v-if="cartCount > 0"
                class="badge cart-badge position-absolute top-0 start-100 translate-middle rounded-pill shadow-sm">
                {{ cartCount > 99 ? '99+' : cartCount }}
              </span>
            </router-link>

            <template v-if="!isLoggedIn">
              <router-link to="/auth/login"
                class="btn btn-outline-light px-3 fw-semibold rounded-pill btn-sm text-nowrap py-2">
                <i class="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
              </router-link>
              <router-link to="/auth/register"
                class="btn btn-light text-dark px-3 fw-semibold rounded-pill btn-sm text-nowrap py-2">
                <i class="bi bi-person-plus me-1"></i> Đăng ký
              </router-link>
            </template>

            <template v-else>
              <div class="dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center text-white" href="#"
                  data-bs-toggle="dropdown">
                  <div class="avatar-wrapper" @click="openFilePicker">
                    <img :src="previewAvatar || defaultAvatar" class="avatar" alt="Avatar" />
                    <div class="overlay">Chọn ảnh</div>
                  </div>
                  <span class="fw-semibold">{{ accountName }}</span>
                </a>

                <ul class="dropdown-menu dropdown-menu-end user-dropdown shadow border-0 rounded-4 p-2">
                  <li>
                    <router-link class="dropdown-item custom-item" to="/orders">
                      <i class="bi bi-person-lines-fill me-2"></i> Hồ sơ cá nhân
                    </router-link>
                  </li>
                  <li v-if="isAdmin">
                    <router-link class="dropdown-item custom-item" to="/admin">
                      <i class="bi bi-speedometer2 me-2"></i> Quản lý hệ thống
                    </router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item custom-item" to="/auth/change-password">
                      <i class="bi bi-shield-lock me-2"></i> Đổi mật khẩu
                    </router-link>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a class="dropdown-item custom-item text-danger" href="#" @click.prevent="logoutHandler">
                      <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
                    </a>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showSearch" class="mobile-search-box bg-dark position-absolute top-100 start-0 end-0 p-3">
        <div class="input-group">
          <input v-model="searchQuery" type="text" class="form-control bg-transparent text-white border-light"
            placeholder="Nói hoặc nhập để tìm..." @keyup.enter="handleSearch" />
            
          <button class="btn btn-outline-light" type="button" @click="startVoiceSearch">
             <i class="bi bi-mic-fill" :class="{ 'text-danger': isListening }"></i>
          </button>

          <button class="btn btn-light" @click="handleSearch">
            <i class="bi bi-search"></i>
          </button>
        </div>
        <div v-if="isListening" class="text-white small mt-1 text-center fst-italic">
            Đang nghe...
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from "@/composables/axios.js";
import Swal from "sweetalert2";

const router = useRouter();
const isScrolled = ref(false);
const isLoggedIn = ref(false);
const accountName = ref('Khách');
const isAdmin = ref(false);
const cartCount = ref(0);
const searchQuery = ref('');
const showSearch = ref(false);
const accountId = ref(null);
const isListening = ref(false); 

const defaultAvatar = '/userDefault.jpg';
const previewAvatar = ref(defaultAvatar);
const profile = ref(null);

const menu = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Cửa hàng', to: '/store' },
  { label: 'Giới thiệu', to: '/introduce' },
  { label: 'Hỗ trợ', to: '/support' },
];

function handleScroll() {
  isScrolled.value = window.scrollY > 10;
}


function cleanSearchString(str) {
    if (!str) return '';
    // 1. Trim 2 đầu
    // 2. Thay thế nhiều dấu cách liên tiếp thành 1 dấu cách (\s+)
    return str.trim().replace(/\s+/g, ' ');
}

function handleSearch() {
  const cleanedQuery = cleanSearchString(searchQuery.value);
  

  searchQuery.value = cleanedQuery; 

  if (cleanedQuery !== '') {
    router.push(`/search?search=${encodeURIComponent(cleanedQuery)}`);
    showSearch.value = false;
  }
}


function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        Swal.fire("Lỗi", "Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.", "warning");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN'; 
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isListening.value = true;
    };

    recognition.onend = () => {
        isListening.value = false;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchQuery.value = transcript;
        // Tự động tìm kiếm sau khi nói xong (có cắt chuỗi)
        handleSearch(); 
    };

    recognition.onerror = (event) => {
        isListening.value = false;
        console.error("Voice error:", event.error);
    };

    recognition.start();
}

// === CÁC HÀM KHÁC ===

function decodeJwtToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
  } catch {
    return null;
  }
}

function logoutHandler() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  isLoggedIn.value = false;
  isAdmin.value = false;
  accountName.value = 'Khách';
  previewAvatar.value = defaultAvatar;
  router.push('/auth/login');
}

const updateCartCount = async () => {
  if (!accountId.value) {
    cartCount.value = 0;
    return;
  }
  try {
    const res = await axios.get(`/api/cart-details/account/${accountId.value}`);
    cartCount.value = res.data?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  } catch {
    cartCount.value = 0;
  }
};

const fetchProfile = async () => {
  if (!accountId.value) return;
  try {
    const res = await axios.get(`/api/account/${accountId.value}`);
    profile.value = res.data;
    accountName.value = res.data.fullname;
    previewAvatar.value = res.data.avatar ? (res.data.avatar.startsWith('http') ? res.data.avatar : `/uploads/${res.data.avatar}`) : defaultAvatar;
  } catch {
    Swal.fire("Lỗi", "Không thể tải thông tin!", "error");
  }
};

const openFilePicker = () => {
    // Logic mở file picker nếu cần
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('cart-updated', updateCartCount);
  window.addEventListener('avatar-updated', (e) => {
    previewAvatar.value = e.detail ? (e.detail.startsWith('http') ? e.detail : `/uploads/${e.detail}`) : defaultAvatar;
  });
    window.addEventListener('name-updated', (e) => {accountName.value = e.detail || 'Người dùng'; });
  
  const token = localStorage.getItem('token');
  if (token) {
    const payload = decodeJwtToken(token);
    if (payload) {
      const roles = payload.roles || [];
      isLoggedIn.value = true;
      accountName.value = payload.accountName || payload.username || 'Người dùng';
      isAdmin.value = Array.isArray(roles) ? roles.includes('ROLE_ADMIN') : false;
      accountId.value = payload.id || null;
    }
  }

  updateCartCount();
  fetchProfile();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('cart-updated', updateCartCount);

});
</script>

<style scoped>
/* ... (Giữ nguyên các style cũ) ... */

/* Thêm style cho icon Voice */
.voice-icon {
    position: absolute;
    right: 40px; /* Đặt bên trái icon search một chút */
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
}

.voice-icon:hover {
    color: #fff;
    transform: translateY(-50%) scale(1.2);
}

.search-input {
    /* Tăng padding bên phải để chứa 2 icon */
    padding-right: 4.5rem; 
}

/* Hiệu ứng rung khi đang nghe */
.listening {
    color: #ff4757 !important;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { transform: translateY(-50%) scale(1); opacity: 1; }
    50% { transform: translateY(-50%) scale(1.2); opacity: 0.8; }
    100% { transform: translateY(-50%) scale(1); opacity: 1; }
}

/* Style cũ */
.avatar-wrapper {
  position: relative;
  width: 30px;
  height: 30px;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #ffffff;
  margin-right: 2px;
}

.avatar-wrapper img.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.3s;
}

.user-dropdown {
  background: #ffffff !important;
  border-radius: 14px;
  padding: 10px;
  min-width: 240px;
  animation: dropdownFade 0.2s ease-out;
}

.custom-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  color: #000 !important;
  font-weight: 500;
  transition: all 0.25s ease;
}

.custom-item:hover {
  background: #f2f2f2;
}

.dropdown-divider {
  background-color: rgba(0, 0, 0, 0.15) !important;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-dark-header {
  background: rgb(0, 0, 0);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 1050;
  transition: all 0.3s ease;
  padding: 0.4rem 0;
}

.scrolled {
  background: rgba(0, 0, 0, 0.568);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 30px rgba(255, 255, 255, 0.05);
}

/* Search box */
.search-box {
  position: relative;
  width: 240px;
}

.search-input {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  padding: 0.4rem 4.5rem 0.4rem 1rem; /* Đã sửa padding-right */
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #aaa;
}

.search-input:focus {
  border-color: #fff;
  outline: none;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  cursor: pointer; /* Thêm con trỏ */
}

/* Search (mobile) */
.mobile-search-box {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Logo */
.logo-glow:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  transition: all 0.3s ease;
}

/* Cart */
.cart-icon:hover {
  transform: scale(1.1);
}

.cart-badge {
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 0.7rem;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #222;
}

/* Nav */
.navbar-nav .nav-link {
  color: #e8e8e8 !important;
  position: relative;
}

.navbar-nav .nav-link:hover {
  color: #fff !important;
}

.navbar-nav .nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 0;
  height: 2px;
  background: #fff;
  transition: all 0.3s ease;
}

.navbar-nav .nav-link:hover::after,
.active-link::after {
  width: 100%;
  left: 0;
}
.dropdown-menu {
  background: #fff !important;
  color: #000 !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.dropdown-menu .dropdown-header {
  color: #555 !important;
}

.dropdown-menu .dropdown-item {
  color: #000 !important;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #f0f0f0 !important;
  color: #000 !important;
}

.dropdown-menu .dropdown-item.text-danger {
  color: #dc3545 !important;
}

.dropdown-divider {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

</style>