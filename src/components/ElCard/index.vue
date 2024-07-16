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
    <div class="card-head" v-if="title">
      <p class="card-title">{{ title }}</p>
      <slot name="actions"></slot>
    </div>
    <!-- 内容 -->
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  padding: 0 16px 16px;
  border: 1px solid var(--normal-border-color);
  background: var(--background-color);
  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    border-bottom: 1px solid var(--normal-border-color);
  }
  .card-title {
    font-size: 12px;
    color: var(--normal-title-color);
  }

  .card-content {
    margin-top: 16px;
  }
}
</style>
