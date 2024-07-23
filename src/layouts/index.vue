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
