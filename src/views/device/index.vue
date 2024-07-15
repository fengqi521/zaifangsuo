<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import SearchForm from "@/components/SearchForm/index.vue";
import Bread from '@/components/Bread/index.vue'
import { getCssVariableValue } from "@/utils";
import { SENSOR, initialFormData } from "@/constants";

// 定义变量
const breadList = ref([{title:'设备数据'}])
const currentType = ref("");
const searchFormRef = ref(null);
const calcChartHeight = ref(0);
const tagHeight = parseFloat(getCssVariableValue("--tagsview-height")); // 确保 tagHeight 是数值
const componentContainer = ref(null);

// 表单数据
const initialData = reactive(initialFormData);
const formItems = reactive([
  {
    label: "传感器类型",
    prop: "type",
    attrs: { placeholder: "请选择传感器类型" },
    type: "el-select",
    options: [
      { label: "雨量计", value: "6" }, //显示
      { label: "断线传感器", value: "7" }, // 显示
      { label: "泥位计", value: "13" }, //显示
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
// 表单元素高度和初始化
onMounted(() => {
  nextTick(() => {
    const searchFormRefHeight =
      searchFormRef.value?.$el.getBoundingClientRect().height || 0;
    calcChartHeight.value = `calc(100% - ${searchFormRefHeight}px - ${tagHeight}px - 18px)`;
    setShowComponent(initialData.type);
  });
});

// 查询数据
const handleSearchSubmit = (data) => {
  const { type } = data;
  setShowComponent(type);
  // 接口请求
};

// 重置表单
const handleReset = () => {
  Object.assign(initialData, initialFormData);
  setShowComponent(initialData.type);
};

// 设置显示title和组件
const setShowComponent = (type) => {
  const item = formItems[0].options.find(({ value }) => value === type);
  if (item?.value) currentType.value = `${item.label}数据`;
  componentContainer.value = SENSOR[type];
};
</script>

<template>
  <div class="device-container">
    <Bread :breadList="breadList"/>

    <!-- 查询条件 -->
    <SearchForm
      :initialData="initialData"
      :formItems="formItems"
      @submit="handleSearchSubmit"
      @reset="handleReset"
      ref="searchFormRef"
    />
    <!-- 数据表头 -->
    <div class="device-head">
      <span>{{ currentType }}</span>
    </div>
    <!-- 图表 -->
    <div class="device-chart" :style="{ height: calcChartHeight }">
      <component :is="componentContainer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/tools.scss";
.device-container {
  height: 100%;
}
.device-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 16px;
  height: 48px;
  font-size: 14px;
  color: var(--normal-title-color);
  font-weight: 700;
}
.device-chart {
  padding: 20px;
  background: var(--background-color);
  overflow-y: auto;
  @extend %scrollbar;
}
</style>
