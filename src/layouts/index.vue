<template>
  <div>
    <!-- 顶部导航 -->
    <Nav />
    <!-- 主页面 -->
    <Main />
  </div>
</template>
<script setup>
import { computed, watchEffect } from "vue";
import Nav from "./Nav.vue";
import Main from "./Main.vue";
</script>
<style lang="scss" scoped>
.showGreyMode {
  filter: grayscale(1);
}

.showColorWeakness {
  filter: invert(0.8);
}
</style>
