<script setup>
import { RouterView } from "vue-router";
import { useThemeHook } from "@/hooks/useTheme";
const { initTheme } = useThemeHook();
// 初始化主题
initTheme();
</script>

<template>
  <RouterView />
</template>
