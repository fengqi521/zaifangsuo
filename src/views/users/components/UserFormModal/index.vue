<script setup>
import { ref, reactive, watch } from "vue";
import ElModal from "@/components/ElModal/index.vue";
import userApi from "@/api/account";
import { isEmpty } from "lodash";
import { useMessage } from "@/plugins/message";
import formValidators from "@/utils/formValidators";
const { success, error } = useMessage();

const roles = [
  { label: "超级管理员", value: 1 },
  { label: "审计管理员", value: 2 },
  { label: "安全管理员", value: 3 },
  { label: "普通账户", value: 4 },
  { label: "只读账户", value: 5 },
];
const initialData = {
  user_name: "",
  email: "",
  phone: "",
  role: "",
  password: "",
  did: "",
};

const userFormRef = ref(null);
let userForm = reactive({ ...initialData });
const userFormRules = reactive({
  user_name: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
    { min: 2, max: 64, message: "长度在2-64个字符", trigger: "blur" },
  ],
  role: [
    {
      required: true,
      message: "请选择用户权限",
      trigger: "blur",
    },
  ],
  // email: [
  //   {
  //     required: true,
  //     message: "请输入邮箱",
  //   },
  // ],
  phone: [
    {
      required: false,
    },
    {
      validator: formValidators.validatePhoneNumber,
      trigger: "blur",
    },
  ],
  password: [
    {
      required: false,
      message: "请输入密码",
      trigger: "blur",
    },
    // {
    //   validator: formValidators.validatePassword,
    //   trigger: "blur",
    // },
  ],

  did: [
    {
      required: true,
      message: "请选择授权设备",
      trigger: "blur",
    },
  ],
});

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  deviceOptions: {
    type: Array,
    default: () => [],
  },
  dialogVisible: {
    type: Boolean,
  },
  currentRow: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(["handle-close", "get-list"]);
watch(
  () => props.currentRow,
  (newVal) => {
    if (isEmpty(newVal)) {
      userForm = reactive({ ...initialData });
      userFormRules.password[0].required = true;
    } else {
      const { id, devices, create_time, ...others } = newVal;
      if (id) userFormRules.password[0].required = false;
      Object.assign(userForm, {
        ...others,
        uid: id,
        did: devices.map((item) => item.id),
      });
    }
  },
  { deep: true }
);

// 关闭弹窗
const handleClose = (status) => {
  emit("handle-close", status);
  userForm = reactive({ ...initialData });
  userFormRef.value.resetFields();
};

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await userFormRef.value.validate();
    if (valid) {
      const userFormParams = {
        ...userForm,
        did: userForm.did.join(","),
      };
      if (userForm?.uid) {
        // 修改
        userApi.updateUser(userFormParams).then((res) => {
          if (!res.code) {
            success("修改成功");
            handleClose(false);
            emit("get-list");
            return;
          }

          error(res.message);
        });
      } else {
        // 新增
        userApi.createUser(userFormParams).then((res) => {
          if (!res.code) {
            success("创建成功");
            handleClose(false);
            emit("get-list");
            return;
          }
          error(res.message);
        });
      }
    }
  } catch (error) {}
};
</script>

<template>
  <ElModal
    :title="props.title"
    :dialogVisible="props.dialogVisible"
    width="540px"
    @handle-close="handleClose"
  >
    <template v-slot>
      <el-form
        class="user-form-container"
        :model="userForm"
        ref="userFormRef"
        :rules="userFormRules"
        :validate-on-rule-change="false"
      >
        <el-form-item label="用户名" prop="user_name">
          <el-input
            v-model="userForm.user_name"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="userForm.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>

        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="userForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户权限" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择用户权限">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备授权" prop="did">
          <el-select-v2
            v-model="userForm.did"
            filterable
            :options="props.deviceOptions"
            placeholder="请选择授权设备"
            multiple
          />
        </el-form-item>
      </el-form>
    </template>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="handleClose(false)">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </template>
  </ElModal>
</template>
<style lang="scss" scoped>
.el-form {
  .el-form-item {
    margin-bottom: 24px;
    font-size: 12px;

    &:last-child {
      margin: 0;
    }
  }
  :deep(.el-form-item__label) {
    min-width: 78px;
  }

  .el-select-v2 {
    width: 350px;
  }
}
</style>
