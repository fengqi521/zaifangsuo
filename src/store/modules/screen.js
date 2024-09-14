import { ref, reactive } from "vue";
import { defineStore } from "pinia";
export const useScreenStoreHook = defineStore("screenStore", () => {
  const scale = ref(1);
  const _height = ref(1080)
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

  const setScale = ({rate,high}) => {
    scale.value = rate;
    _height.value = high
  };

  const setData = (key, data) => {
    screenData[key] = data;
  };

  return { scale,_height, screenData, setScale, setData };
});
