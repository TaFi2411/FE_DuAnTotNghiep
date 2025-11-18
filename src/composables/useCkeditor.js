import { ref, onMounted, onBeforeUnmount } from "vue";

export function useCkeditor(editorId, config = {}) {
  const content = ref("");
  let instance = null;

  onMounted(() => {
    instance = CKEDITOR.replace(editorId, config);

    instance.on("change", () => {
      content.value = instance.getData();
    });
  });

  onBeforeUnmount(() => {
    if (instance) instance.destroy();
  });

  const setData = (html) => {
    content.value = html;
    if (instance) instance.setData(html);
  };

  return {
    content,
    setData,
    instance
  };
}
