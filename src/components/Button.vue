<template>
  <button
    :class="computedClass"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: { type: String, default: "primary" }, // màu nút
  size: { type: String, default: "md" },         // kích thước
  disabled: { type: Boolean, default: false },
  outline: { type: Boolean, default: false },
});

const emit = defineEmits(["click"]);

const onClick = (e) => {
  if (!props.disabled) {
    emit("click", e);
  }
};

// Auto generate class Bootstrap
const computedClass = computed(() => {
  const base = props.outline
    ? `btn btn-outline-${props.variant}`
    : `btn btn-${props.variant}`;

  const sizeClass = props.size === "sm"
    ? "btn-sm"
    : props.size === "lg"
    ? "btn-lg"
    : "";

  return `${base} ${sizeClass}`;
});
</script>
