<script setup>
import { ref, onMounted } from "vue";
import ElTable from "@/components/ElTable/index.vue";

const columns = ref([
  { prop: "num", label: "序号"},
  { prop: "name", label: "设备名称" },
  { prop: "code", label: "设备编号" },
  { prop: "type", label: "设备类型" },
  { prop: "group", label: "设备群组" },
  { prop: "status", label: "在线状态" },
  { prop: "time", label: "在线时间" },
  { prop: "create_time", label: "创建时间" },
]);

const data = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const total = ref(0);
const active = ref(0);

// 模拟数据加载
const loadData = async () => {
  loading.value = true;
  setTimeout(() => {
    data.value = [
      {
        create_time: "2024-06-21",
        name: "Tom",
        code: "No. 189, Grove St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      {
        create_time: "2024-06-22",
        name: "Jerry",
        code: "No. 123, Elm St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      {
        create_time: "2024-06-22",
        name: "Jerry",
        code: "No. 123, Elm St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      {
        create_time: "2024-06-22",
        name: "Jerry",
        code: "No. 123, Elm St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      {
        create_time: "2024-06-22",
        name: "Jerry",
        code: "No. 123, Elm St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      {
        create_time: "2024-06-22",
        name: "Jerry",
        code: "No. 123, Elm St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      {
        create_time: "2024-06-22",
        name: "Jerry",
        code: "No. 123, Elm St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      {
        create_time: "2024-06-22",
        name: "Jerry",
        code: "No. 123, Elm St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      {
        create_time: "2024-06-22",
        name: "Jerry",
        code: "No. 123, Elm St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      {
        create_time: "2024-06-22",
        name: "Jerry",
        code: "No. 123, Elm St.",
        type: "智能采集",
        group: "田黄村项目",
        status: 1,
        time: "2024-04-12 12:23:11",
      },
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.',type:'智能采集' ,group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.',type:'智能采集' ,group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.' ,type:'智能采集',group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.' ,type:'智能采集',group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.' ,type:'智能采集',group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.' ,type:'智能采集',group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.' ,type:'智能采集',group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.',type:'智能采集' ,group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.',type:'智能采集' ,group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
      // { create_time: '2024-06-22', name: 'Jerry', code: 'No. 123, Elm St.',type:'智能采集' ,group:'田黄村项目',status:1,time:'2024-04-12 12:23:11'},
    ];
    data.value = data.value.map((item, index) => ({ num: index + 1, ...item }));
    total.value = data.value.length;
    loading.value = false;
  }, 1000);
};

// 切换设备查询
const handleSearchStatus = (status)=>{
 active.value = status;

}

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

onMounted(() => {
  loadData();
});
</script>
<template>
  <div class="device-container">
    <div class="device-head">
      <span :class="{ active: active == 0 }" @click="handleSearchStatus(0)">在线设备</span>
      <span :class="{ 'head-line': true, active: active == 1 }" @click="handleSearchStatus(1)">离线设备</span>
    </div>
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
<style lang="scss" scoped>
.device-container {
  padding: 0 12px 16px 12px;
  margin-top: 16px;
  background: var(--background-color);
  border-radius: 2px;

  .device-head {
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: var(--panel-text-color);
    cursor: pointer;
    user-select: none;

    .active {
      font-weight: bold;
      color: var(--panel-active-color);
    }

    .head-line{
      margin-left: 8px;
    }
  }
}
</style>
