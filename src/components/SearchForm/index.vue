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
      <el-button type="primary" @click="onSubmit">
        <slot name="submit-button">查询</slot>
      </el-button>
      <el-button @click="onReset">
        <slot name="reset-button">重置</slot>
      </el-button>
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

let formData = ref({ ...props.initialData });
const formRef = ref(null);
watch(
  () => props.initialData,
  (newData) => {
    Object.assign(formData.value, newData);
  },
  { deep: true }
);
const emit = defineEmits(["submit", "reset"]);
// 提交表单
const onSubmit = async () => {
  const valid = await formRef.value.validate();
  if (valid) {
    emit("submit", { ...formData.value });
    return;
  }
  return false;
};

// 重置表单
const onReset = () => {
  emit("reset");
  formRef.value.resetFields();
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 24px 0 0 24px;
  border-radius: 4px;
  margin-bottom: 24px;
  background: var(--background-color);
  user-select: none;

  .el-form-item {
    margin: 0 24px 24px 0;

    // .el-form-item__label {
    //   color: rgba(0, 0, 0, 0.54);
    // }
  }

  .el-select {
    min-width: 160px;
  }
}
</style>
