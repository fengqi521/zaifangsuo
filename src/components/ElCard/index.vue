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
  padding: 0 24px 24px;
  border: 1px solid var(--card-border-color);
  background: var(--background-color);
  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    border-bottom: 1px solid var(--card-border-color);
  }
  .card-title {
    font-size: 14px;
    color: var(--normal-title-color);
  }

  .card-content {
    margin-top: 16px;
    height:calc(100% - 64px);
  }
}
</style>
