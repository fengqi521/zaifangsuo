<script setup>
import { ref } from "vue";
import userApi from "@/api/account";
const lists = ref([]);

// 获取用户列表
const getLists = async () => {
  const result = await userApi.getUserList();
  if (!result?.code) {
    console.log(result);
  }
};

getLists();
</script>
<template>
  <div>用户列表</div>
</template>
