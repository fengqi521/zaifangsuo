<script setup>
import { inject } from "vue";

const { timeList, valueList } = inject("mudLevelImages");
console.log(timeList, valueList);
</script>
<template>
  <div class="timeline-container">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in timeList"
        :key="index"
        :timestamp="item"
        placement="top"
      >
        <el-image
          style="width: 99%; height: 196px"
          :src="valueList[index]"
          :preview-src-list="[valueList[0]]"
          fit="cover"
        />
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
.timeline-container {
  display: inline-flex;
  width: 50%;
  padding: 24px 24px;
  border: 1px solid var(--normal-border-color);
}
.el-timeline {
  width: 100%;
  max-height: 500px;
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
