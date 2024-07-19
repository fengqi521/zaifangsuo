<script setup>
import { reactive, ref, watchEffect } from "vue";
import Chart from "@/components/Chart/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import { useRtuStoreHook } from "@/store/modules/rtu";
import { getCommonLine } from "@/utils/chartData";

const useRtuStore = useRtuStoreHook();
const collectOption = reactive(
  getCommonLine({ seriesUnit: ["V", "°C"], yAxisTitlePadding: [0, 0, 0, 10] })
);

const searchInfo = reactive({
  range: [...useRtuStore.dateTimeRange],
  page: 1,
  limit: 10,
});
// 常量
const workColumns = [
  { prop: "num", label: "序号" },
  { prop: "monitortime", label: "监测时间" },
  { prop: "powerVolt", label: "电压(V)" },
  { prop: "temperature", label: "温度(°C)" },
];

const colors = ["#ffd285", "#ff733f"];
const chartData = reactive({ monitortime: [], powerVolt: [], temperature: [] });
// 获取图表数据
const getWorkChartData = () => {
  const res = {
    code: 0,
    status: true,
    msg: "success",
    pageNo: null,
    pageSize: null,
    total: null,
    data: {
      monitortime: [
        "2024/07/13 00:05:00",
        "2024/07/13 00:10:00",
        "2024/07/13 00:15:00",
        "2024/07/13 00:20:00",
        "2024/07/13 00:25:00",
        "2024/07/13 00:30:00",
        "2024/07/13 00:35:00",
        "2024/07/13 00:40:00",
        "2024/07/13 00:45:00",
        "2024/07/13 00:50:00",
        "2024/07/13 00:55:00",
        "2024/07/13 01:00:00",
        "2024/07/13 01:05:00",
        "2024/07/13 01:10:00",
        "2024/07/13 01:15:00",
        "2024/07/13 01:20:00",
        "2024/07/13 01:25:00",
        "2024/07/13 01:30:00",
        "2024/07/13 01:35:00",
        "2024/07/13 01:40:00",
        "2024/07/13 01:45:00",
        "2024/07/13 01:50:00",
        "2024/07/13 01:55:00",
        "2024/07/13 02:00:00",
        "2024/07/13 02:05:00",
        "2024/07/13 02:10:00",
        "2024/07/13 02:15:00",
        "2024/07/13 02:20:00",
        "2024/07/13 02:25:00",
        "2024/07/13 02:30:00",
        "2024/07/13 02:35:00",
        "2024/07/13 02:40:00",
        "2024/07/13 02:45:00",
        "2024/07/13 02:50:00",
        "2024/07/13 02:55:00",
        "2024/07/13 03:00:00",
        "2024/07/13 03:05:00",
        "2024/07/13 03:10:00",
        "2024/07/13 03:15:00",
        "2024/07/13 03:20:00",
        "2024/07/13 03:25:00",
        "2024/07/13 03:30:00",
        "2024/07/13 03:35:00",
        "2024/07/13 03:40:00",
        "2024/07/13 03:45:00",
        "2024/07/13 03:50:00",
        "2024/07/13 03:55:00",
        "2024/07/13 04:00:00",
        "2024/07/13 04:05:00",
        "2024/07/13 04:10:00",
        "2024/07/13 04:15:00",
        "2024/07/13 04:20:00",
        "2024/07/13 04:25:00",
        "2024/07/13 04:30:00",
        "2024/07/13 04:35:00",
        "2024/07/13 04:40:00",
        "2024/07/13 04:45:00",
        "2024/07/13 04:50:00",
        "2024/07/13 04:55:00",
        "2024/07/13 05:00:00",
        "2024/07/13 05:05:00",
        "2024/07/13 05:10:00",
        "2024/07/13 05:15:00",
        "2024/07/13 05:20:00",
        "2024/07/13 05:25:00",
        "2024/07/13 05:30:00",
        "2024/07/13 05:35:00",
        "2024/07/13 05:40:00",
        "2024/07/13 05:45:00",
        "2024/07/13 05:50:00",
        "2024/07/13 05:55:00",
        "2024/07/13 06:00:00",
      ],
      solarVolt: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      powerVolt: [
        13.0, 13.03, 13.01, 13.0, 13.05, 13.03, 13.05, 13.03, 13.05, 13.0,
        12.91, 12.91, 13.0, 13.02, 13.02, 13.03, 13.04, 13.02, 13.03, 13.03,
        12.99, 13.03, 12.91, 12.88, 12.99, 13.01, 13.0, 13.01, 13.01, 13.01,
        13.0, 13.01, 13.0, 12.99, 12.9, 12.89, 12.94, 12.99, 12.97, 12.99, 13.0,
        12.96, 13.0, 12.99, 12.97, 12.99, 12.89, 12.84, 12.97, 12.95, 12.99,
        12.99, 12.99, 12.99, 12.99, 12.96, 13.0, 12.98, 12.87, 12.86, 12.98,
        12.97, 12.98, 12.99, 12.99, 13.0, 13.0, 12.99, 12.98, 12.98, 12.88,
        12.86,
      ],
      temperature: [
        22.4, 22.4, 22.4, 22.4, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3,
        22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3,
        22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.3, 22.2, 22.3, 22.3,
        22.2, 22.2, 22.2, 22.2, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1,
        22.1, 22.1, 22.1, 22.1, 22.1, 22.2, 22.2, 22.2, 22.3, 22.3, 22.3, 22.3,
        22.3, 22.4, 22.4, 22.3, 22.3, 22.2, 22.1, 22.1, 22.1, 22.0, 22.0, 21.9,
      ],
      signal4g: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    },
    hasNext: false,
    hasPrevious: false,
  };
  if (!res.code) {
    Object.assign(chartData, res.data);
  }
};

