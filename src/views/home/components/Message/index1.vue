<script setup>
import MessageSearch from "../MessageSearch/index.vue";
const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="home-message">
    <MessageSearch />
    <ul class="message-panel">
      <li class="message-item" v-for="({ title, info, date }, index) in messages" :key="index">
        <!-- 信息日期 -->
        <p class="message-item-top">{{ date }}</p>
        <!-- 信息内容 -->
        <div class="message-item-bom">
          <p class="message-item-title">{{ title }}</p>
          <p class="message-item-info">{{ info }}</p>
        </div>
      </li>
    </ul>
<!-- 
      <RecycleScroller class="scrolling-content" :items="items" :item-size="50" key-field="id">
            <div slot-scope="{ item }" class="message-item">
              
                <p class="message-item-top">{{ item.date }}</p>
             
                <div class="message-item-bom">
                    <p class="message-item-title">{{ item.title }}</p>
                    <p class="message-item-info">{{ item.info }}</p>
                </div>
            </div>
        </RecycleScroller>  -->
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";

.home-message {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 8px;
  width: var(--home-message-width);
  height: calc(100vh - var(--nav-header-height) - var(--tagsview-height) - 32px);
  background: var(--background-color);
  border-radius: 2px;
  word-break: break-all;
  overflow: hidden;

  .message-panel {
    height: calc(100vh - var(--nav-header-height) - var(--tagsview-height) - 82px);
    overflow-y: auto;
    @extend %scrollbar;
  }

  .message-item {
    margin-bottom: 18px;
  }

  .message-item-bom {
    display: inline-block;
    padding: 8px 4px;
    min-height: 56px;
    background: var(--home-message-item-bg);
    border-radius: 4px;

    &:last-child {
      margin-bottom: 0;
    }

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
    margin-bottom: 4px;
    color: var(--home-message-date-color);
  }
}
</style>
