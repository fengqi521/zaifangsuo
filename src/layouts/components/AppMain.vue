<script setup>
import TagsView from "./TagsView/index.vue";
</script>

<template>
  <section class="app-main">
    <!-- <TagsView /> -->
    <router-view v-slot="{ Component, route }">
      <!-- <keep-alive> -->
      <component :is="Component" :key="route.path" />
      <!-- </keep-alive> -->
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
@import "@/styles/tools.scss"; 

.app-main {
  padding: 0 16px 16px;
}
</style>
