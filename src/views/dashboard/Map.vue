<template>
  <div class="map-container">
    <el-select
      v-model="selectList"
      class="map-select"
      style="width: 240px"
      @change="handleChangeDevice"
    >
      <el-option
        v-for="(item, index) in deviceList"
        :key="index"
        :label="item.device_name"
        :value="item.device_number"
      />
    </el-select>
    <div class="map" id="cesiumContainer" ref="cesiumRef"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import * as Cesium from "cesium";
import { useScreenStoreHook } from "@/store/modules/screen";
const screenStore = useScreenStoreHook();
let viewer;
const prevMarker = ref(null);
const selectList = ref("");
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  90,
  -20,
  110,
  90
);
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNTVmZTY5OS02NTU5LTRjOGQtYWExZS04OTdhYzM4OWM5OGEiLCJpZCI6MjMyNzM1LCJpYXQiOjE3MjI4NTY5NDJ9.j5avjfYqPsXLfJrCzdsnV-XmhawsCYaEih7o2N-K4y8";

const props = defineProps({
  deviceList: {
    type: Array,
    default: () => [],
  },
  fetchData: {
    type: Function,
    default: () => {},
  },
});

// 动态获取图片
const images = import.meta.glob("@/assets/images/*.png", { eager: true });
const getImagePath = (imageName) => {
  return images[`/src/assets/images/${imageName}`]?.default || "";
};

// 加载地图
onMounted(async () => {
  viewer = new Cesium.Viewer("cesiumContainer", {
    infoBox: false,
    animation: false,
    homeButton: false,
    geocoder: false,
    baseLayerPicker: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    selectionIndicator: false,
    orderIndependentTranslucency: false,
    contextOptions: {
      webgl: {
        alpha: true,
      },
    },
  });
  viewer._cesiumWidget._creditContainer.style.display = "none";
  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;
  viewer.scene.undergroundMode = true;
  viewer.scene.fxaa = false;
  viewer.scene.postProcessStages.fxaa.enabled = false;
  viewer.scene.fog.enable = false; // 雾
  viewer.scene.globe.showGroundAtmosphere = false; // 大气
  viewer.scene.skyBox.show = false;
  viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
  watchEffect(() => {
    const div = document.querySelector(".cesium-viewer");
    if (!div) return;
    div.style.transform = `scale(${1 / screenStore.scale},${
      1 / screenStore.scale
    })`;
    div.style.transformOrigin = "center";
  });
});

// 切换地图位置
const handleChangeDevice = (code) => {
  const list = props.deviceList.find((item) => item.device_number === code);
  const { langitude, latitude } = list;

  const long = Number(langitude);
  const lat = Number(latitude);
  setTimeout(() => {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(long, lat, 10000), // 目标位置的经纬度和高度
      orientation: {
        heading: Cesium.Math.toRadians(0), // 设置方向，0度表示朝向北
        pitch: Cesium.Math.toRadians(-90), // 设置倾角，-90度表示垂直向下
        roll: 0.0, // 设置滚动，0度表示没有滚动
      },
      duration: 3, // 动画持续时间（秒）
    });
  }, 1000);

  const marker = viewer.entities.getById(list.device_number);
  updateMarker(marker, 0.6);
  // 请求接口数据
  screenStore.setData("id", list.id);
  screenStore.setData("type", list.device_type);

  props.fetchData();
};

// 添加marker
const addMarker = (item) => {
  let markUrl = "";
  if (item.device_type === 1) {
    item.deviceTypeId = "泥位计";
    markUrl = "deviceType01";
  } else if (item.device_type === 2) {
    item.deviceTypeId = "雨量计";
    markUrl = "deviceType02";
  } else if (item.device_type === 3) {
    item.deviceTypeId = "断线传感器";
    markUrl = "deviceType03";
  }

  if (item.online === 0) {
    item.deviceState = "正常";
    markUrl += "d.png";
  } else if (item.online === 1) {
    item.deviceState = "报警";
    markUrl += "d.png";
  } else {
    item.deviceState = "暂无";
  }
  viewer.entities.add({
    id: item.device_number,
    name: item.device_name,
    position: Cesium.Cartesian3.fromDegrees(
      Number(item.langitude),
      Number(item.latitude)
    ),
    billboard: {
      image: getImagePath(markUrl),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      scale: 0.6,
    },
    label: {
      text: item.device_name,
      font: "18px Helvetica",
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      fillColor: Cesium.Color.AZURE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian3(0, -55, 0),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        0.0,
        2000000
      ),
    },
    data: item,
  });
};

// 更新marker
const updateMarker = (marker) => {
  if (prevMarker.value) {
    prevMarker.value.billboard.scale = 0.6;
  }
  if (marker) {
    prevMarker.value = marker;
    marker.billboard.scale = new Cesium.CallbackProperty(() => {
      let a = Date.now() / 200;
      a = Number(((Math.sin(a) + 1) / 20 + 0.7).toFixed(2));
      return a;
    }, false);
  }
};

// 数据
watchEffect(() => {
  setTimeout(() => {
    props.deviceList.forEach((item) => {
      addMarker(item);
    });
    selectList.value = props.deviceList[2].device_number;

    handleChangeDevice(selectList.value);
  }, 3000);
});

// marker点击事件
const handleClick = (handler) => {
  if (!handler) return;
  handler.setInputAction(function (movement) {
    const pick = viewer.scene.pick(movement.position); // 使用 endPosition
    if (Cesium.defined(pick) && pick.id.id) {
      console.log(Cesium.defined(pick));
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
</script>

<style>
@import "cesium/Build/Cesium/Widgets/widgets.css";
#cesiumContainer {
  height: 100%;
  overflow: hidden;
}

.map-container {
  position: relative;
  flex: 1;
  .map-select {
    position: absolute;
    left: 24px;
    top: 24px;
    z-index: 2;

    .el-select__wrapper {
      border-radius: 10px;
    }
  }
}
</style>
