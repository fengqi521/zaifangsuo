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
import Icon from "@/components/Icon.vue";

import { isEmpty } from "lodash";
import { useMessage } from "@/plugins/message";
import { useInputHook } from "@/hooks/useInput";
import { strToHex, hexToDecimal } from "@/utils";
import { operateLists } from "@/constants";
import systemApi from "@/api";

const {
  params: { id, type },
} = useRoute();
const { setInputValue, setInputMaxLen, setInputExactDivision } = useInputHook();
const { error } = useMessage();

// 参数
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
const otherForm = reactive({
  type1: {
    5: {
      addr: "", // 地址
      high: 0, // 安装高度
      origin: 0, // 初始值
      threshold: 1, // 加报阈值
    },
    7: {
      lock: "", // 遥测站时钟
    },
  },
  type2: {
    5: {
      addr: "", // 雨量计地址
      cycle: 1, // 加报周期
      threshold: 1, // 报警阈值
      the_time: 1, // 报警阈值时长
      sum: 0, // 累计雨量
    },
    7: {
      lock: "", // 遥测站时钟
    },
  },
  type3: {
    5: {
      addr: "", // 断线报警器地址
    },
    7: {
      lock: "", // 遥测站时钟
    },
  },
});

const baseRules = {
  address: [
    {
      required: true,
      message: "遥测站地址必填",
      trigger: "blur",
    },
    { min: 10, message: "长度10个字符", trigger: "blur" },
  ],
  pass: [
    {
      required: true,
      message: "密码必填",
      trigger: "blur",
    },
    { min: 4, message: "长度4个字符", trigger: "blur" },
  ],
  collect: [
    {
      required: true,
      message: "采集周期必填",
      trigger: "blur",
    },
  ],
  timer: [
    {
      required: true,
      message: "定时报周期必填",
      trigger: "blur",
    },
  ],
  timer_start: [
    {
      required: true,
      message: "定时报开始时间必选",
      trigger: "change",
    },
  ],
  check_time: [
    {
      required: true,
      message: "开始时间必选",
      trigger: "change",
    },
  ],
  check_num: [
    {
      required: true,
      message: "每天上报次数必填",
      trigger: "blur",
    },
  ]
};
const otherRules = {
  type1: {
    4: {
      dateTimeRange: [
        {
          required: true,
          message: "时间段必选",
          trigger: "change",
        },
      ],
    },
    5: {
      addr: [
        {
          required: true,
          message: "泥位计地址必填",
          trigger: "blur",
        },
      ],
      high: [
        {
          required: true,
          message: "安装高度必填",
          trigger: "blur",
        },
      ],
      origin: [
        {
          required: true,
          message: "初始值必填",
          trigger: "blur",
        },
      ],
      threshold: [
        {
          required: true,
          message: "加报阈值必填",
          trigger: "blur",
        },
      ],
    },
    7: {
      lock: [
        {
          required: true,
          message: "遥测站时钟必选",
          trigger: "change",
        },
      ],
    },
  },
  type2: {
    4: {
      dateTimeRange: [
        {
          required: true,
          message: "时间段必选",
          trigger: "change",
        },
      ],
    },
    5: {
      addr: [
        {
          required: true,
          message: "雨量计地址必填",
          trigger: "blur",
        },
      ],
      cycle: [
        {
          required: true,
          message: "加报周期必填",
          trigger: "blur",
        },
      ], // 加报周期
      threshold: [
        {
          required: true,
          message: "报警阈值必填",
          trigger: "blur",
        },
      ], // 报警阈值
      the_time: [
        {
          required: true,
          message: "报警阈值时长必填",
          trigger: "blur",
        },
      ], // 报警阈值时长
      sum: [
        {
          required: true,
          message: "累计雨量必填",
          trigger: "blur",
        },
      ], // 累计雨量
    },
    7: {
      lock: [
        {
          required: true,
          message: "遥测站时钟必选",
          trigger: "change",
        },
      ], // 遥测站时钟
    },
  },
  type3: {
    4: {
      dateTimeRange: [
        {
          required: true,
          message: "时间段必选",
          trigger: "change",
        },
      ],
    },
    5: {
      addr: [
        {
          required: true,
          message: "断线报警器地址必填",
          trigger: "blur",
        },
      ], // 断线报警器地址
    },
    7: {
      lock: [
        {
          required: true,
          message: "遥测站时钟必选",
          trigger: "change",
        },
      ], // 遥测站时钟
    },
  },
};

