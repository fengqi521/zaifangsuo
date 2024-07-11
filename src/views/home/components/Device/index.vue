<script setup>
import { ref } from "vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import rtuApi from "@/api/rtu";
import  {deviceMap} from '@/constants'
const columns = ref([
  { prop: "num", label: "序号" },
  { prop: "device_name", label: "设备名称" },
  { prop: "device_type", label: "设备类型" },
  { prop: "location", label: "位置" },
  { prop: "online", label: "在线状态" },
  { prop: "online_last", label: "在线时间" },
  { prop: "create_time", label: "创建时间" },
]);

const active = ref(1);
const deviceData = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 设备数据
const loadData = async (status = 1) => {
  loading.value = true;
  try {
    const result = await rtuApi.getDeviceList({ status });
    loading.value = false;
    deviceData.value = result?.data?.list.map((item, index) => ({
      num: index + 1,
      ...item,
    }));
    currentPage.value = result.data.current_page;
    total.value = result.data.total_count;
  } catch (error) {}
};
loadData();
// 切换设备查询
const handleSearchStatus = (status) => {
  active.value = status;
  loadData(status);
};

// 查询传感器类型
const getType = (type) => {
  const list = deviceMap.find(({ value }) => Number(type) === value);
  return list.label;
};

// 切换分页
const handleChangeCurrent = (page, size) => {
  console.log(page, size);
  console.log("Pagination changed:", page, size);
};

// 改变条数
const handlePageSizeChange = (size) => {
  console.log("Page size changed:", size);
};

const handleSortChange = (sortInfo) => {
  // 处理排序请求
  console.log("Sort changed:", sortInfo);
};

const handleSelectionChange = (selection) => {
  // 处理行选择
  console.log("Selection changed:", selection);
};
</script>
<template>
  <div class="device-container">
    <div class="device-head">
      <p
        :class="{ 'head-item': true, active: active === 1 }"
        @click="handleSearchStatus(1)"
      >
        在线设备
      </p>
      <p
        :class="{ 'head-item': true, active: active === 0 }"
        @click="handleSearchStatus(0)"
      >
        离线设备
      </p>
    </div>
    <div class="device-main">
      <ElTable
        :loading="loading"
        :columns="columns"
        :data="deviceData"
        :tableProps="{ showSelection: false, border: true }"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <template #device_type="scope" class="status-row">
          {{ getType(scope.row.device_type) }}
        </template>
        <template #online="scope" class="status-row">
          <span :class="{ status: true, 'status-online': scope.row.online }">
          </span>
          <span :class="{ 'status-online-text': scope.row.online }">{{
            scope.row.online ? "在线" : "离线"
          }}</span>
        </template>
      </ElTable>
      <ElPagination
        :currentPage="currentPage"
        :page-size="pageSize"
        :total="total"
        @pagination-change="handleChangeCurrent"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.device-container {
  margin-top: 16px;

  // border-radius: 2px;

  .device-head {
    display: flex;
    line-height: 40px;
    font-size: 14px;
    color: var(--panel-text-color);
    opacity: 0.7;
    cursor: pointer;
    user-select: none;

    .head-item {
      width: 145px;
      text-align: center;
      background: var(--panel-bg-color);
    }

    .active {
      font-weight: bold;
      background: var(--background-color);
      color: var(--panel-active-color);
    }
  }
}
</style>
