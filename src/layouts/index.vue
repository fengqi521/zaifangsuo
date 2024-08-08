<template>
  <!-- 顶部导航 -->
  <Nav />
  <!-- 主页面 -->
  <Main />
</template>
<script setup>
import Nav from "./Nav.vue";
import Main from "./Main.vue";
import { useTimeoutHook } from "@/hooks/useTimeout";
useTimeoutHook();
</script>
