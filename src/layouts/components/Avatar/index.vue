<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "@/plugins/message";
import { userInfoStoreHook } from "@/store/modules/user";
import { userRolesMap } from "@/constants";


const open = ref(false);
const router = useRouter();
const { success, error } = useMessage();
const { userInfo, getUserInfo, logout } = userInfoStoreHook();

// 获取用户信息
getUserInfo();

// 显示菜单栏
const handleChange = (val) => {
  open.value = val;
};

const role = ref('')
const getRoleName = ()=>{
  const list = userRolesMap.find(({value})=>value===Number(userInfo.role))
  role.value =  list?.label
}
getRoleName()
// 退出登录
const handleClickLogout = () => {
  try {
    logout()
      .then(() => {
        success("退出成功,即将跳转登录页");
        setTimeout(() => {
          router.push({ path: "/login" });
        }, 1000);
      })
      .catch((error) => {
        // error(error.message);
      });
  } catch (error) {}
};
</script>
<template>
  <el-dropdown placement="bottom-end" @visible-change="handleChange">
    <div class="user-container">
      <!-- 头像 -->
      <div class="user-avatar"><img src="@/assets/images/avatar.png" /></div>
      <!-- 用户名 -->
      <div class="user-info">
        <p class="user-item">{{ role }}</p>
        <p class="user-item">{{ userInfo.name }}</p>
      </div>
      <Icon
        :class="{ 'user-icon': true, 'open-icon': open }"
        iconClass="icon-shanglaxiala"
        size="12px"
        color="#FFF"
      />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- <el-dropdown-item>修改密码</el-dropdown-item> -->
        <el-dropdown-item @click="handleClickLogout">安全退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<style lang="scss" scoped>
.user-container {
  display: flex;
  align-items: center;
  margin-left: 30px;
  height: 32px;
  color: var(--nav-header-text-color);
  cursor: pointer;

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

  .user-info {
    padding-inline: 8px;
    .user-item {
      margin: 0;
      padding: 2px 0;
    }
  }

  .user-icon {
    transition: transform 0.3s ease-in-out;
  }

  .open-icon {
    transform: rotate(-180deg);
    transition: transform 0.3s ease-in-out;
  }
}
</style>
