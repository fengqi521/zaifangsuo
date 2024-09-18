<template>
  <div class="geo-app" v-loading="loading">
    <div class="screen-head" :style="`transform:scale(${screenStore.scale})`">
      <span class="screen-title"
        >北京市突发地质灾害监测预警提升工程运维管理平台</span
      >
    </div>
    <App-main />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { AppMain } from "./components";
import { useScreenStoreHook } from "@/store/modules/screen";
const screenStore = useScreenStoreHook();
const loading = ref(true)
const screenObj = {
  width: 1920,
  height: 1080,
};

const screenStyle = ref({
  width: 0,
  height: 0,
});

onMounted(() => {
  getScreenSize();
  window.addEventListener("resize", getScreenSize);
  setTimeout(()=>{loading.value = false},3000)
});

// 计算页面缩放
const getViewStyle = () => {
  const screenWidth = screenStyle.value.width;
  const screenHeight = screenStyle.value.height;
  let widthScale = screenWidth / screenObj.width;
  let heightScale = screenHeight / screenObj.height;
  const viewScale = widthScale > heightScale ? heightScale : widthScale;

  let _left = screenWidth - screenObj.width * viewScale;
  let _top = screenHeight - screenObj.height * viewScale;
  _left = (_left <= 0 ? 0 : Math.abs(_left) / 2).toFixed(2) + "px";
  _top = (_top <= 0 ? 0 : Math.abs(_top) / 2).toFixed(2) + "px";
  const scaleRate = viewScale.toFixed(2);
  screenStore.setScale({
    rate: Number(scaleRate),
    high: (screenHeight - 118) / Number(scaleRate),
  });
};

// 获取屏幕的尺寸
const getScreenSize = () => {
  screenStyle.value.width = window.innerWidth < 1200 ? 1200 : window.innerWidth;
  screenStyle.value.height =
    window.innerHeight < 600 ? 600 : window.innerHeight;
  getViewStyle();
};
</script>

<style lang="scss" scoped>
.geo-app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: -moz-calc(100vh);
  height: -webkit-calc(100vh);
  height: calc(100vh);
  background: #00040f;
  overflow: hidden;

  .screen-head {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 102px;
    text-align: center;
    z-index: 2;

    .screen-title {
      font-size: 40px;
      line-height: 102px;
      font-weight: bold;
      background: linear-gradient(to bottom, #f7fdff, #2ac0f9,);
      -webkit-background-clip: text;
      letter-spacing: 6px;
      -webkit-text-fill-color: transparent; /* 使文字填充透明 */
      // text-shadow: 1px 1px 1px black;


    }
  }

  .app-main {
    height: 100%;
    padding: 0;
    // margin-top: 102px;
  }
}
</style>
