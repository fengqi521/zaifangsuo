<script setup>
import { ref } from "vue";

import Bread from "@/components/Bread/index.vue";
import Message from "./components/Message/index.vue";
import Device from "./components/Device/index.vue";
import Echart from "./components/Echart/index.vue";
import { DEVICE_DATA } from "@/constants";

const breadList = ref([{ title: "首页" }]);

const cardLists = [
  { field: "total", count: 26 },
  { field: "online", count: 10 },
  { field: "offline", count: 16 },
];

DEVICE_DATA.forEach((device, index) => {
  const card = cardLists.find((item) => item.field === device.field);
  if (card) {
    device.count = card.count;
    device.bg = `var(--card-bg-${(index + 1) % 4})`;
  }
});

</script>
<template>
  <div class="home-container">
    <Bread :breadList="breadList" />
    <!-- 图表 -->
    <Echart />

    <!-- 设备数据 -->
    <Device />

    <!-- </div> -->
    <!-- 报文数据 -->
    <Message />
  </div>
</template>
<style lang="scss" scoped>
.home-container {
  position: relative;

  .home-left {
    // height:332px;
    // width:  calc(100% - var(--home-message-width) - 16px) ;
  }
}
</style>
