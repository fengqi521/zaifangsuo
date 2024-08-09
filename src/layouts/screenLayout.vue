<template>
  <div class="geo-app">
    <div
      :class="[`geo-box geo-box-${theme}`, { 'geo-box-config': !show }]"
      :style="getViewStyle"
    >
      <div class="screen-head">
        <span class="screen-title">地质监测数据统计中心</span>
      </div>
      <App-main />
    </div>
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
  getScreenSize();
  window.addEventListener("resize", getScreenSize);
});

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
  width: 100%;
  height: -moz-calc(100vh);
  height: -webkit-calc(100vh);
  height: calc(100vh);
  background: #00040f;
  overflow: hidden;
  .geo-box {
    overflow: hidden;
    position: absolute;
    padding-top: 102px;
    transform-origin: 0 0;
    background: url("@/assets/images/screen-bg.png") no-repeat;
    background-size: cover;

    .screen-head {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 102px;
      text-align: center;
      background: url("@/assets/images/screen-head-1.png") no-repeat;
      background-size: cover;
    }

    .screen-title {
      font-size: 40px;
      line-height: 102px;
      font-weight: bold;
      background: linear-gradient(to bottom, #f7fdff, #2ac0f9);
      -webkit-background-clip: text;
      letter-spacing: 6px;
      -webkit-text-fill-color: transparent; /* 使文字填充透明 */
      // text-shadow:
      //           1px 1px 2px rgba(0, 0, 0, 0.3), /* 主阴影 */
      //           0 0 5px rgba(0, 0, 0, 0.5), /* 辅助阴影 */
      //           0 0 10px rgba(0, 0, 0, 0.4), /* 辅助阴影 */
      //           0 0 15px rgba(0, 0, 0, 0.3); /* 辅助阴影 */
    }

    .app-main {
      height: 100%;
    }
  }
}
</style>
