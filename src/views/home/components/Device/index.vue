<script setup>
import { reactive, ref } from "vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import rtuApi from "@/api/rtu";
import { deviceMap } from "@/constants";
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
const deviceData = reactive({ total: 0, data: [] });
const loading = ref(false);
const searchInfo = ref({ status: 1 });
const page = ref(1);
const limit = ref(10);

// 设备数据
const getDeviceData = async () => {
  loading.value = true;
  searchInfo.value.page = page.value;
  searchInfo.value.limit = limit.value;
  try {
    const result = await rtuApi.getDeviceList(searchInfo.value);
    loading.value = false;
    Object.assign(
      deviceData.data,
      result?.data?.list.map((item, index) => ({
        num: index + 1,
        ...item,
      }))
    );
    page.value = result.data.current_page;
    deviceData.total = result.data.total_count;
  } catch (error) {}
};
getDeviceData();
// 切换设备查询
const handleSearchStatus = (status) => {
  active.value = status;
  page.value = 1;
  searchInfo.value.status = status;
  getDeviceData();
};

// 查询传感器类型
const getType = (type) => {
  const list = deviceMap.find(({ value }) => Number(type) === value);
  return list.label;
};

// 切换分页
const handleChangeCurrent = (page) => {
  page.value = page;
  getDeviceData();
};

// 改变条数
const handlePageSizeChange = (size) => {
  limit.value = size;
  getDeviceData();
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
    <ElCard>
      <ElTable
        :loading="loading"
        :columns="columns"
        :data="deviceData.data"
        :tableProps="{ showSelection: false, border: true }"
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
        :page="page"
        :page-size="limit"
        :total="deviceData.total"
        @pagination-change="handleChangeCurrent"
        @page-size-change="handlePageSizeChange"
      />
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.device-container {
  margin-top: 24px;

  .device-head {
    display: flex;
    line-height: 40px;
    font-size: 14px;
    color: var(--panel-text-color);
    cursor: pointer;
    user-select: none;

    .head-item {
      width: 145px;
      text-align: center;
      background: var(--panel-bg-color);
    }

    .active {
      font-weight: bold;
      color: var(--text-color);
      background: var(--btn-bg-color);
    }
  }
}
</style>
