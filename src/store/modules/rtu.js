import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { getStartAndEndTime } from "@/utils";

export const useRtuStoreHook = defineStore("rtu", () => {
  const dateTimeRange = ref([]);

  const setDateRange = (active, type) => {
    if (type) {
      dateTimeRange.value = active;
      return;
    }
    dateTimeRange.value = getStartAndEndTime(active);
  };

  const handleMethod = (func) => {
    watch(dateTimeRange, (newValue) => {
      func(newValue);
    },{immediate:true});
  };

  return { dateTimeRange, setDateRange, handleMethod };
});
