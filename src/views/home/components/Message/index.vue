<script setup>
import { ref, computed, defineProps,watch } from 'vue';
import MessageSearch from "../MessageSearch/index.vue";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";

const drawStatus = ref(false);
const dynamicScrollerRef = ref(null);

const props = defineProps({
    messages: {
        type: Array,
        default: () => [],
    },
});

const items = computed(() => {
    return props.messages.map((item, index) =>
        Object.assign({}, { id: `data-id-${index}` }, item),
    );
});

const handleChangeDrawer = () => {
    drawStatus.value = true;
};

const scrollToBottom = () => {
    // 通过 ref 获取 DynamicScroller 实例并调用 scrollToBottom 方法
    if (dynamicScrollerRef.value) {
        dynamicScrollerRef.value.scrollToBottom();
    }
};

watch(()=>props.messages,(newVal,oldVal)=>{
    scrollToBottom()
})
</script>

<template>
    <div class="kongzhi-icon" @click="handleChangeDrawer">
        <Icon iconClass="icon-shujukongzhitai" color="var(--text-color)" size="24px" />
    </div>

    <el-drawer modal-class="message-container" v-model="drawStatus" :with-header="false" size="360px">
        <MessageSearch />
        <DynamicScroller class="message-scrollbar" ref="dynamicScrollerRef" :items="items" :min-item-size="24"
            @resize="scrollToBottom">
            <template #default="{ item, index, active }">
                <DynamicScrollerItem :item="item" :data-index="index" :active="active" class="message-item">
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
    width: 30px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    transform: translateY(-50%);
    background: var(--drawer-bg-color);
    border-radius: 6px 0 0 6px;
    cursor: pointer;
}

.message-container {

    :deep(.el-drawer) {

        .el-drawer__body {
            overflow: inherit;
        }
    }

    .message-scrollbar {
        height: calc(100% - 69px);
        @extend %scrollbar;
    }

    .message-item {
        padding-bottom: 24px;
        word-break: break-all;
        &:last-child{
            padding-bottom: 0;
        }
    }
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
</style>
