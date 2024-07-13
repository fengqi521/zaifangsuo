<script setup>
import { reactive, ref, watchEffect, onUnmounted, provide } from "vue";
import TimelineImage from "./TimelineImage.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import Chart from "@/components/Chart/index.vue";
import { getCommonLine } from "@/utils/chartData";
import eventBus from './eventBus.js'
const collectOption = reactive(
  getCommonLine({ seriesUnit: "m", yAxisTitlePadding: [0, 0, 0, 10] })
);
// 图表
const chartData = reactive({ timeList: [], valueList: [] })
const mudLevelImages = reactive({ timeList: [], valueList: [] })
provide('mudLevelImages', mudLevelImages)
// 获取泥水位图表数据
const getMudChartData = () => {
  const res = {
    "code": 0,
    "status": true,
    "msg": null,
    "pageNo": null,
    "pageSize": null,
    "total": null,
    "data": [
      {
        "zh_name": "泥水位",
        "en_name": "Mud level",
        "units": "m",
        "icon": "",
        "valueList": [
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909,
          2.909
        ],
        "timeList": [
          "2024-07-13 00:00:00",
          "2024-07-13 00:05:00",
          "2024-07-13 00:10:00",
          "2024-07-13 00:15:00",
          "2024-07-13 00:20:00",
          "2024-07-13 00:25:00",
          "2024-07-13 00:30:00",
          "2024-07-13 00:35:00",
          "2024-07-13 00:40:00",
          "2024-07-13 00:45:00",
          "2024-07-13 00:50:00",
          "2024-07-13 00:55:00",
          "2024-07-13 01:00:00",
          "2024-07-13 01:05:00",
          "2024-07-13 01:10:00",
          "2024-07-13 01:15:00",
          "2024-07-13 01:20:00",
          "2024-07-13 01:25:00",
          "2024-07-13 01:30:00",
          "2024-07-13 01:35:00",
          "2024-07-13 01:40:00",
          "2024-07-13 01:45:00",
          "2024-07-13 01:50:00",
          "2024-07-13 01:55:00",
          "2024-07-13 02:00:00",
          "2024-07-13 02:05:00",
          "2024-07-13 02:10:00",
          "2024-07-13 02:15:00",
          "2024-07-13 02:20:00",
          "2024-07-13 02:25:00",
          "2024-07-13 02:30:00",
          "2024-07-13 02:35:00",
          "2024-07-13 02:40:00",
          "2024-07-13 02:45:00",
          "2024-07-13 02:50:00",
          "2024-07-13 02:55:00",
          "2024-07-13 03:00:00",
          "2024-07-13 03:05:00",
          "2024-07-13 03:10:00",
          "2024-07-13 03:15:00",
          "2024-07-13 03:20:00",
          "2024-07-13 03:25:00",
          "2024-07-13 03:30:00",
          "2024-07-13 03:35:00",
          "2024-07-13 03:40:00",
          "2024-07-13 03:45:00",
          "2024-07-13 03:50:00",
          "2024-07-13 03:55:00",
          "2024-07-13 04:00:00",
          "2024-07-13 04:05:00",
          "2024-07-13 04:10:00",
          "2024-07-13 04:15:00",
          "2024-07-13 04:20:00",
          "2024-07-13 04:25:00",
          "2024-07-13 04:30:00",
          "2024-07-13 04:35:00",
          "2024-07-13 04:40:00",
          "2024-07-13 04:45:00",
          "2024-07-13 04:50:00",
          "2024-07-13 04:55:00",
          "2024-07-13 05:00:00",
          "2024-07-13 05:05:00",
          "2024-07-13 05:10:00",
          "2024-07-13 05:15:00",
          "2024-07-13 05:20:00",
          "2024-07-13 05:25:00",
          "2024-07-13 05:30:00",
          "2024-07-13 05:35:00",
          "2024-07-13 05:40:00",
          "2024-07-13 05:45:00",
          "2024-07-13 05:50:00",
          "2024-07-13 05:55:00",
          "2024-07-13 06:00:00"
        ],
        "tag": "6",
        "column": "nswval",
        "group": "泥水位"
      },
      {
        "zh_name": "图像",
        "en_name": "picture url",
        "units": "",
        "icon": "icon-tuxiang-01",
        "valueList": [
          "http://1.119.55.14:18002/picture/show?localPath=/home/dizai/image/6600004572/2024-07-13/32382055040.jpg",
          "http://1.119.55.14:18002/picture/show?localPath=/home/dizai/image/6600004572/2024-07-13/32382045038.jpg",
          "http://1.119.55.14:18002/picture/show?localPath=/home/dizai/image/6600004572/2024-07-13/32382035033.jpg",
          "http://1.119.55.14:18002/picture/show?localPath=/home/dizai/image/6600004572/2024-07-13/32382025035.jpg",
          "http://1.119.55.14:18002/picture/show?localPath=/home/dizai/image/6600004572/2024-07-13/32382015035.jpg",
          "http://1.119.55.14:18002/picture/show?localPath=/home/dizai/image/6600004572/2024-07-13/32382005035.jpg"
        ],
        "timeList": [
          "2024-07-13 05:50:40",
          "2024-07-13 04:50:38",
          "2024-07-13 03:50:33",
          "2024-07-13 02:50:35",
          "2024-07-13 01:50:35",
          "2024-07-13 00:50:35"
        ],
        "tag": "13",
        "column": "imageurl",
        "group": null
      }
    ],
    "hasNext": false,
    "hasPrevious": false
  }
  if (!res.code) {
    Object.assign(chartData, res.data[0])
    Object.assign(mudLevelImages, res.data[1])
  }
}

