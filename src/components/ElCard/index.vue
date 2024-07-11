<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="card">
    <!-- 标题 -->
    <p class="card-title">{{ title }}</p>
    <!-- 内容 -->
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  padding: 0 24px 24px;
  border: 1px solid var(--normal-border-color);
  background: var(--background-color);

  .card-title {
    line-height: 48px;
    font-size: 14px;
    color: var(--normal-title-color);
    border-bottom: 1px solid var(--normal-border-color);
  }

  .card-content {
    margin-top: 16px;
  }
}
</style>
