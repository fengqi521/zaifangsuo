<script setup>
import {ref} from 'vue'
import Bread from "@/components/Bread/index.vue";
// 导航
const breadList = ref([
  { to: "/rtu", title: "设备管理" },
  { title: "指令下发" },
]);
</script>
<template>
  <div>
    <!-- 导航 -->
    <Bread :breadList="breadList" />
    </div>
</template>
