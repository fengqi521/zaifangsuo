<script setup>
import { ref, reactive, provide } from "vue";
import SearchForm from "@/components/SearchForm/index.vue";
import { WaterLevelChart } from "./components/index";
import { getCommonLine } from "@/utils/chartData";

// 定义变量

// 表单数据
const initialData = reactive({
  type: "",
  station: "",
  rtu: "",
  dateTimeRange: [],
});
const formItems = reactive([
  {
    label: "传感器类型",
    prop: "type",
    attrs: { placeholder: "请选择传感器类型" },
    type: "el-select",
    options: [
      { label: "土压力", value: "1" },
      { label: "孔隙水压力", value: "2" },
      { label: "地面沉降位移计", value: "3" },
      { label: "水位计", value: "4" },
      { label: "土壤含水率", value: "5" },
      { label: "雨量计", value: "6" },
      { label: "断线传感器", value: "7" },
      { label: "静力水准仪", value: "8" },
      { label: "落石传感器", value: "9" },
      { label: "GNSS", value: "10" },
      { label: "次声", value: "11" },
      { label: "流速仪", value: "12" },
      { label: "泥位计", value: "13" },
    ],
  },
  {
    label: "监测站",
    prop: "station",
    attrs: { placeholder: "请选择监测站" },
    type: "el-select",
    options: [
      { label: "京拉线（G109）K31+110-0141-裂", value: 1 },
      { label: "南雁路（S219）K28+600-0209-裂", value: 2 },
      { label: "南雁路（S219）K28+600-0208-裂", value: 3 },
      { label: "京门-G234-阳坡园西-0438-裂", value: 4 },
      { label: "京门-G234-阳坡园西-0437-裂", value: 5 },
      { label: "京门-G234-阳坡园西-0435-裂", value: 6 },
      { label: "门头沟阳坡园西G234倾角位移计", value: 7 },
      { label: "阳坡园倾角监测站", value: 8 },
    ],
  },
  {
    label: "RTU",
    prop: "rtu",
    type: "el-select",
    attrs: { placeholder: "请选择RTU" },
    options: [
      { label: "平谷王都庄", value: 1 },
      { label: "MQTT测试", value: 2 },
      { label: "灾防所对接用RTU", value: 3 },
      { label: "门头沟区G109 K41+590雨量计", value: 4 },
      { label: "南雁路（S219）K28+600-0208-裂", value: 5 },
      { label: "京门-G234-阳坡园西-0435-裂", value: 6 },
      { label: "静力水准长线", value: 7 },
      { label: "测水位及雨量", value: 8 },
    ],
  },
  {
    label: "起止时间",
    prop: "dateTimeRange",
    type: "el-date-picker",
    attrs: {
      type: "datetimerange",
      rangeSeparator: "至",
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
    },
  },
]);

// 图表数据

// 水位计值
const waterCollectData = ref(getCommonLine());
const waterChangeData = ref(getCommonLine());

provide("waterCollectOption", waterCollectData);
provide("waterChangeOption", waterChangeData);
</script>
<template>
  <div>
    <!-- 查询条件 -->
    <SearchForm :initialData="initialData" :formItems="formItems" />
    <!-- 图表 -->
    <div class="device-chart">
      <component :is="WaterLevelChart" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.device-chart{
    background:var(--background-color)
}
</style>