// 图表数据重组
const resetOptions = (data) => {
  collectOption.legend.show = true;
  collectOption.legend.x = "center";
  collectOption.legend.data = ["电压", "温度"];
  // collectOption.grid.top = 60
  collectOption.color = colors;
  collectOption.xAxis[0].data = data.monitortime;
  collectOption.yAxis[0].name = "{title|电压(V)}";
  collectOption.yAxis[1].name = "{title|温度(°C)}";

  collectOption.series[0] = {
    name: "电压",
    type: "line",
    data: data.powerVolt,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 0,
  };
  collectOption.series[1] = {
    name: "温度",
    type: "line",
    data: data.temperature,
    Symbol: "circle",
    smooth: true,
    yAxisIndex: 1,
  };
};

watchEffect(() => {
  resetOptions(chartData);
});

const loading = ref(false);
const workData = reactive({
  total: 0,
  data: [],
});

// 获取工况历史数据
const getWorkHistory = () => {
  const res = {
    code: 0,
    status: true,
    msg: "",
    total: 10,
    size: 10,
    data: {
      records: [
        {
          powerVolt: 14.56,
          temperature: 34.3,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:20:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.02,
          temperature: 34.2,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:15:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.75,
          temperature: 33.9,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:10:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.16,
          temperature: 33.7,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:05:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.29,
          temperature: 33.4,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 11:00:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 13.93,
          temperature: 33.1,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:55:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.28,
          temperature: 32.8,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:50:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.04,
          temperature: 32.6,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:45:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 13.98,
          temperature: 32.4,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:40:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
        {
          powerVolt: 14.35,
          temperature: 32.3,
          humidity: null,
          signal4g: null,
          signalBd: null,
          swVersion: null,
          on4g: null,
          sensorErrno: null,
          deviceguid: null,
          location: null,
          devicecode: null,
          solarVolt: null,
          voltpersent: null,
          paState: null,
          soundState: null,
          shVolt: null,
          signalFr: null,
          monitortime: "2024-07-12 10:35:00",
          uploadtime: null,
          remarks: null,
          tensorcode: null,
          id: null,
          lat: null,
          lon: null,
          latt: null,
        },
      ],

      orders: [],
      optimizeCountSql: true,
      searchCount: true,
      countId: null,
      maxLimit: null,
    },
    hasNext: false,
    hasPrevious: false,
  };
  if (!res.code) {
    workData.total = res.total;
    Object.assign(
      workData.data,
      res.data.records.map((item, index) => ({ ...item, num: index + 1 }))
    );
  }
};

// 处理分页
const handleChangeLimit = (size) => {
  searchInfo.limit = size;
  getWorkHistory();
};

const handleChangePage = (page) => {
  searchInfo.page = page;
  getWorkHistory();
};
useRtuStore.handleMethod((val) => {
  searchInfo.range = val;
  getWorkChartData();
  getWorkHistory();
});
</script>

<template>
  <div class="device-data">
    <ElCard title="设备工况" v-loading="loading">
      <Chart :options="[collectOption]" :eleNames="['wordChart']" />
      <ElCard v-loading="loading" class="history-data-card">
        <ElTable
          :loading="loading"
          :columns="workColumns"
          :data="workData.data"
          :tableProps="{ showSelection: false, border: true }"
        />
        <ElPagination
          :currentPage="searchInfo.page"
          :page-size="searchInfo.limit"
          :total="workData.total"
          @pagination-change="handleChangePage"
          @page-size-change="handleChangeLimit"
        />
      </ElCard>
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
.device-data {
  .history-data-card {
    margin-top: 24px;
  }
}
</style>
