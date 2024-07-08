<script setup>
const props = defineProps({
  currentPage: {
    type: [String, Number],
    default: 1,
  },
  pageSize: {
    type: [String, Number],
    default: 10,
  },
  total: {
    type: [String, Number],
    default: 0,
  },
});
const emit = defineEmits(["handle-change-page"]);

// 分页改变处理函数
const handleCurrentChange = (page) => {
  emit("pagination-change", page);
};

// 页面大小改变处理函数
const handleSizeChange = (size) => {
  emit("page-size-change", size);
};
</script>

<template>
  <!-- 分页 -->
  <el-pagination
    v-if="total"
    class="pagination"
    :current-page.sync="currentPage"
    :page-size="pageSize"
    :total="total"
    layout="slot, prev, pager, next,sizes, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
    <template #default>
      <span class="pagination-info"> 共 {{ total }} 条数据 </span>
    </template>
  </el-pagination>
</template>
<style lang="scss" scoped>
.pagination {
  margin-top: 16px;
  justify-content: flex-end;

  .pagination-info {
    color: var(--el-text-color-regular);
  }
}
</style>
