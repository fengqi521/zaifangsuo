<template>
  <div class="table-container">
    <!-- 表格 -->
    <el-table
      v-bind="tableProps"
      height="484"
      :data="props.data"
      v-loading="props.loading"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        v-if="tableProps.showSelection"
        width="55"
      ></el-table-column>
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :sortable="column.sortable"
        :formatter="column.formatter"
      >
        <template #default="scope">
          <slot
            :name="column.prop"
            :row="scope.row"
            :column="scope.column"
            :$index="scope.$index"
          >
          <div v-if="Array.isArray(scope.row[column.prop])">
            <p v-for="(item, index) in scope.row[column.prop]" :key="index">
              {{ item.device_name }}
            </p>
          </div>
          <div v-else>
            {{ scope.row[column.prop] }}
          </div>
          </slot>
        </template>
      </el-table-column>
      <el-table-column v-if="$slots.action" label="操作" align="center">
        <template #default="scope">
          <slot
            name="action"
            :row="scope.row"
            :column="scope.column"
            :$index="scope.$index"
          ></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
// 组件 props
const props = defineProps({
  columns: Array,
  data: Array,
  loading: Boolean,
  pagination: Boolean,
  pageSize: Number,
  total: Number,
  defaultSort: Object,
  tableProps: Object,
});

// 排序改变处理函数
const handleSortChange = (sortInfo) => {
  emit("sort-change", sortInfo);
};

// 选择改变处理函数
const handleSelectionChange = (selection) => {
  emit("selection-change", selection);
};

const emit = defineEmits([
  "pagination-change",
  "page-size-change",
  "sort-change",
  "selection-change",
]);
</script>

<style lang="scss" scoped>
@import '@/styles/tools.scss';
.table-container {
  padding: 20px;
  text-align: right;
  background: var(--background-color);
  :deep(.el-table) {
    thead {
      font-size: 12px;
      color: var(--table-th-text-color);
      font-weight: bold;
    }

    .el-table__body-wrapper {
      font-size: 12px;
      color: var(--table-tbody-text-color);
    }

    th,
    td {
      border-right: none;
      height: 44px;
      max-height: 76px;
      overflow: hidden
    }

    th {
      background: var(--table-th-bg-color);
    }

    .cell {
      line-height: 18px;
      max-height: 76px;
      @extend %ellipsis
    }
  }
}
</style>
