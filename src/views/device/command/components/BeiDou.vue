<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="beidou-container">
    <el-form-item prop="beiDouType">
      <el-select placeholder="工作类型" v-model="props.modelValue" style="width: 100%">
        <el-option label="24小时值守" :value="0" />
        <el-option label="定点值守" :value="1" />
      </el-select>
    </el-form-item>
  </div>
</template>
<style lang="scss" scoped>
.beidou-container {
  width: 100%;
}
</style>
