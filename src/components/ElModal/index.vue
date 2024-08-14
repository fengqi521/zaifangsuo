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
  <div class="modal">
    <el-dialog
      :model-value="props.dialogVisible"
      :destroy-on-close="true"
      :show-close="false"
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
      <img class="cancel-icon" src="@/assets/images/cancel.png" alt="" @click="handleClickClose">
    </el-dialog>
 
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-dialog) {
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
  margin:0;
  padding:24px;
  .el-dialog__title {
    font-size: 16px;
    font-weight: 700;
    color: var(--panel-text-color);
  }

  .cancel-icon{
    position: absolute;
    top: -40px;
    right: 0;
    width: 28px;
    height: 28px;
    cursor: pointer;
  }
}
</style>
