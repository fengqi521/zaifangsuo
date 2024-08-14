div
<script setup>
import {
  computed,
  ref,
  reactive,
  nextTick,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import Bread from "@/components/Bread/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import Icon from "@/components/Icon.vue";

import { isEmpty } from "lodash";
import { useMessage } from "@/plugins/message";
import { useInputHook } from "@/hooks/useInput";
import { strToHex } from "@/utils";
import { operateLists } from "@/constants";
import rtuApi from "@/api/rtu";

const route = useRoute();
const { setInputValue, setInputMaxLen, setInputExactDivision } = useInputHook();
const { success, error } = useMessage();
const { name, id, type } = route.params;

// 导航
const breadList = ref([
  { to: "/device", title: "设备管理" },
  { title: "指令下发" },
]);

// 表单配置
const formConfig = {
  common: {
    address: {
      label: "遥测站地址:",
      width: "180px",
      labelWidth: "68",
      maxLen: 10,
      placeholder: "请输入遥测站地址",
      type: "el-input",
    },
    pass: {
      label: "密码:",
      width: "200px",
      maxLen: 4,
      labelWidth: "32",
      placeholder: "请输入密码",
      type: "el-input",
    },
    collect: {
      label: "采集周期:",
      labelWidth: "56",
      min: 1,
      max: 255,
      unit: "min",
      placeholder: "采集周期",
    },
    timer: {
      label: "定时报周期:",
      labelWidth: "68",
      min: 1,
      max: 1440,
      unit: "min",
      placeholder: "定时报周期",
    },
    timer_start: {
      label: "定时报开始时间:",
      labelWidth: "92",
      placeholder: "定时报开始时间",
      type: "el-time-picker",
    },
    check_time: {
      label: "自检上报参数:",
      labelWidth: "80",
      type: "el-time-select",
      placeholder: "开始时刻",
    },
    check_num: {
      label: "",
      type: "num",
      placeholder: "每天上报次数",
    },
  },
  type1: {
    addr: {
      label: "泥位计地址:",
      labelWidth: "74",
      minLen: 0,
      maxLen: 255,
    },
    high: {
      label: "安装高度:",
      labelWidth: "56",
      min: 0,
      max: 65.535,
      unit: "m",
    },
    origin: {
      label: "初始值:",
      labelWidth: "44",
      min: 0,
      max: 65.535,
      unit: "m",
    },
    threshold: {
      label: "加报阈值:",
      labelWidth: "56",
      min: 0.01,
      max: 65.535,
      unit: "m",
    },
  },
  type2: {
    addr: {
      label: "雨量地址:",
      labelWidth: "56",
      minLen: 0,
      maxLen: 255,
    },
    cycle: {
      label: "加报周期:",
      labelWidth: "56",
      min: 1,
      max: 255,
      unit: "min",
    },
    threshold: {
      label: "报警阈值:",
      labelWidth: "56",
      min: 1,
      max: 6553.5,
      decimals: 0,
      unit: "mm",
    },
    the_time: {
      label: "报警阈值时长:",
      labelWidth: "80",
      min: 1,
      max: 255,
      unit: "min",
    },
    sum: {
      label: "累计雨量:",
      labelWidth: "56",
      min: 0,
      max: 6553.5,
      decimals: 0,
      unit: "mm",
    },
  },
};

// 参数
const speForm = {
  type1: {
    addr: "", // 地址
    high: 0, // 安装高度
    origin: 0, // 初始值
    threshold: 1, // 加报阈值
  },
  type2: {
    addr: "", // 雨量地址
    cycle: 1, // 加报周期
    threshold: 1, // 报警阈值
    the_time: 1, // 报警阈值时长
    sum: 0, // 累计雨量
  },
};
const baseForm = {
  id,
  code: "",
  address: "",
  pass: "",
  collect: "",
  timer: "",
  timer_start: "",
  check_time: "",
  check_num: "",
};

const currentConfig = computed(() => {
  return {
    common: { ...formConfig.common },
    [`type${type}`]: { ...formConfig[`type${type}`] },
  };
});
const timerFields = ["version_length", "start", "end", "crc"];

const unfold = ref(true);
// 表单
const commonForm = reactive({ ...baseForm, data: {} });
// 下发及响应数据
const commandData = reactive([]);

watch(
  () => commonForm.code,
  (newVal) => {
    commonForm.data = {};
    if (newVal === 4) {
      commonForm.data = { dateTimeRange: [] };
    }

    if (newVal === 5) {
      commonForm.data = { ...speForm[`type${type}`] };
    }
  }
);

const handleCommonInput = (value, key, decimals, min, max) => {
  commonForm[key] = setInputValue(value, decimals, min, max);
};
const handleInput = (value, key, decimals, min, max) => {
  commonForm.data[key] = setInputValue(value, decimals, min, max);
};

// 限制输入 (上报次数限制)
const handleLimitInput = (value, key, length) => {
  commonForm[key] = setInputMaxLen(value, length);
};

// 能被24整除的数
const handleExactDivisionInput = (value, key) => {
  commonForm[key] = setInputExactDivision(value);
};

// 获取设备详情
const getDetail = () => {
  const res = {
    code: 0,
    data: {
      frame_start: "7E7E",
      address: "11009001",
      reserve: "00",
      pass: "2012",
      code: "",
      version_length: "",
      start: "02",
      end: "05",
      content: "",
      crc: "",
    },
  };

  if (!res.code) {
    Object.assign(commonForm, { ...res.data });
  }
};
getDetail();

// 功能码切换
const dynamicFields = computed(() => {
  const operate = commonForm.code;
  const showDateTimeRange = operate == "4";
  const showTypeData = [5].includes(operate);

  return {
    showDateTimeRange,
    showTypeData,
  };
});

const responseLoading = ref(false);
const controlFormRef = ref(null);
const controlListRef = ref(null);
const resizeObserver = ref(null);
const maxHeight = ref(0);
let timer = ref(null);

// 下发指令
const handleClickSubmit = () => {
  const {
    code,
    data,
    address,
    pass,
    collect,
    timer,
    timer_start,
    check_time,
    check_num,
  } = commonForm;

  let params = { id, code };

  params.Data = { ...params.data, address, pass };
  // if(address){
  //   // params.data.address = strToHex(address)
  // }
  // if(pass){
  //   // params.data.pass = strToHex(pass)
  // }
  if (collect) {
    params.Data.collect = strToHex(collect);
  }
  if (timer) {
    params.Data.timer = strToHex(timer);
  }
  if (timer_start) {
    params.Data.timer_start = strToHex(timer_start);
  }
  if (check_time && check_num) {
    params.Data.check = strToHex(`${check_time}:${check_num}`);
  }

  if (!isEmpty(data) && data.dateTimeRange) {
    params.Data = {
      ...params.data,
      start_time: data.dateTimeRange[0],
      end_time: data.dateTimeRange[1],
    };
  }

  rtuApi.downControl(params).then((res) => {
    if (!res.code) {
      clearInterval(timer.value);
      commandData.push({ ...res.data, type: "down" });
      responseLoading.value = true;
      setControlListScroll();
      realResponse({ id, code, deadline: res.data.deadline });
      return;
    }
    error(res.message);
  });
};

// 重置
const handleReset = () => {
  commonForm.code = "";
};

// 实时获取响应数据
const realResponse = async (params) => {
  const result = await rtuApi.getResponse(params);
  if (!result.code && result.data.item.length > 0) {
    clearInterval(timer.value);
    const lists = result.data.item.map((item) => ({
      type: "up",
      deadline: item.create_time,
      ...item,
    }));
    commandData.push(...lists);
    return;
  }
  timer.value = setTimeout(() => {
    realResponse(params);
  }, 5000);
};

// 取消响应数据获取
const handleClickCancelLoading = () => {
  responseLoading.value = false;
  clearInterval(timer.value);
};

// 设置滚动到底部
const setControlListScroll = () => {
  nextTick(() => {
    if (controlListRef.value) {
      const ele = controlListRef.value;
      const scrollHeight = ele.scrollHeight;
      controlListRef.value.scrollTo({
        top: scrollHeight,
      });
    }
  });
};

// 计算和设置内容区域的高度
const updateContentHeight = async () => {
  await nextTick();
  if (controlFormRef.value) {
    const ele = controlFormRef.value.$el;
    const headerHeight = ele.clientHeight;
    maxHeight.value = `${window.innerHeight - headerHeight - 286}px`;
  }
};

// 监听元素的尺寸变化
const observeElement = () => {
  if (controlFormRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      updateContentHeight();
    });
    resizeObserver.value.observe(controlFormRef.value.$el);
  }
};

