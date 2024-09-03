<template>
  <Empty v-if="!screenStore.screenData.monitorData?.data?.timeList?.length" />
  <component :is="activeComponent" :data="data" v-else />
</template>

<script setup>
import {ref, watch, computed,markRaw } from "vue";
import RainChart from "@/components/RainChart/index.vue";
import MudChart from "@/components/MudChart/index.vue";
import BreakLineChart from "@/components/BreakLineChart/index.vue";
import Empty from "../../Empty.vue";
import { useScreenStoreHook } from "@/store/modules/screen";

const screenStore = useScreenStoreHook();
const activeComponent = ref(null);
const resetOptions = (values) => {
  const { type } = values;

  switch (type) {
    case 1:
      activeComponent.value = markRaw(MudChart);
      break;
    case 2:
      activeComponent.value = markRaw(RainChart);
      break;
    case 3:
      activeComponent.value = markRaw(BreakLineChart);
      break;
    default:
      break;
  }
};

const data = computed(()=>{
   return screenStore.screenData.monitorData.data
})

// 监听数据变化
watch(
  () => screenStore.screenData.monitorData,
  (values) => {
    resetOptions(values);
  }
);
</script>
