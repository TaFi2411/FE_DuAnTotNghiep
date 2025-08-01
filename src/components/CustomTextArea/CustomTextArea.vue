<template>
  <div>
    <div id="toolbar-container">
    <span class="ql-formats">
    <select class="ql-font"></select>
    <select class="ql-size"></select>
  </span>
  <span class="ql-formats">
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
    <button class="ql-underline"></button>
    <button class="ql-strike"></button>
  </span>
  <span class="ql-formats">
    <select class="ql-color"></select>
    <select class="ql-background"></select>
  </span>
  <span class="ql-formats">
    <button class="ql-script" value="sub"></button>
    <button class="ql-script" value="super"></button>
  </span>
  <span class="ql-formats">
    <button class="ql-header" value="1"></button>
    <button class="ql-header" value="2"></button>
    <button class="ql-blockquote"></button>
    <button class="ql-code-block"></button>
  </span>
  <span class="ql-formats">
    <button class="ql-list" value="ordered"></button>
    <button class="ql-list" value="bullet"></button>
    <button class="ql-indent" value="-1"></button>
    <button class="ql-indent" value="+1"></button>
  </span>
  <span class="ql-formats">
    <button class="ql-direction" value="rtl"></button>
    <select class="ql-align"></select>
  </span>
  <span class="ql-formats">
    <button class="ql-link"></button>
    <button class="ql-image"></button>
    <button class="ql-video"></button>
    <button class="ql-formula"></button>
  </span>
  <span class="ql-formats">
    <button class="ql-clean"></button>
  </span>
    </div>
    <div id="editor"></div>
  </div>
</template>
<!-- Của Thế Tài -->
<script setup>
import { onMounted, watch, ref } from 'vue';
import Quill from 'quill';

const props = defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue']);

let quill;

onMounted(() => {
  quill = new Quill('#editor', {
    modules: {
      toolbar: '#toolbar-container',
    },
    theme: 'snow',
  });

  // Gán nội dung ban đầu từ modelValue vào Quill
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue;
  }

  // Lắng nghe khi nội dung thay đổi
  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML);
  });
});

// Đồng bộ khi modelValue thay đổi từ bên ngoài
watch(() => props.modelValue, (newVal) => {
  if (quill && quill.root.innerHTML !== newVal) {
    quill.root.innerHTML = newVal || '';
  }
});
</script>

<style scoped>
#editor {
  height: 300px;
}
</style>