// 校验
const formRules = computed(() => {
  const bases = commandForm.code == "5" ? baseRules : {};
  const others = otherRules[`type${type}`][commandForm.code];
  return { ...bases, data: { ...others } };
});

// 表单
const commandForm = reactive({ ...baseForm, data: {} });

// 下发及响应数据
const commandData = reactive([]);

// 获取设备配置
const getDeviceConfig = () => {
  return new Promise((resolve, reject) => {
    systemApi.getDeviceConfig({ id }).then((res) => {
      try {
        if (!res.code) {
          const info = res.data.info;
          let {
            address,
            rtu_pass,
            collect_cycle,
            timer_cycle,
            timer_start,
            self_check,
            element_item,
          } = info;
          const timer_start_hh = hexToDecimal(timer_start.slice(0, 2));
          const timer_start_mm = hexToDecimal(timer_start.slice(2));
          const check_time = hexToDecimal(self_check.slice(0, 2));
          const check_num = hexToDecimal(self_check.slice(2));
          timer_start = `${timer_start_hh}:${timer_start_mm}`;
          Object.assign(commandForm, {
            address: address,
            pass: rtu_pass,
            collect: hexToDecimal(collect_cycle),
            timer: hexToDecimal(timer_cycle),
            timer_start,
            check_time,
            check_num,
          });
          Object.keys(element_item).forEach((attr) => {
            const speFormItem = otherForm[`type${type}`][commandForm.code];
            const itemArr = Object.keys(speFormItem);
            if (itemArr.includes(attr)) {
              const value = element_item[attr];
              speFormItem[attr] = hexToDecimal(value);
            }
          });
          resolve(otherForm[`type${type}`][commandForm.code]);
        } else {
          reject(new Error("Request failed with code: " + res.code));
        }
      } catch (error) {
        reject(error);
        console.error("Error fetching device config:", error);
        throw error;
      }
    });
  });
};

const updateCommandFormData = async (newVal) => {
  commandForm.data = {};

  if (newVal === 4) {
    commandForm.data = { dateTimeRange: [] };
  }

  if (newVal === 5) {
    try {
      await getDeviceConfig();
      commandForm.data = { ...otherForm[`type${type}`][commandForm.code] };
    } catch (error) {
      console.error("Error fetching device config:", error);
    }
  }

  if (newVal === 7) {
    commandForm.data = { ...otherForm[`type${type}`][commandForm.code] };
  }
  controlFormRef.value && controlFormRef.value.clearValidate();
};

watch(
  () => commandForm.code,
  (newVal) => updateCommandFormData(newVal)
);

const handleCommonInput = (value, key, decimals, min, max) => {
  commandForm[key] = setInputValue(value, decimals, min, max);
};
const handleInput = (value, key, decimals, min, max) => {
  commandForm.data[key] = setInputValue(value, decimals, min, max);
};

// 限制输入 (上报次数限制)
const handleLimitInput = (value, key, length) => {
  commandForm[key] = setInputMaxLen(value, length);
};

// 能被24整除的数
const handleExactDivisionInput = (value, key) => {
  commandForm[key] = setInputExactDivision(value);
};

// 功能码切换
const dynamicFields = computed(() => {
  const operate = commandForm.code;
  const showDateTimeRange = operate == "4";
  const showTypeData = operate == "5";
  const showClock = operate == "7";
  return {
    showDateTimeRange,
    showTypeData,
    showClock,
  };
});

