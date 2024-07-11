<script setup>
import { onMounted, reactive, ref } from "vue";
import { DEVICE_DATA, MESSAGE } from "@/constants";
import Message from "./components/Message/index.vue";
import Device from "./components/Device/index.vue";
import Echart from './components/Echart/index.vue'

const messages = ref([...MESSAGE])
const cardLists = [
  { field: "total", count: 26 },
  { field: "online", count: 10 },
  { field: "offline", count: 16 },
];

onMounted(() => {
  setInterval(() => {
    messages.value.push(messages.value[0])
  }, 1000)
})

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
    <!-- 左侧图表 -->
    <!-- <div class="home-left"> -->
    <Echart />
    <!-- <Card :deviceCardLists="DEVICE_DATA" /> -->
    <Device />
    <!-- </div> -->
    <!-- 报文数据 -->
    <Message :messages="messages" />
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
