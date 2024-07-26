import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { getStartAndEndTime } from "@/utils";

export const useRtuStoreHook = defineStore("rtuStore", () => {
  const dateTimeRange = ref([]);

  const setDateRange = (active, type) => {
    if (type) {
      dateTimeRange.value = active;
      return;
    }
    dateTimeRange.value = getStartAndEndTime(active);
  };

  const handleMethod = (func) => {
    watch(
      dateTimeRange,
      (newValue) => {
        func(newValue);
      },
      { immediate: true }
    );
  };

  return { dateTimeRange, setDateRange, handleMethod };
});

import { useWebSocket } from "@vueuse/core";
export const useSocketRtuHook = defineStore("socketRtuStore", () => {
  const socket = ref(null);
  socket.value = useWebSocket(import.meta.env.VITE_SOCKET_PATH, {
    onOpen: () => {
      console.log("WebSocket connection opened");
    },
    onClose: () => {
      console.log("WebSocket connection closed");
    },
    onError: (error) => {
      console.error("WebSocket connection error:", error);
    },
    onMessage: (message) => {
      console.log("Received message:", message);
    },
    heartbeat: false,
    autoReconnect: {
      retries: 3,
      delay: 3000,
      onFailed() {
        console.log("重连3次失败");
      },
    },
  });
  return {
    socket,
  };
});
