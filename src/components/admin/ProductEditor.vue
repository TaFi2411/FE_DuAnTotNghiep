<template>
  <div>
    <label>Mô tả sản phẩm</label>
    <textarea id="editorDesc"></textarea>

    <button @click="save" class="btn btn-primary mt-3">Lưu</button>
  </div>
</template>

<script setup>
import { useCkeditor } from "@/composables/useCkeditor";

const { content, setData } = useCkeditor("editorDesc", {
  height: 300,
});

// Ví dụ: đang sửa sản phẩm → load mô tả cũ
setTimeout(() => {
  setData("<p>Nội dung mô tả cũ...</p>");
}, 500);

const save = () => {
  console.log("Nội dung HTML:", content.value);
};
</script>
