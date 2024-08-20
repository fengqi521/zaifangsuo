<script setup>
import { computed } from "vue";
const props = defineProps({
  imagesData: {
    type: Object,
    default: () => ({ timeList: [], valueList: [] }),
  },
});

const valueList = computed(() => {
  return props.imagesData.valueList.map(
    (item) => `data:image/png;base64,${item}`
  );
});
</script>
<template>
  <div class="timeline-container">
    <el-empty v-if="!props.imagesData.timeList.length"></el-empty>
    <el-timeline v-else>
      <el-timeline-item
        v-for="(item, index) in props.imagesData.timeList"
        :key="index"
        :timestamp="item"
        placement="top"
      >
        <el-image
          lazy
          style="width: 99%; height: 196px"
          :src="valueList[index]"
          :preview-src-list="[valueList[index]]"
          fit="cover"
        />
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";

.timeline-container {
  padding: 16px;
  border: 1px solid var(--card-border-color);
}

.el-timeline {
  width: 100%;
  max-height: 386px;
  overflow-y: auto;
  @extend %scrollbar;

  :deep(.el-timeline-item__node--normal) {
    left: 0;
  }

  :deep(.el-timeline-item__tail) {
    left: 5px;
  }

  :deep(.el-timeline-item__wrapper) {
    padding-left: 16px;
  }
}
</style>
