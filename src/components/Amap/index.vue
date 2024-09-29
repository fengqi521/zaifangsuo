<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { useMessage } from "@/plugins/message";
window._AMapSecurityConfig = {
  securityJsCode: "883efcc600ab525d6ffbacc606b5f754",
};

const emit = defineEmits(["update:modelValue"]);

const mapAddress = ref("");
const optionShow = ref(false);
let AMap = null;
let marker = null;
let map = null;
let geocoder = null;
let autoComplete = null;
let options = ref([]);
// 初始化地图
const initAMap = async () => {
  AMap = await AMapLoader.load({
    key: "5720a2ba222abdff67d2c920407d3304",
    version: "2.0",
    plugins: [
      "AMap.PlaceSearch", // POI搜索插件
      "AMap.Geocoder", //定位
      "AMap.AutoComplete",
    ],
  });
  // 初始化地图
  map = new AMap.Map("amap-container", {
    viewMode: "2D", // 是否为3D地图模式
    zoom: 10, // 初始化地图级别
    center: [116.397428, 39.90923],
  });
  // 初始化地理数据
  geocoder = new AMap.Geocoder({
    city: "010",
    radius: 1000,
  });

  // 输入提示
  const autoOptions = {
    //city 限定城市，默认全国
    city: "全国",
  };
  autoComplete = new AMap.AutoComplete(autoOptions);

  marker = new AMap.Marker();
  mapClick();
  // mapSearch();
};

// 点击地图
const mapClick = () => {
  if (!map) return;
  map.on("click", function (ev) {
    map.add(marker);
    marker.setPosition(ev.lnglat);
    // 位置转详细地址
    getRegeoCode(ev.lnglat);
  });
};

// 位置转详细地址
const getRegeoCode = (lnglat) => {
  const location = [lnglat.lng, lnglat.lat];
  geocoder.getAddress(location, function (status, { regeocode }) {
    if (status === "complete" && regeocode) {
      const address = regeocode?.formattedAddress;
      if (regeocode?.addressComponent?.citycode !== "010") {
        useMessage().warning("当前位置非北京地区");
        return;
      }
      emit("update:modelValue", {
        location: address,
        longitude: lnglat.lng,
        latitude: lnglat.lat,
        zone: regeocode?.addressComponent?.adcode + "000000",
      });
    }
  });
};

// 远程搜索搜索地图
const mapSearch = (keyword) => {
  autoComplete.search(keyword, function (status, result) {
    //搜索成功时，result 即是对应的匹配数据
    options.value = result?.tips;
    if (!result?.tips?.length) return;
    optionShow.value = true;
  });
};

// 点击搜索项
const handleSelect = (item) => {
  mapAddress.value = item.name;
  optionShow.value = false;
  const _pos = {
    lnglat: {
      lng: item.location.lng,
      lat: item.location.lat,
    },
  };
  map.setZoomAndCenter(10, [_pos.lnglat.lng, _pos.lnglat.lat]);
};
onMounted(() => {
  initAMap();
});
onUnmounted(() => {
  map?.destroy();
});
</script>
<template>
  <div class="map-wrapper">
    <div id="amap-container" class="amap-container"></div>
    <el-input
      class="tipinput"
      v-model="mapAddress"
      placeholder="请输入内容"
      @input="mapSearch"
    >
    </el-input>
    <ul class="tip-option" v-if="optionShow">
      <li
        class="tip-option__item"
        @click="handleSelect(item)"
        v-for="(item, index) in options"
        :key="item.name"
        :title="item.name"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  .amap-container {
    width: 100%;
    height: 100%;
  }
  .tipinput {
    position: absolute;
    left: 20px;
    top: 20px;
    width: 40%;
  }

  .tip-option {
    position: absolute;
    left: 20px;
    top: 54px;
    width: 40%;
    background: #fff;
    max-height: 80%;
    overflow-y: auto;
    border-radius: 3px;
    @extend %scrollbar;
    &__item {
      white-space: nowrap;
      line-height: 24px;
      padding: 8px;
      font-size: 12px;
      @extend %ellipsis;
    }
  }
}
</style>
