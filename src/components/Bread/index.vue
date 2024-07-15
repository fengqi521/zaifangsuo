<script setup>
const props = defineProps({
  breadList: {
    type: Array,
    default: () => [],
  },
});
</script>
<template>
  <div class="custom-breadcrumb-container">
    <el-breadcrumb class="bread-container">
      <el-breadcrumb-item
        v-for="(bread, index) in breadList"
        :to="bread.to"
        :key="index"
        >{{ bread.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.custom-breadcrumb-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bread-container {
  display: flex;
  height: 62px;

  :deep(.el-breadcrumb__inner) {
    font-weight: bold;
  }

  /* 链接样式覆盖 */
  :deep(.el-breadcrumb__inner.is-link),
  :deep(.el-breadcrumb__inner a) {
    color: var(--normal-active-color);
  }
}
</style>
