<template>
  <div>
    <p class="chart-title">{{ props.option.name }}</p>
    <component :is="activeComponent" :data="props.option.data" />
  </div>
</template>
<script setup>
import { watch, markRaw, ref } from "vue";
import RainChart from "@/components/RainChart/index.vue";
import MudChart from "@/components/MudChart/index.vue";
import BreakLineChart from "@/components/BreakLineChart/index.vue";

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
});
const activeComponent = ref(null);
const resetOption = (option) => {
  const { type } = option;

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

watch(
  () => props.option,
  (values) => {
    resetOption(values);
  },
  { deep: true, immediate: true }
);
</script>
<style lang="scss" scoped>
.chart-title {
  font-size: 14px;
  line-height: 24px;
  color: var(--normal-title-color);
  font-weight: 700;
}
:deep(.chart-container) {
  height: calc(100% - 24px);
  padding: 10px;
}
</style>
