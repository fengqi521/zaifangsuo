<script setup>
import { ref, reactive, nextTick, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import Icon from "@/components/Icon.vue";

import { useMessage } from "@/plugins/message";
import systemApi from "@/api";

const {
  params: { id, type },
} = useRoute();
const { success, error } = useMessage();

const baseForm = {
  id,
  code: "15",
  count: 1,
};

// 表单
const commandForm = reactive({
  ...baseForm,
  data: { content: "", start_time: "", way: "1" },
});

// 校验
const formRules = {
  data: {
    content: [{
      required: true,
      message: "播放内容必选",
      trigger: "change",
    }],
    start_time: [{
      required: true,
      message: "播放时间必选",
      trigger: "change",
    }],
  }
}

// 获取播放内容
const voiceList = ref([]);
const getVoiceList = () => {
  systemApi.getTemplate().then((res) => {
    if (!res.code) {
      voiceList.value = res.data.tmp.map((item) => ({
        label: item.Content,
        value: item.Content,
        title: item.Content
      }));
    }
  });
};
getVoiceList();
// 下发及响应数据
const commandData = reactive([]);
const responseLoading = ref(false);
const controlFormRef = ref(null);
const controlListRef = ref(null);
let commandIntervalId = ref(null);

// 显示播放次数
const isShow = computed(() => {
  return commandForm.data.way === "1";
});

// 下发指令
const handleClickSubmit = async () => {
  try {
    const valid = await controlFormRef.value.validate()
    if (!valid) return;
    if (commandIntervalId) {
      clearInterval(commandIntervalId);
    }
    const { code, count, data } = commandForm;
    const way = data.way;
    let params = { id, code, Data: { ...data, way: way > 16 ? way : count } };

    systemApi.downControl(params).then((res) => {
      if (!res.code) {
        commandData.push({ ...res.data, type: "down" });
        responseLoading.value = true;
        setControlListScroll();
        realResponse({ id, code, deadline: res.data.deadline });
        return;
      }
      error(res.message);
    });
  } catch (error) {
    console.log(error)
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
});
</script>
<template>
  <div class="alarm-command">
    <!-- 报文下发表单 -->
    <el-form class="alarm-command__form" :model="commandForm" ref="controlFormRef" :rules="formRules" label-width="auto">
      <el-form-item label="播放内容" prop="data.content">
        <el-select-v2 v-model="commandForm.data.content" :options="voiceList" placeholder="选择播放内容" filterable />
        <el-input class="textarea" v-model="commandForm.data.content" placeholder="播放内容" :maxlength="400" disabled
          type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="播放时间" prop="data.start_time">
        <el-date-picker v-model="commandForm.data.start_time" value-format="YYYY-MM-DD HH:mm:ss" type="datetime"
          placeholder="播放时间" />
      </el-form-item>
      <el-form-item label="播放方式">
        <el-radio-group v-model="commandForm.data.way">
          <el-radio value="1">单曲播放</el-radio>
          <el-radio value="17">循环播放</el-radio>
          <el-radio value="18">停止循环</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label=" " v-if="isShow">
        <el-select v-model="commandForm.count" placeholder="Select">
          <el-option v-for="(item, index) of 16" :key="item" :label="`${item}次`" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label=" " class="command-form__btn">
        <el-button type="primary" :disabled="!commandForm.code || responseLoading"
          @click="handleClickSubmit">下发指令</el-button>
        <!-- <el-button @click="handleReset">重置</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 下发及反馈内容 -->
    <div class="func-command__feedback">
      <el-empty v-if="!commandData.length" :image-size="100" style="height: 100%" />
      <ul v-else class="control-list" ref="controlListRef">
        <li :class="`control-item control-${list.type}`" v-for="(list, index) in commandData" :key="index">
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
          <Icon iconClass="close-icon icon-guanbi" size="8px" @click="handleClickCancelLoading" />
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";

.alarm-command {
  display: grid;
  grid-template-columns: 378px 1fr;
  column-gap: 16px;
  // padding-inline: 24px;
  // border: 1px solid var(--card-border-color);
  // background: var(--background-color);
  height: calc(100vh - 198px);
}

.alarm-command__form {
  padding: 24px;
  // border-right: 1px solid var(--card-border-color);
  background: var(--background-color);

  .textarea {
    margin-top: 10px;

    :deep(.el-textarea__inner) {
      height: 160px;
      @extend %scrollbar;
    }
  }

  .command-form__btn {
    margin-bottom: 0;
  }

  .el-form-item {
    width: 100%;
  }
}

.func-command__feedback {
  color: var(--command-message-color);
  background: var(--background-color);
  padding: 24px;
  overflow: hidden;

  :deep(.card-content) {
    height: calc(100% - 48px);
  }

  .control-list {
    height: 100%;
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
