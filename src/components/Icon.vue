<template>
    <i :class="['iconfont', iconClass]" :style="{ fontSize: size, color }"></i>
  </template>
  
  <script setup>
  
  const props = defineProps({
    iconClass: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "16px",
    },
    color: {
      type: String,
      default: "#000",
    },
  });
  </script>
  <style lang="scss" scoped>
.iconfont{
  width:24px;
  display: flex;
  justify-content: center;
}
</style>
  