<script setup>
import { ref, watch } from 'vue'
import MessageSearch from "../MessageSearch/index.vue";
import { RecycleScroller } from "vue-virtual-scroller";
const drawStatus = ref(false)
// import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
const props = defineProps({
    messages: {
        type: Array,
        default: () => [],
    },
});

// 点击显示弹窗
const handleChangeDrawer = () => {
    console.log('点击')
    drawStatus.value = true;
}
</script>

<template>
    <div class="kongzhi-icon" @click="handleChangeDrawer">
        <Icon iconClass="icon-shujukongzhitai" color="var(--text-color)" size="24px" />
    </div>

    <el-drawer v-model="drawStatus" size="360px">
        <MessageSearch />
        <RecycleScroller class="scrolling-content" :items="messages" :item-size="50">
            <div slot-scope="{ item }" class="message-item">
                <!-- 信息日期 -->
                <p class="message-item-top">{{ item.date }}</p>
                <!-- 信息内容 -->
                <div class="message-item-bom">
                    <p class="message-item-title">{{ item.title }}</p>
                    <p class="message-item-info">{{ item.info }}</p>
                </div>
            </div>
        </RecycleScroller>
    </el-drawer>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";

.kongzhi-icon {
    position: fixed;
    right: 0;
    top: 50%;
    bottom: 50%;
    width: 30px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    transform: translateY(-50%);
    background: var(--drawer-bg-color);
    border-radius: 6px 0 0 6px;
    cursor: pointer;
}

.home-message {
    // position: absolute;
    // right: 0;
    // top: 0;
    // bottom: 0;
    // padding: 8px;
    // width: var(--home-message-width);
    // height: calc(100vh - var(--nav-header-height) - var(--tagsview-height) - 32px);
    // background: var(--background-color);
    // border-radius: 2px;
    // word-break: break-all;
    // overflow: hidden;

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
