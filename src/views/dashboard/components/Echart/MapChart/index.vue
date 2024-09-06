<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useScreenStoreHook } from "@/store/modules/screen";
import { getCommon3dMap } from "@/utils/chartData";

import "echarts-gl";
import { useEchartsHook } from "@/hooks/useEcharts";
import bejingJson from "@/js/beijing.json";

const { initEchart, setEchartOption, setMapData } = useEchartsHook();

const screenStore = useScreenStoreHook();

const mapContainer = ref(null);

const option = ref({ ...getCommon3dMap() });

// 设置图表
const resetOptions = (values) => {
  const datas = [];
  const datas1 = [];

  // 对应数据
  const { features } = bejingJson;
  const colors = ["#24FEB4", "#ff4b55"];
  values &&
    values.length &&
    features.map((feature) => {
      const {
        properties: { adcode, name, center },
      } = feature;
      const list = values.find((item) => {
        let code = item.code.toString();
        code = Number(code.slice(0, 6));
        return code === adcode;
      });

      const { online, offline, total } = list;
      if (online > 0 && offline > 0) {
        datas.push({
          name,
          value: [...center, online],
          label: { show: false },
          itemStyle: {
            color: colors[0],
          },
          selfParams: { online, offline },
        });
        datas1.push({
          name,
          value: [...center, total],
          itemStyle: {
            color: colors[1],
          },
          selfParams: { online, offline },
        });
      }

      if (online > 0 && offline === 0) {
        datas.push({
          name,
          value: [...center, online],
          itemStyle: {
            color: colors[0],
          },
        });
      }
      if (online === 0 && offline > 0) {
        datas1.push({
          name,
          value: [...center, offline],
          itemStyle: {
            color: colors[1],
          },
        });
      }
    });

  option.value.series[0].data = datas;
  option.value.series[1].data = datas1;

  setEchartOption(option.value);
};

onMounted(() => {
  setMapData("beijing", bejingJson);
  initEchart(mapContainer.value);
  resetOptions();
});

watch(
  () => screenStore.screenData.area,
  (lists) => {
    resetOptions(lists);
  },
  { deep: true }
);
</script>
<template>
  <div class="chart-container" ref="mapContainer"></div>
  <ul class="legend">
    <li class="legend-item legend-online">在线</li>
    <li class="legend-item legend-offline">离线</li>
  </ul>
</template>
<style lang="scss" scoped>
.legend {
  position: absolute;
  right: 16px;
  bottom: 16px;
  color: #fff;

  .legend-item {
    display: flex;
    align-items: center;
    line-height: 24px;
    margin-left: 16px;

    &::before {
      content: " ";
      width: 10px;
      height: 10px;
      margin-right: 8px;
    }
  }

  .legend-online::before {
    background: #24feb4;
  }
  .legend-offline::before {
    background: #ff4b55;
  }
}
</style>
