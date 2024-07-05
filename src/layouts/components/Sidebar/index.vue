<script setup>
import { computed, onMounted } from "vue";
import { usePermissionStore } from "@/stores/modules/permission";
import SidebarItem from "./SidebarItem.vue";

const { routes } = usePermissionStore();
onMounted(async () => {
  // const result = await getSideData();
  // appStore.setSideLists(result);
});

const backgroundColor = "var(--sidebar-bg-color)";

const activeMenu = computed(() => {
  return "var(--icon-color)";
});
</script>

<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :background-color="backgroundColor"
      :unique-opened="true"
      :collapse-transition="false"
    >
      <SidebarItem
        v-for="route in routes"
        :key="route.path"
        :route="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.el-menu {
  border: none;
  min-height: 100%;
  width: 100% !important;
  user-select: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu .el-menu-item) {
  height: var(--sidebar-menu-item-height);
  line-height: var(--sidebar-menu-item-height);
  color: var(--sidebar-title-color);
  font-size: 14px;
  .title-left {
    margin-left: 24px;
  }
  .iconfont {
    margin-right: 18px;
    color: var(--sidebar-title-color) !important;
  }

  &.is-active {
    color: var(--sidebar-active-color);
    background: var(--sidebar-active-bg-color);

    .iconfont {
      color: var(--sidebar-active-color) !important;
    }
  }

  &:hover {
    color: var(--sidebar-title-color);
    background: var(--sidebar-hover-bg-color);
    .iconfont {
      color: var(--sidebar-title-color) !important;
    }
  }
}

:deep(.el-sub-menu) {
  &.is-active {
    > .el-sub-menu__title {
      color: v-bind(activeTextColor) !important;
    }
  }
}
</style>
