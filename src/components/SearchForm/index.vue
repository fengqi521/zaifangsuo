<template>
  <el-form :model="formData" ref="formRef">
    <slot v-for="(item, index) in formItems" :name="item.slot" :key="index">
      <el-form-item :label="item.label" :prop="item.prop">
        <component
          :is="item.type"
          v-model="formData[item.prop]"
          v-bind="item.attrs"
        >
          <el-option
            v-if="item.type === 'el-select'"
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </component>
      </el-form-item>
    </slot>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, watch, defineEmits } from "vue";

// Props: 传递表单配置、数据和验证规则
const props = defineProps({
  formItems: {
    type: Array,
    required: true,
  },
  initialData: {
    type: Object,
    required: true,
  },
});

let formData = reactive({ ...props.initialData });
const formRef = ref(null);
watch(
  () => props.initialData,
  (newData) => {
    formData = { ...newData };
  },
  { deep: true }
);
const emit = defineEmits(["submit",'reset']);
// 提交表单
const onSubmit = async () => {
  const valid = await formRef.value.validate();
  if (valid) {
    emit("submit", { ...formData });
    return;
  }
  return false;
};

// 重置表单
const onReset = () => {
  emit('reset')
  formRef.value.resetFields();
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: var(--background-color);
  user-select: none;
  padding:12px 0 0 12px;

  .el-form-item {
    margin:0 12px 12px 0;
  }

  .el-select {
    min-width: 160px;
  }

  :deep(.el-select__wrapper),
  :deep(.el-input__wrapper) {
    border: 1px solid var(--select-border-color);
  }

  :deep(.el-select__wrapper.is-focused),
  :deep(.el-range-editor.is-active:hover),
  :deep(.el-range-editor.is-active) {
    box-shadow: none;
  }
}
</style>
