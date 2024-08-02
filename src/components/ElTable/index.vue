<template>
  <div class="table-container">
    <!-- 表格 -->
    <el-table
      v-loading="props.loading"
      v-bind="tableProps"
      :data="data"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      scrollbar-always-on
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
        :sortable="column.sortable"
        :formatter="column.formatter"
        :width="column.width"
      >
        <template #default="scope">
          <slot
            :name="column.prop"
            :row="scope.row"
            :column="scope.column"
            :$index="scope.$index"
          >
            <el-tooltip
              v-if="scope.row[column.prop + '_showTooltip']"
              :content="scope.row[column.prop]"
              placement="top"
            >
              <div
                v-if="Array.isArray(scope.row[column.prop])"
                @mouseover="(e) => handleMouseOver(e, scope.row, scope.prop)"
              >
                <p v-for="(item, index) in scope.row[column.prop]" :key="index">
                  {{ item.device_name }}
                </p>
              </div>
              <div
                v-else
                @mouseover="(e) => handleMouseOver(e, scope.row, column.prop)"
              >
                {{ scope.row[column.prop] }}
              </div>
            </el-tooltip>
            <div>
              <div
                v-if="Array.isArray(scope.row[column.prop])"
                @mouseover="(e) => handleMouseOver(e, scope.row, scope.prop)"
              >
                <p v-for="(item, index) in scope.row[column.prop]" :key="index">
                  {{ item.device_name }}
                </p>
              </div>
              <div
                v-else
                @mouseover="(e) => handleMouseOver(e, scope.row, column.prop)"
              >
                {{ scope.row[column.prop] }}
              </div>
            </div>
          </slot>
        </template>
      </el-table-column>
      <el-table-column v-if="$slots.action" label="操作">
        <template #default="scope">
          <slot
            name="action"
            :row="scope.row"
            :column="scope.column"
            :$index="scope.$index"
          ></slot>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty v-if="!props.data.length" :image-size="80" />
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
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

// const tableData = reactive([...props.data]);

// watch(
//   () => props.data,
//   (newValues) => {
//     console.log(newValues,'=========')
//     tableData = [...tableData,newValues]
//     // Object.assign(tableData, newValues);
//   },
//   { deep: true }
// );
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
  row[prop + "_showTooltip"] = scrollHeight > clientHeight;
};
</script>

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
      // display: flex;
      // flex-wrap: wrap;
      // justify-content: center;
      line-height: 18px;
      max-height: 76px;
      text-align: center;
      @extend %ellipsis-3;
    }
  }
}
</style>
