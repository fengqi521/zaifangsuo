<script setup></script>

<template>
  <section class="app-main">
    <!-- <TagsView /> -->
    <router-view v-slot="{ Component, route }">
      <!-- <transition name="el-fade-in" mode="out-in"> -->
        <!-- <keep-alive> -->
        <component :is="Component" :key="route.path" />
        <!-- </keep-alive> -->
      <!-- </transition> -->
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
@import "@/styles/tools.scss";

.app-main {
  padding: 0 16px 16px;
}
</style>
