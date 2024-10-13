<template>
  <div class="ip-container">
    <el-input
      v-for="(item, index) in inputs"
      v-model="inputs[index]"
      @input="handleInput($event, index, 0, 0, 255)"
      :key="index"
    ></el-input>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useInputHook } from "@/hooks/useInput";
const { setInputValue } = useInputHook();
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);
// 使用一个数组来存储每个输入框的值
const inputs = ref(["", "", "", ""]);

// 输入限制
const handleInput = (value, index, decimals, min, max) => {
  inputs.value[index] = setInputValue(value, decimals, min, max);
  updateValue()
};

// 更新 modelValue
const updateValue = () => {
  emit("update:modelValue", inputs.value.join("."));
};

// 监听 props.modelValue 的变化，同步更新 inputs
watch(
  () => props.modelValue,
  (newValue) => {
    if(!newValue) {
        inputs.value=['','','','']
        return;
    }
    inputs.value = newValue.split(".");
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.ip-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1;
  column-gap: 10px;

  .el-input {
    position: relative;

    &:not(:last-child)::after {
      content: ".";
      position: absolute;
      right: -6px; /* 适当调整位置 */
      bottom: -9px;
    }
  }
}
</style>