const responseLoading = ref(false);
const controlFormRef = ref(null);
const controlListRef = ref(null);
const resizeObserver = ref(null);
let commandIntervalId = ref(null);

// 下发指令
const handleClickSubmit = async () => {
  try {
    const valid = await controlFormRef.value.validate();
    if (!valid) return;
    if (commandIntervalId) {
      clearInterval(commandIntervalId);
    }
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
    } = commandForm;
    let params = { id, code, Data: { ...data } };
    if (code === 5) {
      if (address) {
        params.Data.address = address;
      }
      if (pass) {
        params.Data.pass = pass;
      }
      if (collect) {
        params.Data.collect = strToHex(collect);
      }
      if (timer) {
        params.Data.timer = strToHex(timer, 4);
      }
      if (timer_start) {
        params.Data.timer_start = strToHex(timer_start);
      }
      if (check_time && check_num) {
        params.Data.check = strToHex(`${check_time}:${check_num}`);
      }
    }

    if (!isEmpty(data) && data.dateTimeRange) {
      params.Data = {
        ...params.Data,
        start_time: data.dateTimeRange[0],
        end_time: data.dateTimeRange[1],
      };
    }
    responseLoading.value = true;
    systemApi.downControl(params).then((res) => {
      if (!res.code) {
        commandData.push({ ...res.data, type: "down" });
        setControlListScroll();
        realResponse({ id, code, deadline: res.data.deadline });
        return;
      }
      error(res.message);
      responseLoading.value = false
    });
  } catch (error) {
    console.log(error);
  }
};

// 实时获取响应数据
const realResponse = async (params) => {
  const result = await systemApi.getResponse(params);
  const { code } = commandForm;
  if (!result.code && result.data.item.length > 0) {
    let lists = result.data.item.map((item) => ({
      type: "up",
      deadline: item.create_time,
      ...item,
    }));
    const notConnectedItem = lists.find(
      (item) => item.content === "Not connect"
    );
    if (notConnectedItem) {
      lists = [{ ...notConnectedItem, content: "服务未连接" }];
    }
    commandData.push(...lists);
    setControlListScroll();
    if (code === 3 || code === 4) {
      if (notConnectedItem) {
        clearInterval(commandIntervalId);
        responseLoading.value = false;
        return;
      }
      const length = result.data.item.length;
      params.deadline = result.data.item[length - 1].create_time;
    } else {
      clearInterval(commandIntervalId);
      responseLoading.value = false;
      return;
    }
  }
  commandIntervalId = setTimeout(() => realResponse(params), 5000);
};

