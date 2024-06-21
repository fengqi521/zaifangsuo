<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
// import {SidebarItem} from './components/SidebarItem/index.vue'
import { useAppStore } from "@/stores/modules/app";
import { getSideData } from "@/api/index-demo";
// 请求sidebar数据
const appStore = useAppStore();
onMounted(async () => {
  const result = await getSideData();
  appStore.setSideLists(result);
});

const backgroundColor = "var(--sidebar-bg-color)";
const activeMenu = computed(() => {
  return "var(--icon-color)";
});
</script>

<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      :background-color="backgroundColor"
    >
      <el-menu-item index="1">
        <Icon iconClass="icon-ai-home" color="#38b487" />
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="2">
        <Icon iconClass='icon-shujukanban' color="#FFF"/>
        <span>设备管理</span>
      </el-menu-item>
      <el-sub-menu index="3">
        <template #title>
          <Icon iconClass='icon-yonghuguanli' color="#FFF"/>
          <span>用户管理</span>
        </template>
        <el-menu-item index="3-1">
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="3-2">
          <template #title>权限管理</template>
        </el-menu-item>
        <el-menu-item index="3-3">
          <template #title>角色管理</template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.el-menu {
  border: none;
  min-height: 100%;
  width: 100% !important;
  user-select: none;

  .iconfont {
    margin-right: 15px;
  }
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu .el-menu-item) {
  height: var(--sidebar-menu-item-height);
  line-height: var(--sidebar-menu-item-height);
  color: var(--sidebar-title-color);
  font-size: 14px;
  &.is-active,
  &:hover {
    color: var(--sidebar-active-color);
    background: var(--nav-header-bg-color);
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
