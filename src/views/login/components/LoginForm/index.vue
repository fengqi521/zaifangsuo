<script setup>
import { ref, onMounted } from "vue";
import { CODE_SRC } from "@/constants";
const formRef = ref(null);
const loginInfo = ref({ name: "", password: "", code: "" });
const codePath = ref("");

onMounted(() => {
  // 获取验证码
  codePath.value = CODE_SRC;
});

// 提交表单
const submitForm = async () => {
  const valid = await formRef.value.validate();
};
</script>
<template>
  <div class="login-form">
    <!-- <h3>地质安全及地质资源监测系统</h3> -->
    <el-form ref="formRef" :model="loginInfo" label-width="auto">
      <el-form-item
        prop="name"
        :rules="[
          { required: true, message: 'age is required' },
          { type: 'number', message: 'age must be a number' },
        ]"
      >
        <el-input v-model="loginInfo.name" placeholder="请输入用户名">
          <template #prefix>
            <Icon
              iconClass="icon-yonghuming"
              color="var(--login-icon-color)"
              size="18px"
            />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="password"
        :rules="[
          { required: true, message: 'age is required' },
          { type: 'number', message: 'age must be a number' },
        ]"
      >
        <el-input v-model="loginInfo.name" placeholder="请输入密码">
          <template #prefix>
            <Icon
              iconClass="icon-ai-password"
              color="var(--login-icon-color)"
            />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        class="login-form-code"
        prop="code"
        :rules="[
          { required: true, message: 'age is required' },
          { type: 'number', message: 'age must be a number' },
        ]"
      >
        <el-input v-model="loginInfo.name" placeholder="请输入验证码" />
        <img class="captcha-image" :src="codePath" />
      </el-form-item>
      <el-button class="btn-primary" @click="submitForm(formRef)"
        >登录</el-button
      >
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
.login-form {
  width: 32%;
  min-width: 300px;
  padding: 80px 24px;
  background: var(--background-color);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2), 0 6px 8px rgba(0, 0, 0, 0.15);
  :deep(.el-input) {
    height: 40px;

    .el-input__wrapper {
      border-radius: 0;
    }
  }

  .login-form-code {
    .captcha-image {
      margin-left: 6px;
    }
    :deep(.el-form-item__content) {
      flex-wrap: nowrap;
    }
  }
  .btn-primary {
    margin-top: 30px;
    width: 100%;
    color: var(--text-color);
    background: var(--btn-login-color);
  }
}
</style>
