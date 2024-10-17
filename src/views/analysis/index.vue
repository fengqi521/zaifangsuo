<script setup>
import { reactive, ref, watch } from "vue";
import Bread from "@/components/Bread/index.vue";
import CompareChart from "./components/CompareChart.vue";
import DevicePanel from "./components/DevicePanel.vue";
import systemApi from "@/api";
import { getDatePeriod } from "@/utils";
import { useMessage } from "@/plugins/message";

const { warning, error } = useMessage();
const deviceInfo = ref({});

const allOptions = reactive([]);
const range = ref(getDatePeriod());
const loading = ref(false);

// 获取设备数据
const getDeviceDetail = async (arg) => {
  loading.value = true;
  const params = { ...arg };
  params.start_time = range.value[0];
  params.end_time = range.value[1];
  const result = await systemApi.getRainData(params);
  loading.value = false;
  if (!result.code) {
    const { type, id, name } = params;
    const data = result.data.list;
    if (!data[0].timeList.length) {
      warning("设备暂无数据");
      return;
    }
    const list = allOptions.find((item) => item.id === id);
    switch (type) {
      case 1:
        list
          ? (list.data = data[0])
          : allOptions.push({ id, type, name, data: data[0] });
        break;
      case 2:
        const findData = data.slice(0, 3);
        const rain = findData.find((item) => item.column === "rain");
        const duration = findData.find((item) => item.column === "rain_min");
        const total_rain = findData.find((item) => item.column === "rainfall");
        const datas = {
          timeList: rain?.timeList,
          rain: rain?.valueList,
          total_rain: total_rain?.valueList,
          duration: duration?.valueList,
        };
        list
          ? (list.data = datas)
          : allOptions.push({
              id,
              type,
              name,
              data: datas
            });
        break;
      case 3:
        list
          ? (list.data = data[0])
          : allOptions.push({
              id,
              type,
              name,
              data: data,
            });
        break;
      default:
        break;
    }
  }
};

// 点击查询
const handleSearch = () => {
  allOptions.map((item) => {
    getDeviceDetail({ id: item.id, type: item.type });
  });
};

// 清除
const handleClear = () => {
  allOptions.length = 0;
};

// 监听设备变化获取数据
watch(
  () => deviceInfo.value,
  (info) => {
    if (allOptions.length > 1) {
      error(`设备图表已满，清除图表再进行操作`);
      return;
    }
    const list = allOptions.find((item) => item.id === info.id);
    if (list) {
      warning(`${list.name}设备图表已存在`);
      return;
    }
    getDeviceDetail(info);
  },
  { deep: true }
);
</script>
<template>
  <div>
    <Bread :breadList="[{ title: '综合分析' }]" />
    <div class="analysis-container">
      <!-- 左侧-设备列表 -->
      <DevicePanel v-model="deviceInfo" />

      <!-- 右侧-图表 -->
      <div class="compare-container" v-loading="loading">
        <el-form class="compare-head">
          <el-form-item label="时间段">
            <el-date-picker
              class="date-picker"
              v-model="range"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 314px"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="search-btn" type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button type="primary" @click="handleClear">
              清除图表
            </el-button>
          </el-form-item>
        </el-form>
        <el-empty v-if="!allOptions.length" style="height: 80%"></el-empty>
        <div class="compare-chart" v-else>
          <CompareChart
            v-for="(option, index) in allOptions"
            :key="option.id"
            :option="option"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
.analysis-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: calc(100vh - 138px);
  column-gap: 12px;

  .compare-container {
    padding: 16px;
    border-radius: 3px;
    background: var(--background-color);

    .compare-head {
      display: flex;
      align-items: center;
    }
    .compare-chart {
      display: grid;
      grid-template-rows: repeat(2, 1fr);
      // grid-template-rows: repeat(auto-fill, minmax(100px, 1fr));
      row-gap: 10px;
      height: calc(100% - 50px);
      overflow-y: auto;
      @extend %scrollbar;
    }
    .search-btn {
      margin-left: 24px;
    }
  }
}
</style>
