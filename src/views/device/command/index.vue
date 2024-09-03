<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import Bread from "@/components/Bread/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import Function from "./components/Function.vue";
import Alarm from "./components/Alarm.vue";
const {
  params: { name, type },
} = useRoute();
// 导航
const breadList = [{ to: "/device", title: "设备管理" }, { title: "指令下发" }];

const activeTab = ref("data");
</script>

<template>
  <div>
    <!-- 导航 -->
    <Bread :breadList="breadList" />

    <!-- 设备名称 -->
    <p class="command-name">{{ name }}</p>

    <el-tabs type="border-card" class="command-tabs" v-model="activeTab">
      <el-tab-pane label="下发功能指令" name="data">
        <Function v-if="activeTab === 'data'" />
      </el-tab-pane>
      <el-tab-pane label="下发报警指令" name="alarm">
        <Alarm v-if="activeTab === 'alarm'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.command-name {
  padding-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #666;
  line-height: 20px;
}

.command-tabs {
  :deep(.el-tabs__item) {
    height: 32px;
    font-size: 12px;
  }
}
</style>
