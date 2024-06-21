<script setup>
import { Sidebar, AppMain } from "./components";
</script>
<template>
  <div class="main-container">
    <!-- 左侧边栏 -->
    <Sidebar class="sidebar-container" />
    <!-- 页面主体内容 -->
    <AppMain class="app-main" />
  </div>
</template>
<style lang="scss" scoped>
.main-container {
  position: absolute;
  left: 0;
  right: 0;
  top: var(--nav-header-height);
  height: var(--main-height);
  display: flex;

  .sidebar-container {
    // transition: width $transition-time;
    position: fixed;
    top: var( --nav-header-height);
    bottom: 0;
    left: 0;
    // z-index: 1001;
    // overflow: hidden;
    padding: 24px 0;
    min-width: var(--sidebar-width);
    background-color: var(--sidebar-bg-color);
    border-right: var(--v3-sidebar-border-right);
  }

  .app-main{
    margin-left:  var(--sidebar-width);
  }
}
</style>
