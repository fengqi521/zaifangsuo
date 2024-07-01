<script setup>
import { ref, onMounted } from "vue";
import { Logo, CurrentDate, Avatar, SignOut, Setting } from "./components";
const avatarUrl = ref("");
onMounted(() => {
  avatarUrl.value =
    "http://5b0988e595225.cdn.sohucs.com/images/20190816/8afe3bfafdfa43a5ad75f0150af013df.jpeg";
});
</script>
<template>
  <nav class="layout-header">
    <!-- 顶部导航-logo -->
    <Logo />
    <!-- 顶部导航-用户信息 -->
    <div class="layout-user">
      <CurrentDate />
      <Avatar :avatarUrl="avatarUrl" />
      <SignOut />
    </div>
  </nav>
</template>
<style lang="scss" scoped>
.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: var(--nav-header-height);
  color: var(--nav-header-text-color);
  background: var(--nav-header-bg-color);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  z-index: 4;

  .layout-user {
    display: flex;
    align-items: center;
  }
}
</style>
