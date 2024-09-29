<script setup>
import { ref, reactive } from "vue";
import ElModal from "@/components/ElModal/index.vue";
import Icon from "@/components/Icon.vue";
import Amap from "@/components/Amap/index.vue";
import { useMessage } from "@/plugins/message";
import { useInputHook } from "@/hooks/useInput";
import systemApi from "@/api";
const { success, error } = useMessage();
const { setInputMaxLen } = useInputHook();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  //   deviceOptions: {
  //     type: Array,
  //     default: () => [],
  //   },
  dialogVisible: {
    type: Boolean,
  },
  //   currentRow: {
  //     type: Object,
  //     default: () => ({}),
  //   },
});
const emit = defineEmits(["handle-close", "get-list"]);

const show = ref(false);
const types = [
  { label: "泥位计", value: 1 },
  { label: "雨量计", value: 2 },
  { label: "断线传感器", value: 3 },
];
const initialData = {
  deviceName: "",
  deviceNumber: "",
  deviceType: "",
  addr: "",
  pass: "",
  location: "",
  longitude: "",
  latitude: "",
  zone: "",
};

const deviceFormRef = ref(null);
let deviceForm = reactive({ ...initialData });
const userFormRules = reactive({
  deviceName: [
    {
      required: true,
      message: "请输入设备名称",
      trigger: "blur",
    },
    { min: 2, max: 24, message: "长度在2-24个字符", trigger: "blur" },
  ],
  deviceNumber: [
    {
      required: true,
      message: "请输入设备编号",
      trigger: "blur",
    },
    { min: 2, max: 24, message: "长度在2-24个字符", trigger: "blur" },
  ],
  deviceType: [
    {
      required: true,
      message: "请选择设备类型",
    },
  ],
  addr: [
    {
      required: true,
      message: "请输入遥测站地址",
    },
    {
      min: 10,
      max: 10,
      message: "必须10个字符",
      trigger: "blur",
    },
  ],
  pass: [
    {
      required: true,
      message: "请输入设备密码",
      trigger: "blur",
    },
    {
      min: 4,
      max: 4,
      message: "必须4个字符",
      trigger: "blur",
    },
  ],
  location: [
    {
      required: true,
      message: "请选择位置",
      trigger: "blur",
    },
    // {
    //   validator: formValidators.validatePassword,
    //   trigger: "blur",
    // },
  ],
});

const handleUpdate = (newData) => {
  Object.assign(deviceForm, newData);
};

// 输入限制
const handleLimitInput = (value, key, length) => {
  deviceForm[key] = setInputMaxLen(value, length);
};

// 关闭弹窗
const handleClose = (status) => {
  emit("handle-close", status);
  setTimeout(() => {
    deviceForm = reactive({ ...initialData });
    deviceFormRef.value.resetFields();
  }, 0);
};

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await deviceFormRef.value.validate();
    if (valid) {
      systemApi.addDevice(deviceForm).then((res) => {
        if (!res.code) {
          success("创建成功");
          handleClose(false);
          emit("get-list");
          return;
        }
        error(res.message);
      });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <ElModal
    :title="props.title"
    :dialogVisible="props.dialogVisible"
    width="500"
    @handle-close="handleClose"
  >
    <template v-slot>
      <el-form
        class="user-form-container"
        :model="deviceForm"
        ref="deviceFormRef"
        :rules="userFormRules"
        :validate-on-rule-change="false"
        require-asterisk-position="right"
        labelPosition="top"
      >
        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="deviceForm.deviceName"
            placeholder="请输入设备名称"
            minlength="2"
            maxlength="24"
          ></el-input>
        </el-form-item>

        <el-form-item label="设备编号" prop="deviceNumber">
          <el-input
            v-model="deviceForm.deviceNumber"
            placeholder="请输入设备编号"
            minlength="2"
            maxlength="24"
          ></el-input>
        </el-form-item>

        <el-form-item label="遥测站地址" prop="addr">
          <el-input
            v-model="deviceForm.addr"
            placeholder="请输入遥测站地址"
            @input="handleLimitInput($event, 'addr', 10)"
          ></el-input>
        </el-form-item>

        <el-form-item label="设备密码" prop="pass">
          <el-input
            v-model="deviceForm.pass"
            placeholder="请输入设备密码"
            @input="handleLimitInput($event, 'pass', 4)"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select
            v-model="deviceForm.deviceType"
            placeholder="请选择设备类型"
          >
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="location-item" label="设备位置" prop="location">
          <el-input
            class="location-input"
            v-model="deviceForm.location"
            placeholder="请选择设备位置"
            disabled
          ></el-input>
          <div
            class="location-icon"
            @mouseover="show = true"
            @mouseout="show = false"
          >
            <Icon iconClass="iconfont icon-ditu"></Icon>
            <Amap
              v-show="show"
              class="map-inner"
              @update:modelValue="handleUpdate"
            />
          </div>
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
    margin-bottom: 16px;
    font-size: 12px;

    &:last-child {
      margin: 0;
    }
  }

  .el-select-v2 {
    width: 350px;
  }

  .location-item {
    .location-input {
      flex: 1;
    }
  }

  .location-icon {
    position: relative;
    cursor: pointer;
    .iconfont {
      color: var(--btn-bg-color) !important;
    }
    .map-inner {
      position: absolute;
      padding: 16px;
      width: 800px;
      height: 600px;
      left: 50%;
      right: 50%;
      transform: translate(-75%);
      bottom: 32px;
      background: var(--body-bg-color);
      z-index: 4;
    }
  }
}
</style>
