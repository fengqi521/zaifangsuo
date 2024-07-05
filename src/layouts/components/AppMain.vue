<script setup>
import TagsView from "./TagsView/index.vue";
</script>

<template>
  <section class="app-main">
    <!-- <TagsView /> -->
    <div class="app-scrollbar app-container">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component
            :is="Component"
            :key="route.path"
          />
        </keep-alive>
      </router-view>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/styles/tools.scss";

.app-main {
  width: 100%;
}

.app-scrollbar {
  flex-grow: 1;
  overflow: auto;
  @extend %scrollbar;
}

.app-container {
  height:100%;
  // padding:calc(var(--tagsview-height) + 20px) 16px 16px 16px;
  padding:0 16px 16px;

}
</style>
