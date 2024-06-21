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
      <li
        class="message-item"
        v-for="({ title, info, date }, index) in messages"
        :key="index"
      >
        <!-- 信息日期 -->
        <p class="message-item-top">{{ date }}</p>
        <!-- 信息内容 -->
        <div class="message-item-bom">
          <p class="message-item-title">{{ title }}</p>
          <p class="message-item-info">{{ info }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
.home-message {
  margin-left: 16px;
  padding: 8px;
  width: var(--home-message-width);
  word-break: break-all;
  background: var(--background-color);
  height: calc(
    100vh - var(--nav-header-height) - var(--tagsview-height) - 32px
  );
  overflow: hidden;
  border-radius: 2px;
  .message-panel {
    height: calc(
      100vh - var(--nav-header-height) - var(--tagsview-height) - 82px
    );
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