// 历史table数据
const loading = ref(false);
const tableColumns = [
  { prop: "num", label: "序号" },
  { prop: "monitortime", label: "监测时间" },
  { prop: "nswval", label: "泥水位(m)" },
];
const deviceData = reactive({
  page: 1,
  limit: 10,
  total: 0,
  data: [],
});

// 获取泥水位历史数据
const getMudLevelHistory = (page, size) => {
  if (page) deviceData.page = page;
  if (size) deviceData.limit = size;
  const tableRes = {
    code: 0,
    status: true,
    msg: "OK",
    pageNo: 1,
    pageSize: 10,
    total: 106,
    data: [
      {
        protocol: 3,
        monitortime: "2024-07-12 08:45:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:40:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:35:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:30:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:25:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:20:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:15:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:10:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:05:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 08:00:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:55:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:50:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:45:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:40:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:35:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:30:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:25:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:20:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:15:00",
        nswval: 2.909,
        variation: null,
      },
      {
        protocol: 3,
        monitortime: "2024-07-12 07:10:00",
        nswval: 2.909,
        variation: null,
      },
    ],
    hasNext: false,
    hasPrevious: false,
  };
  if (!tableRes.code) {
    deviceData.total = tableRes.total;
    Object.assign(
      deviceData.data,
      tableRes.data.map((item, index) => ({ ...item, num: index + 1 }))
    );
  }
};
// 图表数据重组
const resetOptions = (data) => {
  collectOption.legend.show = true;
  collectOption.xAxis[0].data = data.timeList;
  collectOption.yAxis[0].name = "{title|泥水位(m)}";
  collectOption.series[0] = {
    name: "泥水位",
    type: "line",
    data: data.valueList,
    Symbol: "circle",
    // symbolSize: 6,
    smooth: true,
    unit: "m",
  };
}
watchEffect(() => {
  resetOptions(chartData)
})

eventBus.on('getMudChartData', getMudChartData)
eventBus.on('getMudLevelHistory', getMudLevelHistory)

</script>

<template>
  <div class="device-data">
    <ElCard title="传感器监测历史数据" v-loading="loading">
      <Chart :options="[collectOption]" />
      <div class="device-data__history">
        <div>
          <ElTable class="device-data__table" :loading="loading" :columns="tableColumns" :data="deviceData.data"
            :tableProps="{ showSelection: false, border: true }" />
          <ElPagination :currentPage="deviceData.page" :page-size="deviceData.limit" :total="deviceData.total"
            @pagination-change="(page) => getMudLevelHistory(page)" @page-size-change="(size) => getMudLevelHistory(deviceData.page, size)
              " />
        </div>
        <TimelineImage :imagesData="mudLevelImages" />
      </div>
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
.device-data {
  &__title {
    line-height: 52px;
    font-size: 16px;
    color: var(--normal-title-color);
    font-weight: 700;
  }

  &__history {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__table {
    border: 1px solid var(--normal-border-color);

    :deep(.el-scrollbar) {
      height: 408px;
    }
  }
}
</style>
