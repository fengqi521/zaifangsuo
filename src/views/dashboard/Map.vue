<template>
  <div id="cesiumContainer" ref="cesiumRef"></div>
</template>
<script setup>
import { onMounted, ref, watchEffect } from "vue";
import Card from "./components/Card.vue";
import * as Cesium from "cesium";
import geojson from "@/constants/geojson.json";
window.CESIUM_BASE_URL = "/Cesium";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNTVmZTY5OS02NTU5LTRjOGQtYWExZS04OTdhYzM4OWM5OGEiLCJpZCI6MjMyNzM1LCJpYXQiOjE3MjI4NTY5NDJ9.j5avjfYqPsXLfJrCzdsnV-XmhawsCYaEih7o2N-K4y8";

const props = defineProps({
  deviceList: {
    type: Array,
    default: () => [],
  },
});
// 动态获取图片
const images = import.meta.glob("@/assets/images/*.png", { eager: true });
const getImagePath = (imageName) => {
  return images[`/src/assets/images/${imageName}`]?.default || "";
};

// 添加mark
watchEffect(() => {
  props.deviceList.forEach((item) => {
    addMark(item);
  });
});
onMounted(async () => {
  const viewer = new Cesium.Viewer("cesiumContainer", {
    animation: false, //是否显示动画控件
    homeButton: false, //是否显示home键
    geocoder: false, // 查询
    baseLayerPicker: false, //是否显示图层选择控件
    timeline: false, //是否显示时间线控件
    fullscreenButton: false, //是否全屏显示
    // scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    infoBox: false, //是否显示点击要素之后显示的信息
    sceneModePicker: false, //是否显示投影方式控件  三维/二维
    navigationHelpButton: false, //是否显示帮助信息控件
    // orderIndependentTranslucency: true,
    // skyAtmosphere: false,
    // contextOptions: {
    //   webgl: {
    //     alpha: true,
    //   },
    // },
  });

  viewer._cesiumWidget._creditContainer.style.display = "none";
  // viewer.scene.backgroundColor = Cesium.Color.BLACK.withAlpha(0);
  // viewer.scene.fxaa = false;
  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;
  // viewer.scene.fog.enable = false;
  viewer.scene.skyBox.show = false; //关闭天空盒，否则会显示天空颜色
  // viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;

  viewer.scene.undergroundMode = true; //重要，开启地下模式，设置基色透明，这样就看不见黑色地球了

  window.viewer = viewer;
  //全球影像中文注记服务

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.572719, 40.133123, 300000),
  });
  // _c_add_geojson_area(viewer, geojson);

  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handleClick(handler);
});

// 鼠标点击事件
const handleClick = (handler) => {
  if (!handler) return;
  handler.setInputAction(function(movement) {
    var pick = viewer.scene.pick( movement.endPosition || movement.position);
    // console.log(Cesium.defined(pick), pick.id, "===============");
    console.log(viewer.selectedEntity,'selectedEntity')
    if (Cesium.defined(pick)) {
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

// 添加marker方法
let dataSource;
const addMark = (item) => {
  dataSource = new Cesium.CustomDataSource('myData');

  let markUrl = "";
  if (item.device_type == 1) {
    item.deviceTypeId = "泥位计";
    markUrl = "deviceType01";
  } else if (item.device_type == 2) {
    item.deviceTypeId = "雨量计";
    markUrl = "deviceType02";
  } else if (item.device_type == 3) {
    item.deviceTypeId = "断线传感器";
    markUrl = "deviceType03";
  }
  if (item.online == 0) {
    item.deviceState = "正常";
    markUrl += "d.png";
  } else if (item.online == 1) {
    item.deviceState = "报警";
    markUrl += ".png";
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
      scale: 0.7,
    },
    label: {
      text: item.device_name,
      font: "26px Helvetica",
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      fillColor: Cesium.Color.AZURE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian3(0, -55, 100), //偏移量  第二位
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //字体围绕 CLAMP_TO_GROUND地平面
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        0.0,
        2000000
      ),
    },
    data: item,
  });
  //========聚合 start==========
  dataSource.clustering.enabled = false;
  dataSource.clustering.pixelRange = 20; //多少像素矩形范围内聚合

  var singleDigitPins = {};
  var pinBuilder = new Cesium.PinBuilder();
  dataSource.clustering.clusterEvent.addEventListener(function (
    clusteredEntities,
    cluster
  ) {
    var count = clusteredEntities.length;

    cluster.label.show = false;
    cluster.billboard.show = true;
    cluster.billboard.id = cluster.label.id;
    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

    if (!singleDigitPins[count]) {
      singleDigitPins[count] = pinBuilder
        .fromText(count, Cesium.Color.BLUE, 48)
        .toDataURL();
    }
    cluster.billboard.image = singleDigitPins[count];
  });
  //========聚合 end==========
};

// 显示地图数据
const _c_add_geojson_area = (viewer, geojson) => {
  let arr = [];
  geojson.features[0].geometry.coordinates[0][0].forEach((item) => {
    arr.push(item[0]);
    arr.push(item[1]);
  });
  var polygonWithHole = new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray([
        73.0, 53.0, 73.0, 0.0, 135.0, 0.0, 135.0, 53.0,
      ]),
      [new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(arr))]
    ),
  });
  var geometry = Cesium.PolygonGeometry.createGeometry(polygonWithHole);
  let instances = [];
  instances.push(
    new Cesium.GeometryInstance({
      geometry: geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.fromCssColorString("#081122")
        ),
      },
    })
  );
  function addRect(instances, left, down, right, up) {
    instances.push(
      new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: Cesium.Rectangle.fromDegrees(left, down, right, up),
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromCssColorString("#081122")
          ),
        },
      })
    );
  }
  addRect(instances, -180.0, -90.0, 73.0, 90.0);
  addRect(instances, 135.0, -90.0, 180.0, 90.0);
  addRect(instances, 73.0, 53.0, 135.0, 90.0);
  addRect(instances, 73.0, -90.0, 135.0, 0.0);
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: instances,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: false,
      }),
      asynchronous: false,
    })
  );
};
</script>
<style>
@import "cesium/Build/Cesium/Widgets/widgets.css";
#cesiumContainer {
  height: 100%;
}
</style>
