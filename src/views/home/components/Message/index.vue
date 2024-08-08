<script setup>
import { ref, nextTick, reactive, watch, onUnmounted } from "vue";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import SearchForm from "@/components/SearchForm/index.vue";
import { messageFormData, messageFormItems } from "@/constants";
import { getCurrentTime } from "@/utils";
import homeApi from "@/api/home";

let timer = null;
const drawStatus = ref(false);
const dynamicScrollerRef = ref(null);
let isScrollingEnabled = false;
const messageSearchModel = ref({ ...messageFormData });
const curCategory = ref(messageFormData.category);
const messages = reactive({
  all: [],
  category: [],
});

// 获取当前数据
const getCurrentCategoryList = () => {
  homeApi.getHistory(messageSearchModel.value).then((res) => {
    if (!res.code) {
      const data = res.data.list;
      if (data.length > 0) {
        messageSearchModel.value.time = data[data.length - 1].CreateTime;
        const lists = data.map((item) => ({
          ...item,
          id: `data-id-${item.Id}-${getCurrentTime()}`,
        }));
        // 全部数据
        messages.all.push(...lists);

        // 当前选择非全部
        if (messageFormData.category !== curCategory.value) {
          messages.category.push(
            ...lists.filter((item) => item.Operate === curCategory)
          );
        }
        if (isScrollingEnabled) return;
        scrollToBottom();
      }
    }
  });
};

// 查询数据
const handleSearchSubmit = (data) => {
  curCategory.value = data.category;
  messages.category = [];
  const lists = messages.all.filter((item) => item.Operate === data.category);
  if (lists.length > 0) messages.category = [...lists];
};

// 重置
const handleReset = () => {
  messageSearchModel.value.category = curCategory.value;
};

// 监听drawer状态
watch(
  () => drawStatus.value,
  (val) => {
    if (val) {
      messageSearchModel.value.time = getCurrentTime();
      getRealList();
      return;
    }
    clearInterval(timer);
    timer = null;
  }
);

onUnmounted(() => {
  clearInterval(timer);
  timer = null;
});

// 轮询数据
const getRealList = () => {
  getCurrentCategoryList();
  timer = setTimeout(() => {
    getRealList();
  }, 3000);
};

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
    <SearchForm
      class="search-form"
      :initialData="messageSearchModel"
      :formItems="messageFormItems"
      @submit="handleSearchSubmit"
      @reset="handleReset"
    >
    </SearchForm>
    <DynamicScroller
      class="message-scrollbar"
      ref="dynamicScrollerRef"
      :items="
        messageSearchModel.category !== curCategory
          ? messages.category
          : messages.all
      "
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
          <p class="message-item-top">{{ item.CreateTime }}</p>
          <div class="message-item-bom">
            <p class="message-item-title">{{ item.title }}</p>
            <p class="message-item-info">{{ item.Response }}</p>
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

  .search-form {
    justify-content: center;
    padding: 0 16px 16px;
    margin-bottom: 0cap;
    :deep(.el-form-item) {
      margin: 0 8px 0 0;
    }
    :deep(.el-button) {
      padding: 4px;
      height: 24px;
    }
  }

  .message-scrollbar {
    height: calc(100% - 49px);
    overflow-y: auto;
    @extend %scrollbar;
  }

  .message-item {
    padding-bottom: 24px;
    word-break: break-all;
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
