<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { usePermissionStore } from "@/stores/modules/permission";
import formValidators from "@/utils/formValidators";
import { CODE_SRC } from "@/constants";

const router = useRouter();
const { setPermissionRoutes } = usePermissionStore();

// 定义变量
const formRef = ref(null);
const loginInfo = reactive({ username: "", password: "", code: "" });
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
    {
      validator: formValidators.validatePassword,
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "请输入验证码",
    },
  ],
});

// 初始化
onMounted(() => {
  getCode();
});

// 获取验证码
const getCode = () => {
  codeImg.value = CODE_SRC;
};

// 提交表单
const submitForm = async (formName) => {
  const valid = await formRef.value.validate();
  if (valid) {
    setPermissionRoutes();
    router.push("/");
    return;
  }
};
</script>
<template>
  <div class="login-form">
    <!-- <h3>地质安全及地质资源监测系统</h3> -->
    <el-form
      ref="formRef"
      :model="loginInfo"
      :rules="loginInfoRules"
      label-width="auto"
    >
      <el-form-item prop="username">
        <el-input v-model="loginInfo.username" placeholder="请输入用户名">
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
          placeholder="请输入密码"
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
      <el-form-item class="login-form-code" prop="code">
        <el-input v-model="loginInfo.code" placeholder="请输入验证码" />
        <img class="captcha-image" :src="codeImg" @click="getCode" />
      </el-form-item>
      <el-button class="btn-primary" @click="submitForm()">登录</el-button>
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
      cursor: pointer;
    }
    :deep(.el-form-item__content) {
      flex-wrap: nowrap;
    }
  }
  .btn-primary {
    margin-top: 30px;
    width: 100%;
    color: var(--text-color);
    background: var(--btn-bg-color);
  }
}
</style>
