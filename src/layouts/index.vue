<template>
  <div>
    <!-- 顶部导航 -->
    <Nav />
    <!-- 主页面 -->
    <Main />
  </div>
</template>
<script setup>
import Nav from "./Nav.vue";
import Main from "./Main.vue";
import { useTimeoutHook } from "@/hooks/useTimeout";
import { onMounted } from "vue";

useTimeoutHook();
</script>
<style lang="scss" scoped>
.showGreyMode {
  filter: grayscale(1);
}

.showColorWeakness {
  filter: invert(0.8);
}
</style>
