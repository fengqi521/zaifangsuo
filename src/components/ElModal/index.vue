<script setup>
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    require: true,
  },
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["handle-close"]);

// 关闭按钮
const handleClickClose = () => {
  emit("handle-close", false);
};
</script>

<template>
  <div>
    <el-dialog
      :model-value="props.dialogVisible"
      :title="props.title"
      :width="props.width"
      @close="handleClickClose"
    >
      <slot></slot>
      <template #footer>
        <slot name="footer">
          <!-- <div class="dialog-footer">
            <el-button @click="closeDialog">Cancel</el-button>
            <el-button type="primary" @click="closeDialog">Confirm</el-button>
          </div> -->
        </slot>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__title {
    font-size: 16px;
    color: var(--panel-text-color);
  }
}
</style>
