<script setup>
import { ref } from "vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";

import { userFormData, userFormItems } from "@/constants";
import userApi from "@/api/account";

const initialData = ref(userFormData);
const formItems = ref(userFormItems);

const loading = ref(false);
const userData = ref([]);
const columns = ref([
  { prop: "id", label: "ID" },
  { prop: "user_name", label: "用户名" },
  { prop: "phone", label: "手机号" },
  { prop: "email", label: "邮箱" },
  { prop: "devices", label: "已授权设备" },
  { prop: "create_time", label: "创建时间" },
]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取用户列表
const getLists = async () => {
  loading.value = true;
  try {
    const result = await userApi.getUserList();
    if (!result?.code) {
      userData.value = result.data.list.map((item) => ({
        ...item,
        devices: item.devices.map(({ device_name }) => device_name),
      }));
      total.value = result.data.total_count;
      currentPage.value = result.data.current_page;
    }
  } catch (error) {
    throw new Error(error);
  }
  loading.value = false;
  console.log(loading.value);
};

// 切换分页
const handleChangeCurrent = (page, size) => {
  console.log(page, size);
  console.log("Pagination changed:", page, size);
};

// 切换条数
const handlePageSizeChange = (size) => {
  console.log(size);
  console.log("Pagination changed:", size);
};

getLists();
</script>
<template>
  <div>
    <SearchForm :formItems="formItems" :initialData="initialData" />
    <ElTable
      :loading="loading"
      :columns="columns"
      :data="userData"
      :tableProps="{ showSelection: false, border: true }"
    />
    <ElPagination
      :currentPage="currentPage"
      :page-size="pageSize"
      :total="total"
      @pagination-change="handleChangeCurrent"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>
