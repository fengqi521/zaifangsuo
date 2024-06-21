<script setup>
import { ref, onMounted } from 'vue';
import ElTable from "@/components/ElTable/index.vue";

const columns = ref([
  { prop: 'date', label: '日期', width: '180' },
  { prop: 'name', label: '名称', width: '180' },
  { prop: 'address', label: '地址' },
]);

const data = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const total = ref(0);

// 模拟数据加载
const loadData = async () => {
  loading.value = true;
  setTimeout(() => {
    data.value = [
      { date: '2024-06-21', name: 'Tom', address: 'No. 189, Grove St.' },
      { date: '2024-06-22', name: 'Jerry', address: 'No. 123, Elm St.' },
      // 更多数据...
    ];
    total.value = data.value.length;
    loading.value = false;
  }, 1000);
};

const handlePaginationChange = (page, size) => {
  // 处理分页请求
  console.log('Pagination changed:', page, size);
};

const handlePageSizeChange = (size) => {
  // 处理页面大小改变
  console.log('Page size changed:', size);
};

const handleSortChange = (sortInfo) => {
  // 处理排序请求
  console.log('Sort changed:', sortInfo);
};

const handleSelectionChange = (selection) => {
  // 处理行选择
  console.log('Selection changed:', selection);
};

onMounted(() => {
  loadData();
});
</script>
<template>
  <div class="device-container">
    <div>
      
    </div>
    <ElTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="true"
      :page-size="pageSize"
      :total="total"
      :tableProps="{ showSelection: true, border: true }"
      @pagination-change="handlePaginationChange"
      @page-size-change="handlePageSizeChange"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
    </ElTable>
  </div>
</template>
<style lang="scss" scoped>
.device-container{
  padding-inline:12px;
    margin-top: 24px;
    background:var(--background-color);
    border-radius: 2px;
}
</style>
