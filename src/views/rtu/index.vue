<script setup>
import { onMounted, reactive, ref } from "vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import { projectFormData, projectFormItems } from "@/constants";

const initialData = ref(projectFormData);
const formItems = reactive(projectFormItems);

// 表格
const data = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const total = ref(0);

const columns = ref([
  { prop: "num", label: "序号" },
  { prop: "id", label: "项目ID" },
  { prop: "name", label: "项目名称" },
  { prop: "type", label: "项目类型" },
  { prop: "unit", label: "施工单位" },
  { prop: "person", label: "负责人" },
  { prop: "director", label: "技术负责人" },
  { prop: "location", label: "位置" },
  { prop: "note", label: "备注" },
]);

onMounted(() => {
    loading.value = true;
  // 请求数据
  loading.value = false;
  data.value = [
    {
      create_time: "2024-06-21",
      id: "JJJ001",
      name: "测试项目1",
      type: "采集",
      unit: "机械厂",
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
      unit: "机械厂",
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
      unit: "机械厂",
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
      unit: "机械厂",
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
      unit: "机械厂",
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
      unit: "机械厂",
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
      unit: "机械厂",
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
      unit: "机械厂",
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
      unit: "机械厂",
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
      unit: "机械厂",
      person: "小张",
      director: "小王",
      location: "北京市昌平区",
      note: "测试数据",
    },
  ];
});

// 查询数据
const handleSearchSubmit = (data) => {
  console.log(data);
};

// 重置数据
const handleReset = () => {
  Object.assign(initialData, projectFormData);
};

const handlePaginationChange = (page, size) => {
  // 处理分页请求
  console.log("Pagination changed:", page, size);
};

const handlePageSizeChange = (size) => {
  // 处理页面大小改变
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
  <div>
    <!-- 查询 -->
    <SearchForm
      :initialData="initialData"
      :formItems="formItems"
      @submit="handleSearchSubmit"
      @reset="handleReset"
      ref="searchFormRef"
    />
    <ElTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="true"
      :page-size="pageSize"
      :total="total"
      :tableProps="{ showSelection: false, border: true }"
      @pagination-change="handlePaginationChange"
      @page-size-change="handlePageSizeChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
    </ElTable>
  </div>
</template>
