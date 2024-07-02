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
import { ref, reactive } from "vue";

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

const formData = reactive({ ...props.initialData });
const formRef = ref(null);

// 提交表单
const onSubmit = async () => {
  const valid = await formRef.value.validate();
  if (valid) {
    emit();
    return;
  }
  console.log("error submit!");
  return false;
};

// 重置表单
const onReset = () => {
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

  .el-form-item {
    margin: 12px;
  }

  .el-select {
    min-width: 160px;
  }

  .el-button {
    border-radius: 0;
  }

  :deep(.el-select__wrapper),
  :deep(.el-input__wrapper) {
    color: var(--select-text-color);
    border-radius: 0;
    background: var(--select-bg-color);
    border: 1px solid var(--select-border-color);
  }

  :deep(.el-select__wrapper.is-focused),
  :deep(.el-range-editor.is-active:hover),
  :deep(.el-range-editor.is-active) {
    box-shadow: none;
  }

  :deep(.el-select__placeholder),
  :deep( .el-range-input) {
    color: var(--select-text-color);
  }

  .el-button--primary {
    background: var(--btn-bg-color);
    &:hover {
      background: var(--btn-hover-color);
    }
  }
}
</style>