onMounted(() => {
  updateContentHeight();
  observeElement();
});
// 在组件卸载前清除监听
onUnmounted(() => {
  if (resizeObserver.value && controlFormRef.value) {
    resizeObserver.value.unobserve(controlFormRef.value.$el);
    resizeObserver.value.disconnect();
  }
});
</script>
<template>
  <div>
    <!-- 导航 -->
    <Bread :breadList="breadList" />

    <!-- 设备名称 -->
    <p class="command-name">{{ name }}</p>

    <!-- 报文下发表单 -->
    <ElCard title="下发指令" class="form-card" ref="controlFormRef">
      <el-form :model="commonForm" label-width="auto" label-position="left">
        <div class="command-form__operate">
          <el-form-item label="功能码:" label-width="44">
            <el-select
              v-model="commonForm.code"
              placeholder="功能码"
              style="width: 250px"
            >
              <el-option
                v-for="(operate, index) in operateLists"
                :key="index"
                :label="operate.label"
                :value="operate.code"
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
          <!-- 公共部分表单 -->
          <el-form-item
            class="input-number__item"
            v-for="(
              {
                label,
                labelWidth,
                min,
                max,
                maxLen,
                unit,
                decimals,
                type,
                placeholder,
              },
              key,
              index
            ) in currentConfig.common"
            :key="index"
            :label="label"
            :label-width="labelWidth"
          >
            <el-input
              class="input-text"
              v-model="commonForm[key]"
              v-if="type === 'el-input'"
              @input="handleLimitInput($event, key, maxLen)"
              :placeholder="placeholder"
            >
            </el-input>

            <el-input
              v-else-if="type === 'num'"
              class="input-text"
              v-model="commonForm[key]"
              @input="handleExactDivisionInput($event, key)"
              :placeholder="placeholder"
            ></el-input>

            <el-time-picker
              v-else-if="type === 'el-time-picker'"
              v-model="commonForm[key]"
              format="HH:mm"
              value-format="HH:mm"
              :placeholder="placeholder"
              width="156px"
            />
            <el-time-select
              v-else-if="type === 'el-time-select'"
              v-model="commonForm[key]"
              start="00:00"
              step="1:00"
              end="23:00"
              format="HH"
              style="width: 128px"
              :placeholder="placeholder"
            />
            <el-input
              v-else
              :model-value="commonForm[key]"
              @input="handleCommonInput($event, key, decimals || 0, min, max)"
              :placeholder="placeholder"
            />
            <div class="input-item__unit" v-if="unit">{{ unit }}</div>
          </el-form-item>

          <el-form-item
            label="时间段:"
            label-width="44"
            v-if="
              dynamicFields.showDateTimeRange && commonForm.data.dateTimeRange
            "
          >
            <el-date-picker
              v-model="commonForm.data.dateTimeRange"
              type="datetimerange"
              range-separator="至"
              style="width: 355px"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>

          <!-- 按类型显示表单 -->
          <el-form-item
            class="input-number__item"
            v-for="(
              { label, labelWidth, decimals, min, max, unit, minLen, maxLen },
              key,
              index
            ) in currentConfig[`type${type}`]"
            :key="index"
            :label="label"
            :label-width="labelWidth"
            v-if="
              !dynamicFields.showDateTimeRange && dynamicFields.showTypeData
            "
          >
            <el-input
              class="input-text"
              v-if="maxLen"
              v-model="commonForm.data[key]"
              :maxlength="maxLen"
              :minLength="minLen"
            />
            <el-input
              v-else
              :model-value="commonForm.data[key]"
              @input="handleInput($event, key, decimals || 0, min, max)"
            />
            <div class="input-item__unit" v-if="unit">{{ unit }}</div>
          </el-form-item>
        </div>

        <el-form-item label="" class="command-form__btn">
          <el-button
            type="primary"
            :disabled="!commonForm.code || responseLoading"
            @click="handleClickSubmit"
            >下发指令</el-button
          >
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </ElCard>

    <!-- 下发及反馈内容 -->
    <ElCard title="下发内容及反馈内容" class="control-card">
      <el-empty v-if="!commandData.length" :image-size="80" />
      <ul
        v-else
        class="control-list"
        :style="{ maxHeight: maxHeight }"
        ref="controlListRef"
      >
        <li
          :class="`control-item control-${list.type}`"
          v-for="(list, index) in commandData"
          :key="index"
        >
          <div class="content-left">
            <p class="item-time">{{ list.deadline }}</p>
            <div class="item-content">{{ list.content }}</div>
          </div>
          <span class="item-logo">{{
            list.type === "down" ? "下发" : "反馈"
          }}</span>
        </li>
        <li class="control-message" v-if="responseLoading">
          等待反馈数据，您可点击关闭按钮停止等待继续进行指令下发
          <Icon
            iconClass="close-icon icon-guanbi"
            size="8px"
            @click="handleClickCancelLoading"
          />
        </li>
      </ul>
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
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
      width: 96px;
    }

    .input-text {
      width: 150px;
    }

    .input-item__unit {
      padding-inline: 8px;
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

.control-card {
  margin-top: 24px;
  color: var(--command-message-color);

  .control-list {
    position: relative;
    overflow-y: auto;
    @extend %scrollbar;
  }

  .control-item {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    &:last-child {
      margin: 0;
    }
    .item-time {
      line-height: 20px;
      color: var(--command-time-color);
    }

    .item-content {
      max-width: 368px;
      line-height: 20px;
      padding: 12px;
      word-break: break-all;
      background: var(--command-message-req-bg);
      border-radius: 3px;
    }

    .item-logo {
      font-size: 12px;
      font-weight: bold;
      border: 1px solid #000;
      border-radius: 40px;
      width: 40px;
      height: 40px;
      color: var(--text-normal-color);
      text-align: center;
      line-height: 40px;
    }
  }

  .control-down {
    justify-content: end;

    .item-time {
      text-align: right;
    }
    .item-content {
      background: var(--command-message-res-bg);
    }

    .item-logo {
      margin-left: 8px;
    }
  }

  .control-up {
    flex-direction: row-reverse;
    justify-content: flex-end;

    .item-logo {
      margin-right: 8px;
    }
  }

  .control-message {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 12px;
    line-height: 16px;
    font-size: 14px;
    border-radius: 4px;
    background: var(--command-message-bg);
    animation: flicker 1s infinite;

    .close-icon {
      margin-left: 4px;
      vertical-align: middle;
      cursor: pointer;
    }
  }

  @keyframes flicker {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
