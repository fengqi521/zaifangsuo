<script setup>
import { ref, watch } from "vue";
import ElModal from "@/components/ElModal/index.vue";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  deviceOptions: {
    type: Array,
    default: () => {},
  },
});
const emit = defineEmits(["handle-close", "get-list"]);

const transferValue = ref([1, 2]);

// 搜索
const filterMethod = (query, item) => {
  return item.label.toLowerCase().includes(query.toLowerCase());
};
// 关闭
const handleClose = () => {
    emit("handle-close",false)
    console.log('fffffffffffffffff')
};
</script>

<template>
  <ElModal
    title="设备授权"
    :dialogVisible="props.dialogVisible"
    @handle-close="handleClose"
  >
    <template v-slot>
      <el-transfer
        v-model="transferValue"
        :data="deviceOptions"
        :titles="['未授权设备', '已授权设备']"
        :filter-method="filterMethod"
        filterable
        filter-placeholder="查询数据"
      />
    </template>
  </ElModal>
</template>
<style lang="scss" scoped>
:deep(.el-transfer) {
  display: flex;
  align-items: center;

  .el-transfer-panel {
    flex: 1;

    .el-transfer-panel__body {
      min-height: 500px;
    }
  }
}
</style>
