<script lang="ts" setup>
import { computed } from "vue";
import SidebarItemLink from "./SidebarItemLink.vue";
import path from "path-browserify";
// 定义变量

const props = defineProps({
  route: {
    type: Object,
    default: () => {},
  },
  basePath: {
    type: String,
    default: "",
  },
});

// 当前路由下的子路由
const childRoutes = computed(() => {
  return props?.route?.children?.filter((child) => !child?.meta?.hidden) ?? [];
});

// 判断当前是否是一级路由
const onlyOneChild = computed(() => {
  const childLength = childRoutes.value?.length;
  switch (true) {
    case childLength > 1:
      return null;
    case childLength === 1:
      return childRoutes.value[0];
    default:
      return { ...props.route, path: "" };
  }
});

/** 解析路径 */
const resolvePath = (routePath) => {
  return path.resolve(props.basePath, routePath);
};
</script>

<template>
  <!-- 只有一层 -->
  <SidebarItemLink
    v-if="onlyOneChild && !onlyOneChild.children"
    :path="resolvePath(route.path)"
    :meta="onlyOneChild?.meta"
  >
    <el-menu-item :index="resolvePath(onlyOneChild.path)">
      <Icon
        :iconClass="onlyOneChild?.meta.icon"
        :size="onlyOneChild?.meta.size"
        v-if="onlyOneChild?.meta?.icon"
      />
      <div v-else class="title-left"></div>
      <template #title>
        {{ onlyOneChild.meta.title }}
      </template>
    </el-menu-item>
  </SidebarItemLink>
  <!-- 多层 -->
  <el-sub-menu v-else :index="resolvePath(route.path)">
    <template #title>
      <Icon
        :iconClass="props.route.meta.icon"
        v-if="props?.route?.meta?.icon"
      />
      <span v-if="props.route.meta?.title">{{ props.route.meta.title }}</span>
    </template>
    <template v-if="props.route.children">
      <SidebarItem
        v-for="child in childRoutes"
        :key="child.path"
        :route="child"
        :base-path="resolvePath(child.path)"
      />
    </template>
  </el-sub-menu>
</template>
