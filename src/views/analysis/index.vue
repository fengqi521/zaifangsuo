<script setup>
import { ref, watchEffect } from "vue";
import Bread from "@/components/Bread/index.vue";
import CompareChart from "./components/CompareChart.vue";
import DevicePanel from "./components/DevicePanel/index.vue";
import systemApi from "@/api";
import { getDatePeriod } from "@/utils";
const deviceInfo = ref([]);
const range = ref(getDatePeriod());

// 获取设备数据
const getDeviceDetail = (params) => {
  params.tart_time = range.value[0];
  params.end_time = range.value[1];
  return systemApi.getRainData(params);
};

// 将请求方法汇总
const collectAction = async () => {
  try {
    const actions = deviceInfo.value.map((item) => getDeviceDetail(item));
    const results = await Promise.all(actions); // 等待所有 Promise 完成
    const isFlag = results.some((item) => item.code !== 0);
    if (!isFlag) {
      const allData = results.flatMap((item) => item?.data?.list);
      console.log(allData)
    }

  } catch (error) {
    console.error("Error occurred:", error); // 处理可能的错误
  }
};

// 监听设备变化获取数据
watchEffect(() => {
  if (!deviceInfo.value.length) return;
  collectAction();
});
</script>
<template>
  <div>
    <Bread :breadList="[{ title: '综合分析' }]" />
    <div class="analysis-container">
      <!-- 左侧-设备列表 -->
      <DevicePanel v-model="deviceInfo" />

      <!-- 右侧-图表 -->
      <div class="compare-container">
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
            />
          </el-form-item>
          <el-form-item>
            <el-button
              class="search-btn"
              type="primary"
              @click="collectAction()"
            >
              查询
            </el-button>
            <el-button type="primary"> 清除图表 </el-button>
          </el-form-item>
        </el-form>
        <CompareChart />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.analysis-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  column-gap: 12px;
  height: calc(100vh - 138px);

  .compare-container {
    padding: 16px;
    border-radius: 3px;
    background: var(--background-color);

    .compare-head {
      display: flex;
      align-items: center;
    }

    .search-btn {
      margin-left: 24px;
    }
  }
}
</style>
