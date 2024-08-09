<script setup>
import { reactive, ref } from "vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import rtuApi from "@/api/rtu";
import { deviceMap } from "@/constants";
const columns = ref([
  { prop: "num", label: "序号",width:80 },
  { prop: "device_name", label: "设备名称" },
  { prop: "device_type", label: "设备类型",width:100 },
  { prop: "location", label: "位置" },
  { prop: "online", label: "在线状态",width:80 },
  { prop: "online_last", label: "在线时间",width:180 },
  { prop: "create_time", label: "创建时间",width:180 },
]);

const active = ref(1);
const deviceData = reactive({ total: 0, data: [] });
const loading = ref(false);
const searchInfo = ref({ status: 1, page: 1, limit: 10 });
// 设备数据
const getDeviceData = async () => {
  loading.value = true;
  const { page, limit } = searchInfo.value;
  try {
    const result = await rtuApi.getDeviceList(searchInfo.value);
    loading.value = false;
    deviceData.data = result?.data?.list.map((item, index) => ({
      num: (page - 1) * limit + (index + 1),
      ...item,
    }));
    deviceData.total = result.data.total_count;
  } catch (error) {}
};
getDeviceData();
// 切换设备查询
const handleSearchStatus = (status) => {
  active.value = status;
  searchInfo.value.page = 1;
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
  searchInfo.value.page = page;
  getDeviceData();
};

// 改变条数
const handlePageSizeChange = (size) => {
  searchInfo.value.limit = size;
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
        :page="searchInfo.page"
        :page-size="searchInfo.limit"
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
