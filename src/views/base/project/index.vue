<script setup>
import { reactive, ref } from "vue";
import SearchForm from "@/components/SearchForm/index.vue";
import { projectFormData, projectFormItems } from "@/constants";

const initialData = ref(projectFormData);
const formItems = reactive(projectFormItems);

// 查询数据
const handleSearchSubmit = (data) => {
  console.log(data);
};

// 重置数据
const handleReset = () => {
  Object.assign(initialData, projectFormData);
};
</script>

<template>
  <div>
    <!-- 查询 -->
    <SearchForm
      :initialData="initialData"
      :formItems="formItems"
      @submit="handleSearchSubmit"
      @reset="handleReset"
      ref="searchFormRef"
    />
  </div>
</template>
