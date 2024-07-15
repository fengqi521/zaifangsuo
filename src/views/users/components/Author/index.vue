<script setup>
import { onMounted, ref, watch } from "vue";
import ElModal from "@/components/ElModal/index.vue";
import { isEqual } from "lodash";
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  },
  deviceOptions: {
    type: Array,
    default: () => {},
  },
});
const transferValue = ref([]);
watch(
  () => props.data,
  (newVal) => {
    if (isEqual(newVal, transferValue.value)) return;
    transferValue.value = [...newVal];
  },
  { immediate: true, deep: true }
);

const emit = defineEmits(["update-transfer", "handle-close", "handle-submit"]);

// 搜索
const filterMethod = (query, item) => {
  return item.label.toLowerCase().includes(query.toLowerCase());
};
// 关闭
const handleClose = () => {
  emit("handle-close", false);
};

const handleChangRight = (values, s) => {
  emit("update-transfer", values);
};

// 提交
const handleChange = (values) => {
  emit("handle-submit", values);
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
        @change="handleChange"
        :data="props.deviceOptions"
        :titles="['未授权设备', '已授权设备']"
        :button-texts="['取消授权', '设备授权']"
        :filter-method="filterMethod"
        filterable
        filter-placeholder="查询数据"
        @right-check-change="handleChangRight"
      />
    </template>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <!-- <el-button type="primary" @click="handleSubmit">确认</el-button> -->
      </div>
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

    .el-checkbox__label {
      font-size: 14px;
    }
  }

  .el-transfer__buttons button {
    display: block;
    margin: 20px auto;
  }
}
</style>
