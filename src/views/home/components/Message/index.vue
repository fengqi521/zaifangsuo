<script setup>
import { ref, nextTick, onMounted } from "vue";
import MessageSearch from "../MessageSearch/index.vue";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import { MESSAGE } from "@/constants";
import {getCurrentTime} from '@/utils'

let timer = ref(null);
const messages = ref([...MESSAGE]);
const drawStatus = ref(false);
const dynamicScrollerRef = ref(null);
let isScrollingEnabled = false;
const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
});

// 显示隐藏
const handleChangeDrawer = () => {
  drawStatus.value = true;
};

// 鼠标移入
const handleMouseOver = () => {
  isScrollingEnabled = true;
};

// 鼠标移入
const handleMouseOut = () => {
  isScrollingEnabled = false;
};

// 通过 ref 获取 DynamicScroller 实例并调用 scrollToBottom 方法
const scrollToBottom = () => {
  dynamicScrollerRef?.value?.scrollToBottom();
};

onMounted(() => {
  timer.value = setInterval(() => {
    const lists = [...messages.value];
    const list = {
      title: "Topic rtu/upload/heartbeat/1523453 QoS:0",
      info: "{1242363635435436436437568723322364366,2434,435,332,23,43,43,:1:2:3:4}",
      date: getCurrentTime(),
    };
    lists.push(list);
    messages.value = lists.map((item, index) => ({
      ...item,
      id: `data-id-${index}`,
    }));
    nextTick(() => {
      if (isScrollingEnabled) return;
      scrollToBottom();
    });
  }, 1000);
});
</script>

<template>
  <div class="kongzhi-icon" @click="handleChangeDrawer">
    <Icon iconClass="icon-zuocejiantou" color="var(--text-color)" size="16px" />
  </div>

  <el-drawer
    modal-class="message-container"
    v-model="drawStatus"
    :with-header="false"
    size="360px"
  >
    <MessageSearch />
    <DynamicScroller
      class="message-scrollbar"
      ref="dynamicScrollerRef"
      :items="messages"
      :min-item-size="24"
      @resize="scrollToBottom"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :data-index="index"
          :active="active"
          class="message-item"
        >
          <p class="message-item-top">{{ item.date }}</p>
          <div class="message-item-bom">
            <p class="message-item-title">{{ item.title }}</p>
            <p class="message-item-info">{{ item.info }}</p>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </el-drawer>
</template>

<style lang="scss" scoped>
@import "@/styles/tools.scss";

.kongzhi-icon {
  position: fixed;
  right: 0;
  top: 50%;
  bottom: 50%;
  width: 22px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  transform: translateY(-50%);
  background: var(--drawer-bg-color);
  border-radius: 6px 0 0 6px;
  cursor: pointer;
}

.message-container {
  .message-scrollbar {
    height: calc(100% - 69px);
    overflow-y: auto;
    @extend %scrollbar;
  }

  .message-item {
    padding-bottom: 24px;
    word-break: break-all;
    // &:last-child {
    //   padding-bottom: 0;
    // }
  }

  .message-item-bom {
    display: inline-block;
    padding: 8px 4px;
    background: var(--home-message-item-bg);
    border-radius: 4px;

    .message-item-title {
      margin-bottom: 12px;
      color: var(--home-message-title-color);
    }

    .message-item-info {
      line-height: 16px;
      color: var(--home-message-info-color);
    }
  }

  .message-item-top {
    color: var(--home-message-date-color);
  }
}
</style>
