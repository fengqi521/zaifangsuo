<script setup>
import { Sidebar, AppMain } from "./components";
</script>
<template>
  <section class="main-container">
    <!-- 左侧边栏 -->
    <Sidebar class="sidebar-container" />
    <!-- 页面主体内容 -->
    <AppMain />
  </section>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
.main-container {
  display: flex;
  flex-direction: row;
  margin-top: var(--nav-header-height);
  height: var(--main-height);

  .sidebar-container {
    padding: 24px 0;
    min-width: var(--sidebar-width);
    background-color: var(--sidebar-bg-color);
    border-right: var(--v3-sidebar-border-right);
    overflow-y: auto;
    z-index: 3;
    @extend %scrollbar;
  }
}
</style>
