<script setup>
import { watch } from "vue";

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
  pagerCount:{
    type:Number,
    default:5
  }
});

const emit = defineEmits(["pagination-change", "page-size-change"]);

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
  <el-pagination
    v-if="props.total"
    class="pagination"
    :current-page="props.currentPage"
    :page-size="props.pageSize"
    :total="props.total"
    :pager-count="props.pagerCount"
    layout="slot,prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
    <template #default>
      <span class="pagination-info"> 共 {{ props.total }} 条数据 </span>
    </template>
  </el-pagination>
</template>
<style lang="scss" scoped>
.pagination {
  // padding:8px 0;
  margin-top:16px;
  justify-content: flex-end;
  // background:var(--body-bg-color);

  &-info {
    color: var(--el-text-color-regular);
  }
  :deep(.el-select) {
    width: 100px;
    .el-select__wrapper {
      min-height: 28px;
    }
  }

  :deep(.el-input__wrapper) {
    height: 28px;
  }
}
</style>
