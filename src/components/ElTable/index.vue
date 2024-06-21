<template>
    <div class="table-container">
      <!-- 表格 -->
      <el-table
        v-bind="tableProps"
        :data="tableData"
        v-loading="loading"
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
            <slot :name="column.prop" :row="scope.row" :column="scope.column" :$index="scope.$index">
              {{ scope.row[column.prop] }}
            </slot>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$slots.action"
          label="操作"
          align="center"
        >
          <template #default="scope">
            <slot name="action" :row="scope.row" :column="scope.column" :$index="scope.$index"></slot>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination
        v-if="pagination"
        background
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, toRefs, defineEmits, defineProps } from 'vue';
  
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
  const { data, pageSize = 10, total = 0 } = toRefs(props);
  
  // 状态
  const currentPage = ref(1);
  const tableData = ref(data.value);
  const loading = ref(props.loading || false);
  
  // 监听 data 变化
  watch(
    () => data.value,
    (newData) => {
      tableData.value = newData;
    },
    { immediate: true }
  );
  
  // 分页改变处理函数
  const handleCurrentChange = (page) => {
    currentPage.value = page;
    emit('pagination-change', page, pageSize.value);
  };
  
  // 页面大小改变处理函数
  const handleSizeChange = (size) => {
    emit('page-size-change', size);
  };
  
  // 排序改变处理函数
  const handleSortChange = (sortInfo) => {
    emit('sort-change', sortInfo);
  };
  
  // 选择改变处理函数
  const handleSelectionChange = (selection) => {
    emit('selection-change', selection);
  };
  
  const emit = defineEmits(['pagination-change', 'page-size-change', 'sort-change', 'selection-change']);
  </script>
  
  <style lang="scss" scoped>
  .table-container{
    :deep(.el-table){
        th,td{
            border:none;
        }

        th{
            background:var(--table-th-bg-color)
        }
            
        
    }
  }
  </style>
  