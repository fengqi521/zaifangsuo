<script setup>
import { ref } from "vue";

const props = defineProps({
  avatarUrl: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "超级管理员",
  },
  userName: {
    type: String,
    default: "zhangheng",
  },
});
</script>
<template>
  <div class="user-container">
    <!-- 头像 -->
    <div class="user-avatar"><img :src="avatarUrl" /></div>
    <!-- 用户名 -->
    <div class="user-info">
      <p class="user-item">{{ role }}</p>
      <p class="user-item">{{ userName }}</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.user-container {
  display: flex;
  align-items: center;
  height:32px;
  margin-inline:30px 18px;

  .user-avatar {
    width: 32px;
    height: 32px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

  }

  .user-info{
    padding-inline:8px;
    .user-item{
      margin:0;
      padding:2px 0
    }
  }
}

</style>
