<script setup>
import { onMounted, reactive, ref } from "vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";

import ListHead from "@/components/ListHead/index.vue";
import { projectFormData, projectFormItems, deviceMap } from "@/constants";

const formItems = reactive(projectFormItems);

const searchInfo = reactive({ ...projectFormData });
const loading = ref(false);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const rtuData = reactive([]);
const columns = ref([
  { prop: "num", label: "序号" },
  { prop: "id", label: "设备编号" },
  { prop: "name", label: "设备名称" },
  { prop: "type", label: "设备类型" },
  { prop: "status", label: "在线状态" },
  { prop: "note", label: "备注" },
]);
// 获取设备数据
const getRtuData = () => {
  loading.value = true;
  searchInfo.page = page.value;
  searchInfo.limit = limit.value;
  const res = {
    code: 0,
    current_page: 1,
    page_count: 1,
    total_count: 10,
    limit: 10,
    data: [
      {
        create_time: "2024-06-21",
        id: "JJJ001",
        name: "测试项目1",
        type: "采集",
        status: 0,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
      {
        create_time: "2024-06-22",
        id: "D001",
        name: "测试项目1",
        type: "采集",
        status: 1,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
      {
        create_time: "2024-06-22",
        id: "JJJ002",
        name: "测试项目1",
        type: "采集",
        status: 1,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
      {
        create_time: "2024-06-22",
        id: "JJJ001D001",
        name: "测试项目1",
        type: "采集",
        status: 1,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
      {
        create_time: "2024-06-22",
        id: "JJJ00132",
        name: "测试项目1",
        type: "采集",
        status: 0,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
      {
        create_time: "2024-06-22",
        id: "JJJ0012",
        name: "测试项目1",
        type: "采集",
        status: 1,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
      {
        create_time: "2024-06-22",
        id: "JJJ0012332",
        name: "测试项目1",
        type: "采集",
        status: 1,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
      {
        create_time: "2024-06-22",
        id: "JJJ001132",
        name: "测试项目1",
        type: "采集",
        status: 1,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
      {
        create_time: "2024-06-22",
        id: "D001",
        name: "测试项目1",
        type: "采集",
        status: 1,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
      {
        create_time: "2024-06-22",
        id: "D009334",
        name: "测试项目1",
        type: "采集",
        status: 0,
        person: "小张",
        director: "小王",
        location: "北京市昌平区",
        note: "测试数据",
      },
    ],
  };
  if (!res.code) {
    page.value = res.current_page;
    total.value = res.total_count;
    Object.assign(
      rtuData,
      res.data.map((item, index) => ({ ...item, num: index + 1 }))
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
  const list = deviceMap.find(({ value }) => type === value);
  return list.label;
};

// 切换页数
const handleChangePage = (page) => {
  console.log(page, "page");
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
      <template #type="scope" class="status-row">
        {{ getType(scope.row.type) }}
      </template>
      <template #status="scope" class="status-row">
        <span :class="{ status: true, 'status-online': scope.row.status }">
        </span>
        <span :class="{ 'status-online-text': scope.row.status }">{{
          scope.row.status ? "在线" : "离线"
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
