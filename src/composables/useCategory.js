import axios from "@/composables/axios.js";

export const fetchCategoryOptions = async () => {
  try {
    const data = await axios.get("/api/category");
    return (data.data || []).map((cate) => ({
      label: cate.name,
      value: cate.id,
    }));
  } catch (error) {
    return [];
  }
};

export default fetchCategoryOptions;
