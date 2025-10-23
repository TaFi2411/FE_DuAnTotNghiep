// src/composables/useVideoApi.js
import { ref } from "vue";
import axios from "../axios"; // 👉 import axios instance bạn tạo
import { v4 as uuidv4 } from "uuid";

export function useVideoApi() {
  const video = ref(null);
  const uploading = ref(false);
  const error = ref(null);

  /**
   * 🟢 Upload video trực tiếp lên Amazon S3
   */
  const uploadVideo = async (file) => {
    if (!file) return;

    uploading.value = true;
    error.value = null;

    try {
      const fileKey = `videos/${uuidv4()}-${file.name}`;

      // 1️⃣ Lấy presigned URL từ backend
      const { data } = await axios.post("/api/videos/presigned-upload", {
        fileName: file.name,
        fileKey,
        contentType: file.type,
      });

      const { uploadUrl, publicUrl } = data;
      if (!uploadUrl || !publicUrl) throw new Error("Không nhận được URL hợp lệ từ backend");

      // 2️⃣ Upload video trực tiếp lên S3
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      // 3️⃣ Lưu thông tin video
      video.value = { name: file.name, url: publicUrl, key: fileKey };
      return publicUrl;
    } catch (err) {
      console.error("❌ Upload video lỗi:", err);
      error.value = err;
      throw err;
    } finally {
      uploading.value = false;
    }
  };

  /**
   * 🔴 Xóa video khỏi Amazon S3
   */
  const deleteVideo = async (fileKey) => {
    if (!fileKey) return;
    try {
      await axios.delete("/api/videos/delete", { params: { key: fileKey } });
      video.value = null;
    } catch (err) {
      console.error("❌ Xóa video thất bại:", err);
      error.value = err;
      throw err;
    }
  };

  return {
    video,
    uploading,
    error,
    uploadVideo,
    deleteVideo,
  };
}
