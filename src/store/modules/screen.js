import { ref, reactive } from "vue";
import { defineStore } from "pinia";
export const useScreenStoreHook = defineStore("screenStore", () => {
  const scale = ref(1);
  const screenData = reactive({
    type: "",
    id: "",
    detail: {}, // 设备详情
    area: [],
    deviceList: { values: [], status: [], data: [] }, // 设备数据
    deviceCount: [], // 设备数量统计
    statusLists: [], //
    monitorData: { type: null, data: {} }, // 监测数据
    workData: [], // 工况数据
  });

  const setScale = (value) => {
    scale.value = value;
  };

  const setData = (key, data) => {
    screenData[key] = data;
  };

  return { scale, screenData, setScale, setData };
});
