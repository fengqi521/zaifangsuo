<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { userInfoStoreHook } from "@/store/modules/user";

import formValidators from "@/utils/formValidators";
import loginApi from "@/api/login";
import { useMessage } from "@/plugins/message";

const { success, error } = useMessage();
const router = useRouter();

// 定义变量
const loading = ref(false);
const formRef = ref(null);
const loginInfo = reactive({ username: "", password: "", captcha: "" });
const codeImg = ref("");
const loginInfoRules = reactive({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
    { min: 2, max: 64, message: "长度在2-64个字符", trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    // {
    //   validator: formValidators.validatePassword,
    //   trigger: "blur",
    // },
  ],
  captcha: [
    {
      required: true,
      message: "请输入验证码",
    },
  ],
});

// 获取验证码
const handleClickGetCode = () => {
  loginApi.getCaptcha().then((res) => {
    if (!res.code) {
      codeImg.value = res.data.src;
    }
  });
};
handleClickGetCode();

// 提交表单
const submitForm = async () => {
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      loading.value = true;
      userInfoStoreHook()
        .login(loginInfo)
        .then((res) => {
          if (!res.code) {
            success("登录成功");
            router.push({ path: "/" });
            return;
          }
          error(res.message);
          handleClickGetCode();
        })
        .catch((err) => {
          error(err);
          handleClickGetCode();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  } catch (error) {}
};
</script>
<template>
  <div class="login-form" v-loading="loading">
    <!-- <h3>地质安全及地质资源监测系统</h3> -->
    <el-form
      ref="formRef"
      :model="loginInfo"
      :rules="loginInfoRules"
      label-width="auto"
      @keyup.enter="submitForm"
    >
      <el-form-item prop="username">
        <el-input v-model="loginInfo.username" placeholder="用户名">
          <template #prefix>
            <Icon
              iconClass="icon-yonghuming"
              color="var(--login-icon-color)"
              size="18px"
            />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginInfo.password"
          type="password"
          placeholder="密码"
        >
          <template #prefix>
            <Icon
              iconClass="icon-ai-password"
              color="var(--login-icon-color)"
            />
          </template>
          <!-- <template #suffix>
            <Icon
              iconClass="icon-ai-password"
              color="var(--login-icon-color)"
            />
          </template> -->
        </el-input>
      </el-form-item>
      <el-form-item class="login-form-code" prop="captcha">
        <el-input v-model="loginInfo.captcha" placeholder="验证码" />
        <img class="captcha-image" :src="codeImg" />
        <span class="change-span" @click="handleClickGetCode">换一张</span>
      </el-form-item>
      <el-button class="btn-primary" @click="submitForm">登录</el-button>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.login-form {
  padding: 80px 24px;
  background: var(--background-color);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 6px 8px rgba(0, 0, 0, 0.15);

  :deep(.el-form) {
    width: 330px;
  }
  .el-form-item {
    margin-bottom: 32px;
  }

  :deep(.el-input) {
    height: 40px;

    .el-input__wrapper {
      border-radius: 0;
    }
  }

  .login-form-code {
    .captcha-image {
      max-width: 70px;
      height: 40px;
      margin-left: 24px;
    }

    .change-span {
      margin-left: 20px;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      color: var(--btn-normal-color);
    }
    :deep(.el-form-item__content) {
      flex-wrap: nowrap;
    }
  }
  .btn-primary {
    margin-top: 30px;
    width: 100%;
    color: var(--text-color);
    background: var(--btn-normal-color);
  }
}
</style>