// 取消响应数据获取
const handleClickCancelLoading = () => {
  responseLoading.value = false;
  clearInterval(commandIntervalId);
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

// 在组件卸载前清除监听
onUnmounted(() => {
  if (commandIntervalId) {
    clearInterval(commandIntervalId);
  }
  if (resizeObserver.value && controlFormRef.value) {
    resizeObserver.value.unobserve(controlFormRef.value.$el);
    resizeObserver.value.disconnect();
  }
});
</script>
<template>
  <div class="func-command">
    <!-- 报文下发表单 -->
    <el-form
      class="func-command__form"
      :model="commandForm"
      ref="controlFormRef"
      :rules="formRules"
      label-width="auto"
    >
      <!-- 功能码 -->
      <el-form-item label="功能码" class="command-form__operate">
        <el-select
          v-model="commandForm.code"
          placeholder="功能码"
          style="width: 100%"
        >
          <el-option
            v-for="(operate, index) in operateLists"
            :key="index"
            :label="operate.label"
            :value="operate.code"
          />
        </el-select>
      </el-form-item>

      <div class="command-form__details" v-if="dynamicFields.showTypeData">
        <!-- 公共部分表单 -->
        <el-form-item label="遥测站地址" prop="address">
          <el-input
            v-model="commandForm.address"
            placeholder="遥测站地址"
            @input="handleLimitInput($event, 'address', 10)"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            v-model="commandForm.pass"
            placeholder="密码"
            @input="handleLimitInput($event, 'pass', 4)"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="采集周期"
          class="func-command__group"
          prop="collect"
        >
          <el-input
            :model-value="commandForm.collect"
            @input="handleCommonInput($event, 'collect', 0, 1, 255)"
            placeholder="采集周期"
          />
          <div class="func-command__unit">min</div>
        </el-form-item>

        <el-form-item
          label="定时报周期"
          class="func-command__group"
          prop="timer"
        >
          <el-input
            :model-value="commandForm.timer"
            @input="handleCommonInput($event, 'timer', 0, 1, 1440)"
            placeholder="定时报周期"
          />
          <div class="func-command__unit">min</div>
        </el-form-item>
        <el-form-item label="定时报开始时间" prop="timer_start">
          <el-time-picker
            v-model="commandForm.timer_start"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="定时报开始时间"
          />
        </el-form-item>

        <template class="func-command__check">
          <el-form-item
            label="自检上报参数"
            class="func-command__check-item"
            prop="check_time"
          >
            <el-time-select
              v-model="commandForm.check_time"
              style="width: 100%"
              start="00:00"
              step="1:00"
              end="23:00"
              format="HH"
              placeholder="开始时刻"
            />
          </el-form-item>
          <el-form-item
            style="width: 115px; margin-left: 10px"
            prop="check_num"
          >
            <el-input
              :model-value="commandForm.check_num"
              @input="handleExactDivisionInput($event, 'check_num')"
              placeholder="每天上报次数"
            />
          </el-form-item>
        </template>
        <!-- 泥位计 -->
        <template class="func-command__rain" v-if="type == 1">
          <el-form-item label="泥位计地址" prop="data.addr">
            <el-input
              v-model="commandForm.data.addr"
              placeholder="泥位计地址"
              @input="handleInput($event, 'addr', 0, 0, 255)"
            />
          </el-form-item>
          <el-form-item
            label="安装高度"
            class="func-command__group"
            prop="data.high"
          >
            <el-input
              v-model="commandForm.data.high"
              @input="handleInput($event, 'high', 0, 0, 65)"
              placeholder="安装高度"
            />
            <div class="func-command__unit">m</div>
          </el-form-item>

          <el-form-item
            label="初始值"
            class="func-command__group"
            prop="data.origin"
          >
            <el-input
              v-model="commandForm.data.origin"
              @input="handleInput($event, 'origin', 0, 0, 65)"
              placeholder="初始值"
            />
            <div class="func-command__unit">m</div>
          </el-form-item>

          <el-form-item
            label="加报阈值"
            class="func-command__group"
            prop="data.threshold"
          >
            <el-input
              v-model="commandForm.data.threshold"
              @input="handleInput($event, 'threshold', 0, 1, 65)"
              placeholder="加报阈值"
            />
            <div class="func-command__unit">m</div>
          </el-form-item>
        </template>
        <!-- 雨量计 -->
        <template class="func-command__rain" v-if="type == 2">
          <el-form-item label="雨量计地址" prop="data.addr">
            <el-input
              v-model="commandForm.data.addr"
              placeholder="雨量计地址"
              @input="handleInput($event, 'addr', 0, 0, 255)"
            />
          </el-form-item>
          <el-form-item
            label="加报周期"
            class="func-command__group"
            prop="data.cycle"
          >
            <el-input
              v-model="commandForm.data.cycle"
              @input="handleInput($event, 'cycle', 0, 1, 255)"
              placeholder="加报周期"
            />
            <div class="func-command__unit">min</div>
          </el-form-item>

          <el-form-item
            label="报警阈值"
            class="func-command__group"
            prop="data.threshold"
          >
            <el-input
              v-model="commandForm.data.threshold"
              @input="handleInput($event, 'threshold', 0, 1, 1440)"
              placeholder="报警阈值"
            />
            <div class="func-command__unit">mm</div>
          </el-form-item>

          <el-form-item
            label="报警阈值时长"
            class="func-command__group"
            prop="data.the_time"
          >
            <el-input
              v-model="commandForm.data.the_time"
              @input="handleInput($event, 'the_time', 0, 1, 255)"
              placeholder="报警阈值时长"
            />
            <div class="func-command__unit">min</div>
          </el-form-item>

          <el-form-item
            label="累计雨量"
            class="func-command__group"
            prop="data.sum"
          >
            <el-input
              :model-value="commandForm.data.sum"
              @input="handleInput($event, 'sum', 0, 0, 6553)"
              placeholder="累计雨量"
            />
            <div class="func-command__unit">mm</div>
          </el-form-item>
        </template>
        <!-- 断线 -->
        <template class="func-command__rain" v-if="type == 3">
          <el-form-item label="断线传感器地址" prop="data.addr">
            <el-input
              v-model="commandForm.data.addr"
              placeholder="断线传感器地址"
              @input="handleInput($event, 'addr', 0, 0, 255)"
            />
          </el-form-item>
        </template>
      </div>
      <el-form-item
        label="时间段"
        v-if="dynamicFields.showDateTimeRange"
        prop="data.dateTimeRange"
      >
        <el-date-picker
          v-model="commandForm.data.dateTimeRange"
          type="datetimerange"
          range-separator="至"
          style="width: 100%"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          :clearable="false"
        />
      </el-form-item>

      <el-form-item
        label="遥测站时钟"
        v-if="dynamicFields.showClock"
        prop="data.lock"
      >
        <el-date-picker
          v-model="commandForm.data.lock"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime"
          placeholder="设置遥测站时钟"
        />
      </el-form-item>
      <el-form-item label=" " class="command-form__btn">
        <el-button
          type="primary"
          :disabled="!commandForm.code || responseLoading"
          @click="handleClickSubmit"
          >下发指令</el-button
        >
        <!-- <el-button @click="handleReset">重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 下发及反馈内容 -->
    <div class="func-command__feedback">
      <el-empty
        v-if="!commandData.length"
        :image-size="100"
        style="height: 100%"
      />
      <ul v-else class="control-list" ref="controlListRef">
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
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";

.func-command {
  display: grid;
  grid-template-columns: 380px 1fr;
  column-gap: 16px;
  // border: 1px solid var(--card-border-color);
  // background: var(--background-color);
  height: calc(100vh - 198px);
}

.func-command__form {
  padding: 24px 12px;
  // border-right: 1px solid var(--card-border-color);
  background: var(--background-color);
  overflow-y: auto;
  @extend %scrollbar;

  .command-form__operate {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .command-form__details {
    display: flex;
    flex-wrap: wrap;

    .func-command__check {
      display: flex;
      width: 100%;
    }

    .func-command__check-item {
      flex: 1;
    }

    .func-command__rain {
      width: 100%;
    }
  }

  .command-form__btn {
    margin-bottom: 0;
  }

  .el-form-item {
    width: 100%;
  }

  :deep(.el-range-editor) {
    .el-range-input {
      width: 40%;
    }
  }

  .func-command__group {
    :deep(.el-form-item__content) {
      display: flex;
      width: 100%;
      flex-wrap: nowrap;
    }

    .func-command__unit {
      padding-inline: 8px;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: var(--normal-title-color);
      text-align: center;
      background: #fff;
      border-radius: 0 3px 3px 0;
      border: 1px solid var(--select-border-color);
      border-left: none;
    }
  }
}

.func-command__feedback {
  color: var(--command-message-color);
  background: var(--background-color);
  padding: 24px 16px 24px 10px;
  overflow: hidden;

  :deep(.card-content) {
    height: calc(100% - 48px);
  }

  .control-list {
    height: 100%;
    padding: 0 6px;
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
    padding: 4px 4px 4px 12px;
    display: flex;
    line-height: 16px;
    font-size: 14px;
    border-radius: 4px;
    background: var(--command-message-bg);
    animation: flicker 1s infinite;
    white-space: nowrap;

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
