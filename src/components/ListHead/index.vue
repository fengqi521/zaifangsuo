<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="head-container">
    <span>{{ title }}</span>
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.head-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding-inline: 16px;
  height: 48px;
  font-size: 14px;
  color: var(--normal-title-color);
  font-weight: 700;
}
</style>
