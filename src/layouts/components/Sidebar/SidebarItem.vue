<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import SidebarItemLink from "./SidebarItemLink.vue";
import { getCssVariableValue } from "@/utils";

// 定义变量

const props = defineProps({
  route: {
    type: Object,
    default: () => {},
  },
});

const routeChildLength = computed(() => {
  return props.route.children.length;
});
</script>

<template>
  <!-- 只有一层 -->
  <SidebarItemLink v-if="routeChildLength === 1" :path="route.path">
    <el-menu-item :index="route.path">
      <Icon :iconClass="route.icon" v-if="route.icon"/>
      <template #title>
        {{ route.children[0].meta.name }}
      </template>
    </el-menu-item>
  </SidebarItemLink>
  <!-- 多层 -->
  <el-sub-menu v-else :index="route.path">
    <template #title>
      <!-- <SvgIcon
        v-if="props.item.meta?.svgIcon"
        :name="props.item.meta.svgIcon"
      /> -->
      <span v-if="props.route.meta?.title">{{ props.route.meta.title }}</span>
    </template>
  </el-sub-menu>
</template>
