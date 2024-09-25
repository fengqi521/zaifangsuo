<template>
  <div class="map-container">
    <el-select
      :style="`transform:scale(${screenStore.scale});left:${
        482 * screenStore.scale
      }px`"
      v-model="selectList"
      class="map-select"
      style="width: 310px"
      @change="handleChangeDevice"
      filterable
    >
      <el-option
        v-for="(item, index) in deviceList"
        :key="index"
        :label="item.device_name"
        :value="item.device_number"
        style="width: 100%"
      />
    </el-select>
    <div class="map" id="cesiumContainer" ref="cesiumRef"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { isEqual, omit } from "lodash";
import * as Cesium from "cesium";
import { useScreenStoreHook } from "@/store/modules/screen";
import beijinJson from "@/js/beijingGeometry.json";
import wallImage from "@/assets/images/fence-top.png";
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
const tiandiKey = "f6a6c4672a306047016f52afe06c5f37";
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
  // 添加全球遮罩
  // createGlobalMask();
  // setMapData()
  // watchEffect(() => {
  //   const div = document.querySelector(".cesium-viewer");
  //   if (!div) return;
  //   div.style.transform = `scale(${1 / screenStore.scale},${
  //     1 / screenStore.scale
  //   })`;
  //   div.style.transformOrigin = "center";
  // });

  // getMapBoundary();
});

// 加载不同数据
const setMapData = () => {
  viewer.imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      url:
        "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" +
        tiandiKey,
      layer: "tdtAnnoLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
      show: false,
    })
  );
};

// 获取地图边界
let globalTileset;
const getMapBoundary = async () => {
  globalTileset = await Cesium.createGooglePhotorealistic3DTileset();
  viewer.scene.primitives.add(globalTileset);
  const { features } = beijinJson;
  const maskpointArray = [];
  // 这里的数据筛选要大家根据自己的json数据结构进行获取
  const arr = features[0].geometry.coordinates[0][0];
  // 处理莱西市的边界数据，整理成我们想要的格式
  for (let i = 0, l = arr.length; i < l; i++) {
    maskpointArray.push(arr[i][0]);
    maskpointArray.push(arr[i][1]);
  }
  // 将其转换成下边渲染entity所需的3D笛卡尔坐标系。
  // var maskspoint = Cesium.Cartesian3.fromDegreesArray(maskpointArray);
  const positions = Cesium.Cartesian3.fromDegreesArray(
    maskpointArray.splice(0, 20)
  );
  const clippingPolygons = new Cesium.ClippingPolygonCollection({
    polygons: [
      new Cesium.ClippingPolygon({
        positions: positions,
      }),
    ],
  });
  globalTileset.clippingPolygons = clippingPolygons;
  clippingPolygons.enabled = true;
  return;
  maskspoint = maskspoint.map((item) => {
    item.z = item.z + 2000;
    return item;
  });
  const area1 = new Cesium.Entity({
    id: 1,
    polygon: {
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          0, 0, 0, 90, 179, 90, 179, 0,
        ]),
        holes: [
          {
            positions: maskspoint,
          },
        ],
      },
      material: Cesium.Color.BLACK.withAlpha(0.5), // 黑色半透明遮罩
    },
  });

  // 绘制面
  // const area = new Cesium.Entity({
  //   id: 2,
  //   name: "北京市",
  //   polygon: {
  //     hierarchy: new Cesium.PolygonHierarchy(maskspoint),
  //     height: 300,
  //     material: Cesium.Color.RED.withAlpha(0),
  //   },
  // });
  // viewer.value = new Cesium.Viewer("cesiumContainer", {
  //   baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
  //     url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
  //     minimumLevel: 1,
  //     maximumLevel: 18
  //   })),
  // });

  // 边界墙
  const imageMaterial = new Cesium.ImageMaterialProperty({
    image: wallImage,
  });
  const wall = new Cesium.Entity({
    wall: {
      positions: maskspoint,
      maximumHeights: maskspoint.map((res) => {
        return 300;
      }),
      minimumHeights: maskspoint.map((res) => {
        return -900;
      }),
      material: imageMaterial,
    },
  });

  viewer.entities.add(area1);
  // viewer.entities.add(area);
  viewer.entities.add(wall);
};

