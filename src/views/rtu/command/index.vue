div
<script setup>
import { computed, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import Bread from "@/components/Bread/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import Icon from "@/components/Icon.vue";
import { operateLists } from "@/constants";

const route = useRoute();
const { id, type } = route.params;

// 导航
const breadList = ref([
  { to: "/rtu", title: "设备管理" },
  { title: "指令下发" },
]);
const speForm = {
  type1: {
    high: 0,
    init: 0,
    report: 0.001,
  },
  type2: {
    cycle: 1,
    alarm: 1,
    duration: 1,
  },
};
const baseForm = {
  id,
  frame_start: "",
  address: "",
  reserve: "",
  password: "",
  operate: "",
  version_length: "",
  start: "",
  end: "",
  crc: "",
};

// 表单配置
const formConfig = {
  common: {
    frame_start: {
      label: "帧起始符:",
      width: "120px",
      labelWidth: "56",
      disabled: true,
    },
    address: {
      label: "遥测站地址:",
      width: "180px",
      labelWidth: "68",
      disabled: true,
    },
    reserve: {
      label: "预留位:",
      width: "120px",
      labelWidth: "44",
      disabled: true,
    },
    password: {
      label: "密码:",
      width: "200px",
      labelWidth: "32",
      disabled: true,
    },
    version_length: {
      label: "版本号及长度:",
      width: "120px",
      labelWidth: "80",
      disabled: true,
    },
    start: {
      label: "报文起始符:",
      width: "120px",
      labelWidth: "68",
      disabled: true,
    },
    end: {
      label: "报文结束符:",
      width: "120px",
      labelWidth: "68",
      disabled: true,
    },
    crc: { label: "校验码:", width: "200px", labelWidth: "44", disabled: true },
  },
  type1: {
    high: { label: "安装高度:", labelWidth: "56",min: 0, max: 65.535, unit: "m" },
    init: { label: "初始值:",labelWidth: "44", min: 0, max: 65.535, unit: "m" },
    report: { label: "加报阈值:",labelWidth: "56", min: 0.001, max: 65.535, unit: "m" },
  },
  type2: {
    cycle: { label: "加报周期:",labelWidth: "56", min: 1, max: 255, unit: "min" },
    alarm: { label: "报警阈值:",labelWidth: "56", min: 1, max: 6553.5, unit: "mm" },
    duration: { label: "报警阈值时长:",labelWidth: "80", min: 1, max: 255, unit: "min" },
  },
};

const currentConfig = computed(() => {
  return {
    common: { ...formConfig.common },
    [`type${type}`]: { ...formConfig[`type${type}`] },
  };
});
const timerFields = ["version_length", "start", "end", "crc"];
const commandFormRef = ref(null);
const loading = ref(false);

const deviceName = ref("");
const unfold = ref(true);
const dateTimeRange = ref([]);

const content = reactive({
  command: "",
  back: {},
});
// 表单
const commonForm = ref({ ...baseForm, ...speForm[`type${type}`] });

// 获取设备详情
const getDetail = () => {
  const res = {
    code: 0,
    data: {
      name: "lcjdevice003",
      frame_start: "7E7E",
      address: "11009001",
      reserve: "00",
      password: "10101",
      operate: "",
      version_length: "1002",
      start: "31",
      end: "110111",
      content: "32",
      crc: "ca27",
    },
  };

  if (!res.code) {
    const { name, ...others } = res.data;
    deviceName.value = name;
    commonForm.value = { ...commonForm.value, ...others };
  }
};
getDetail();

// 功能码
const dynamicFields = computed(() => {
  const operate = commonForm.value.operate;
  const showDateTimeRange = operate === "38";
  const showTypeData = ["32", "33"].includes(operate);

  return {
    showDateTimeRange,
    showTypeData,
  };
});

// 下发指令
const handleClickSubmit = async () => {
  loading.value = true;
  const valid = await commandFormRef.value.validate();
  if (valid) {
    content.command = JSON.stringify(commonForm.value);
  }
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>
<template>
  <div>
    <!-- 导航 -->
    <Bread :breadList="breadList" />

    <!-- 设备名称 -->
    <p class="command-name">{{ deviceName }}</p>

    <!-- 报文下发表单 -->
    <ElCard title="下发指令" class="form-card">
      <el-form
        :model="commonForm"
        label-width="auto"
        label-position="left"
        ref="commandFormRef"
      >
        <div class="command-form__operate">
          <el-form-item label="功能码:" label-width="44">
            <el-select
              v-model="commonForm.operate"
              placeholder="功能码"
              style="width: 250px"
            >
              <el-option
                v-for="(operate, index) in operateLists"
                :key="index"
                :label="operate.label"
                :value="operate.type"
              />
            </el-select>
          </el-form-item>
          <div class="command-form__toggle" @click="unfold = !unfold">
            <Icon iconClass="icon-shaixuan toggle-icon" />
            <span class="command-form__toggle-label">{{
              unfold ? "收起" : "展开"
            }}</span>
          </div>
        </div>

        <div v-if="unfold" class="command-form__details">
          <el-form-item
            v-for="(
              { label, width, labelWidth, disabled }, key, index
            ) in currentConfig.common"
            :key="index"
            :label="label"
            :label-width="labelWidth"
            v-show="
              !(timerFields.includes(key) && dynamicFields.showDateTimeRange)
            "
          >
            <el-input
              v-model="commonForm[key]"
              :style="{ width }"
              :disabled="disabled"
            />
          </el-form-item>

          <el-form-item
            label="时间段:"
            label-width="44"
            v-if="dynamicFields.showDateTimeRange"
          >
            <el-date-picker
              v-model="dateTimeRange"
              type="datetimerange"
              range-separator="至"
              style="width: 355px"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>

          <el-form-item
            class="input-number__item"
            v-for="({ label, labelWidth,min, max, unit }, key, index) in currentConfig[
              `type${type}`
            ]"
            :key="index"
            :label="label"
            :label-width="labelWidth"
            v-if="
              !dynamicFields.showDateTimeRange && dynamicFields.showTypeData
            "
          >
            <el-input
              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
              v-model="commonForm[key]"
            />
            <div class="input-item__unit">{{ unit }}</div>
          </el-form-item>
        </div>

        <el-form-item label="" class="command-form__btn">
          <el-button
            type="primary"
            :disabled="!commonForm.operate"
            @click="handleClickSubmit"
            >下发指令</el-button
          >
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </ElCard>

    <!-- 下发内容和反馈内容 -->
    <ElCard title="下发内容" class="feedback-card">
      <el-empty v-if="!content.command.length" :image-size="80" />
      <p v-else class="feedback-card__command">{{ content.command }}</p>
    </ElCard>

    <!-- 反馈内容 -->
    <ElCard title="反馈内容" class="feedback-card" v-loading="loading">
      <el-empty v-if="!Object.keys(content.back).length" :image-size="80" />
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.command-name {
  padding-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #666;
  line-height: 20px;
}
.form-card {
  .command-form__operate {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .command-form__toggle {
      line-height: 30px;
      margin-bottom: 18px;
      color: var(--btn-bg-color);
      cursor: pointer;
      user-select: none;
    }
    .toggle-icon {
      vertical-align: middle;
      color: var(--btn-bg-color) !important;
    }
    .command-form__toggle-label {
      margin-left: 8px;
    }
  }

  .command-form__details {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      margin-right: 16px;
    }
  }

  .command-form__btn {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    padding-right: 4px;
  }

  .input-number__item {
    .el-input {
      width: 100px;
    }
    
    .input-item__unit {
      padding-inline:8px;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: #333;
      text-align: center;
      background: #fff;
      border-radius: 0 3px 3px 0;
      border: 1px solid var(--select-border-color);
      border-left: none;
    }
  }
}

.feedback-card {
  margin-top: 24px;

  &__command {
    padding: 16px;
    line-height: 24px;
    color: var(--normal-title-color);
    background: var(--card-detail-bg-color);
    word-break: break-all;
  }
}
</style>
