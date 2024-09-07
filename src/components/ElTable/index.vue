<template>
  <div class="table-container">
    <!-- 表格 -->
    <el-table v-loading="props.loading" v-bind="tableProps" :data="data" @sort-change="handleSortChange"
      @selection-change="handleSelectionChange" scrollbar-always-on>
      <el-table-column type="selection" v-if="tableProps.showSelection"></el-table-column>
      <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label"
        :sortable="column.sortable" :formatter="column.formatter" :width="column.width">
        <template #default="scope">
          <el-tooltip :disabled="!isShowTooltip" :content="setTooltipContent(scope, column.prop)" placement="top"
            popper-class="table-tooltip">
            <div class="cell-item" @mouseover="(e) => handleMouseOver(e, scope.row, scope.prop)">
              <slot v-if="column.type === 'slot'" :name="column.prop" :row="scope.row" :column="scope.column">
              </slot>
              <div v-else>
                {{ scope.row[column.prop] || "--" }}
              </div>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="$slots.action" label="操作" width="200">
        <template #default="scope">
          <slot name="action" :row="scope.row" :column="scope.column" :$index="scope.$index"></slot>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty v-if="!props.data.length" />
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from "vue";
const isShowTooltip = ref(false);
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
const setTooltipContent = (scope, prop) => {
  const row = scope.row;
  const value = row[prop];
  if (value && Array.isArray(value) && value.length) {
    return value.map((item) => item.device_name).join(",");
  }

  if (value) return `${value}`;
  return "";
};

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

const handleMouseOver = (event, row, prop) => {
  const scrollHeight = event.currentTarget.scrollHeight;
  const clientHeight = event.currentTarget.clientHeight;
  isShowTooltip.value = scrollHeight > clientHeight;
};
</script>
<style lang="scss">
.table-tooltip {
  max-width: 300px;
}
</style>
<style lang="scss" scoped>
@import "@/styles/tools.scss";

.table-container {
  text-align: right;
  background: var(--background-color);

  :deep(.el-table) {
    thead {
      font-size: 12px;
      color: var(--table-th-text-color);
      font-weight: bold;
    }

    .el-scrollbar__wrap {
      // min-height: 250px;
      max-height: 480px;
      @extend %scrollbar;
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
      overflow: hidden;
    }

    th {
      background: var(--table-th-bg-color);
    }

    .cell {
      text-align: center;
      line-height: 18px;
      max-height: 54px;
    }

    .cell-item {
      line-height: 18px;
      max-height: 54px;
      text-align: center;
      @extend %ellipsis-3;
    }
  }
}
</style>