// 切换地图位置
const handleChangeDevice = (code) => {
  const list = props.deviceList.find((item) => item.device_number === code);
  const { langitude, latitude } = list;

  const long = Number(langitude);
  const lat = Number(latitude);

  setTimeout(() => {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(long, lat - 0.1, 10000), // 目标位置的经纬度和高度
      orientation: {
        heading: Cesium.Math.toRadians(0), // 设置方向，0度表示朝向北
        pitch: Cesium.Math.toRadians(-40), // 设置倾角，-90度表示垂直向下
        roll: 0, // 设置滚动，0度表示没有滚动
      },
      duration: 3, // 动画持续时间（秒）
    });
  }, 1000);

  const marker = viewer.entities.getById(list.addr);
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
    markUrl += ".png";
  } else if (item.online === 1) {
    markUrl += "d.png";
  }
  viewer.entities.add({
    id: item.addr,
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

    // 查找相同经纬度的marker
    handleSameLocationMarker(marker);

    marker.billboard.scale = new Cesium.CallbackProperty(() => {
      let a = Date.now() / 200;
      a = Number(((Math.sin(a) + 1) / 20 + 0.7).toFixed(2));
      return a;
    }, false);
  }
};

// 相同经纬度marker处理
const handleSameLocationMarker = (marker) => {
  const markers = viewer.entities.values;
  markers.forEach((item) => (item.show = true));
  const isSameMarker = markers.filter(
    (item) =>
      item.data.langitude === marker.data.langitude &&
      item.data.latitude === marker.data.latitude
  );
  const otherMarkers = isSameMarker.filter((item) => item.id !== marker.id);
  isSameMarker.length > 1 &&
    otherMarkers.forEach((item) => (item.show = false));
};

// 创建全球遮罩
const createGlobalMask = () => {
  const scene = viewer.scene;
  const globe = scene.globe;

  // 遮罩半透明效果
  const color = Cesium.Color.WHITE.withAlpha(0.5);

  // 创建遮罩体
  const mask = new Cesium.CustomSensorVolume(globe.baseColor);
  mask.radius = globe.ellipsoid.maximumRadius;
  mask.sensorRadius = 0.99 * globe.ellipsoid.maximumRadius;
  mask.offsetAttribute = Cesium.GeometryInstance.computeOffsetAttribute(
    globe._surface._tileProvider.tilingScheme,
    color
  );

  // 应用遮罩体
  globe.update(scene.time);
  globe._surface._globeSurfaceShaderSet.addGlobalShaderComponent(
    Cesium.ShaderDestination.VERTEX,
    `
    vec4 getGlobalPosition(vec3 positionECF, vec3 normalECF) {
        if (czm_inSensorVolume(normalize(czm_normal3D * czm_oneOverEllipsoidRadii), czm_ellipsoidRadii)) {
            return vec4(positionECF, 1.0);
        }
        czm_mask = 0.0;
        return vec4(0.0);
    }
  `
  );
  globe.addGlobalParameter(color);
  globe._surface._globeSurfaceShaderSet.addGlobalShaderComponent(
    Cesium.ShaderDestination.FRAGMENT,
    `
    vec4 getGlobalNormal(vec3 normalECF, vec3 positionECF, out float mask) {
        mask = czm_mask;
        return czm_globalNormal;
    }
  `
  );
  globe.addGlobalParameter(
    new Cesium.Cartesian4(color.red, color.green, color.blue, color.alpha)
  );
  globe._surface._globeSurfaceShaderSet.sensorVolume = mask;
};

const prevValues = ref([]);
// 数据
watch(
  () => props.deviceList,
  (values) => {
    const transValues = values.map((item) =>
      omit(item, ["online_last", "is_on_update", "process", "upgrade_id"])
    );
    const transPrev = prevValues.value.map((item) =>
      omit(item, ["online_last", "is_on_update", "process", "upgrade_id"])
    );
    if (isEqual(transValues, transPrev)) return;
    prevValues.value = values;
    viewer.entities.removeAll();
    if (!values.length) return;
    setTimeout(() => {
      values.forEach((item) => {
        addMarker({ ...item });
      });
      const firstList = values[0];
      if(prevMarker.value&&firstList.addr===prevMarker.value.id) return;
      selectList.value = values[0].device_number;
      handleChangeDevice(selectList.value);
    }, 0);
  },
  { deep: true }
);

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
  background: url("@/assets/images/screen-bg.png") no-repeat;
  background-size: contain;
}

.map-container {
  width: 100%;
  height: 100%;

  .map-select {
    position: absolute;
    left: 24px;
    top: 102px;
    transform-origin: left;
    z-index: 2;

    .el-select__wrapper {
      border-radius: 10px;
    }
  }
}
</style>
