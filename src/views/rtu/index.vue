<script setup>
import { reactive, ref } from "vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import rtuApi from "@/api/rtu";

import ListHead from "@/components/ListHead/index.vue";
import { projectFormData, deviceFormItems, deviceMap } from "@/constants";

const formItems = reactive(deviceFormItems);

const searchInfo = reactive({ ...projectFormData });
const loading = ref(false);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const rtuData = reactive([]);
const columns = ref([
  { prop: "num", label: "序号" },
  { prop: "device_number", label: "设备编号" },
  { prop: "device_name", label: "设备名称" },
  { prop: "device_type", label: "设备类型" },
  { prop: "online", label: "在线状态" },
  { prop: "monitoring_station", label: "所属站" },
]);
// 获取设备数据
const getRtuData = async () => {
  loading.value = true;
  searchInfo.page = page.value;
  searchInfo.limit = limit.value;
  const res = await rtuApi.getDeviceList({ status: 2 });
  if (!res.code) {
    page.value = res.data.current_page;
    total.value = res.data.total_count;
    Object.assign(
      rtuData,
      res.data.list.map((item, index) => ({ ...item, num: index + 1 }))
    );
  }
  loading.value = false;
};

getRtuData();

// 查询数据
const handleSearchSubmit = (data) => {
  Object.assign(searchInfo, data);
  getRtuData();
};

// 重置数据
const handleReset = () => {
  page.value = 1;
  Object.assign(searchInfo, projectFormData);
  getRtuData();
};

// 查询传感器类型
const getType = (type) => {
  const list = deviceMap.find(({ value }) => Number(type) === value);
  return list.label;
};

// 切换页数
const handleChangePage = (page) => {
  page.value = page;
  getRtuData();
};

//切换条数
const handleChangeSize = (size) => {
  console.log(size, "size");
  limit.value = size;
  getRtuData();
};
</script>

<template>
  <div>
    <ListHead title="RTU列表"> </ListHead>
    <!-- 查询 -->
    <SearchForm
      :initialData="searchInfo"
      :formItems="formItems"
      @submit="handleSearchSubmit"
      @reset="handleReset"
      ref="searchFormRef"
    />

    <ElTable
      class="rtu-table"
      :loading="loading"
      :columns="columns"
      :data="rtuData"
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
      <template #action="{ row }">
        <router-link class="btn author-btn" :to="`/rtu/detail/${row.id}`"
          >查看详情</router-link
        >
        <span class="btn update-btn" @click="">下发指令</span>
      </template>
    </ElTable>

    <ElPagination
      :currentPage="page"
      :page-size="limit"
      :total="total"
      @pagination-change="handleChangePage"
      @page-size-change="handleChangeSize"
    />
  </div>
</template>
<style lang="scss" scoped>
.rtu-table {
  .status {
    display: inline-flex;
    margin-right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    color: var(--offline-color);
    background: var(--offline-bg-color);
    border: 1px solid var(--offline-border-color);
  }
  .status-online {
    background: var(--online-color);
    border-color: var(--online-border-color);
  }

  .status-online-text {
    color: var(--online-color);
  }
}
</style>
