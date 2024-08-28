<script setup>
import { ref } from "vue";
import Bread from "@/components/Bread/index.vue";
import DownList from "./components/DownList.vue";
import UpList from "./components/UpList.vue";

const activeTab = ref("down");
</script>

<template>
  <div>
    <Bread :breadList="[{ title: '报警管理' }]" />
    <el-tabs type="border-card" class="command-tabs" v-model="activeTab">
      <el-tab-pane label="下发报警记录" name="down">
        <DownList v-if="activeTab === 'down'"
      /></el-tab-pane>
      <el-tab-pane label="上报报警记录" name="up"
        ><UpList v-if="activeTab === 'up'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
