import { ref, watch } from "vue";
import { defineStore } from "pinia";
export const useScreenStoreHook = defineStore("screenStore", () => {
  const scale = ref(1);

  const setScale = (value) => {
    scale.value = value;
  };

  return { scale, setScale };
});