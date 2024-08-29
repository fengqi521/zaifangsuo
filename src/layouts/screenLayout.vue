<template>
  <div class="geo-app">
    <div class="screen-head">
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
const screenObj = {
  width: 1920,
  height: 1080,
};

const screenStyle = ref({
  width: 0,
  height: 0,
});
onMounted(() => {
  // getScreenSize();
  // window.addEventListener("resize", getScreenSize);
  setRootFontSize(1080); // 设置根字体大小
  window.addEventListener("resize", () => setRootFontSize(1080)); // 监听窗口调整
});

const setRootFontSize = (designWidth) => {
  const clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (!clientWidth) return;
  console.log(clientWidth)
  const fontSize = (clientWidth * 100 )/designWidth
  document.documentElement.style.fontSize = fontSize + "px";
};

// 计算页面缩放
const getViewStyle = computed(() => {
  const screenWidth = screenStyle.value.width;
  const screenHeight = screenStyle.value.height;
  let widthScale = screenWidth / screenObj.width;
  let heightScale = screenHeight / screenObj.height;
  const viewScale = widthScale > heightScale ? heightScale : widthScale;

  let _left = screenWidth - screenObj.width * viewScale;
  let _top = screenHeight - screenObj.height * viewScale;
  _left = (_left <= 0 ? 0 : Math.abs(_left) / 2).toFixed(2) + "px";
  _top = (_top <= 0 ? 0 : Math.abs(_top) / 2).toFixed(2) + "px";
  const scale = viewScale.toFixed(2);
  screenStore.setScale(scale);
  let attr = `transform: scale(${scale});
          width:${screenObj.width}px;
          height:${screenObj.height}px;
          left:${_left};
          top:${_top}`;
  return attr;
});

// 获取屏幕的尺寸
const getScreenSize = () => {
  screenStyle.value.width = window.innerWidth < 1200 ? 1200 : window.innerWidth;
  screenStyle.value.height =
    window.innerHeight < 600 ? 600 : window.innerHeight;
};
</script>

<style lang="scss" scoped>
.geo-app {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background: url("@/assets/images/screen-bg.png") no-repeat;
  background-size: cover;
  .screen-head {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 0.8rem;
    text-align: center;
  }

  .screen-title {
    font-size: 40px;
    line-height: 102px;
    font-weight: bold;
    background: linear-gradient(to bottom, #f7fdff, #2ac0f9);
    -webkit-background-clip: text;
    letter-spacing: 6px;
    -webkit-text-fill-color: transparent; /* 使文字填充透明 */
  }

  .app-main {
    position: absolute;
    top: 0.8rem;
    bottom:0;
    height: calc(100% - 0.8rem);
  }
}
</style>
