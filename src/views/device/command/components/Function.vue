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
import ElCard from "@/components/ElCard/index.vue";
import Icon from "@/components/Icon.vue";

import { isEmpty } from "lodash";
import { useMessage } from "@/plugins/message";
import { useInputHook } from "@/hooks/useInput";
import { strToHex, hexToDecimal } from "@/utils";
import { operateLists } from "@/constants";
import systemApi from "@/api";

const { params: { id, type } } = useRoute();
const { setInputValue, setInputMaxLen, setInputExactDivision } = useInputHook();
const { success, error } = useMessage();



// 表单配置
const formConfig = {
    common: {
        address: {
            label: "遥测站地址:",
            width: "180px",
            labelWidth: "68",
            maxLen: 10,
            placeholder: "遥测站地址",
            type: "el-input",
        },
        pass: {
            label: "密码:",
            width: "200px",
            maxLen: 4,
            labelWidth: "32",
            placeholder: "密码",
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
        5: {
            addr: {
                label: "泥位计地址:",
                labelWidth: "74",
                minLen: 0,
                maxLen: 255,
                placeholder: "泥位计地址",
            },
            high: {
                label: "安装高度:",
                labelWidth: "56",
                min: 0,
                max: 65,
                unit: "m",
            },
            origin: {
                label: "初始值:",
                labelWidth: "44",
                min: 0,
                max: 65,
                unit: "m",
            },
            threshold: {
                label: "加报阈值:",
                labelWidth: "56",
                min: 0,
                max: 65,
                unit: "m",
            },
        },
        7: {
            lock: {
                label: "遥测站时钟:",
                labelWidth: "68",
                minLen: 0,
                maxLen: 255,
                type: "el-date-picker",
                placeholder: "选择时间",
            },
        },
    },
    type2: {
        5: {
            addr: {
                label: "雨量地址:",
                labelWidth: "56",
                minLen: 0,
                maxLen: 255,
                placeholder: "雨量地址",
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
                min: 0,
                max: 6553,
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
                max: 6553,
                decimals: 0,
                unit: "mm",
            },
        },
        7: {
            lock: {
                label: "遥测站时钟:",
                type: "el-date-picker",
                labelWidth: "68",
                minLen: 0,
                maxLen: 255,
                placeholder: "选择时间",
            },
        },
    },
    type3: {
        5: {
            addr: {
                label: "断线式泥石流报警器地址:",
                labelWidth: "140",
                minLen: 0,
                maxLen: 255,
                placeholder: "断线式泥石流报警器地址",
            },
        },
        7: {
            lock: {
                label: "遥测站时钟:",
                labelWidth: "68",
                minLen: 0,
                maxLen: 255,
                type: "el-date-picker",
                placeholder: "选择时间",
            },
        },
    },
};

// 参数
const speForm = reactive({
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
            addr: "", // 雨量地址
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

// 表单
const commandForm = reactive({ ...baseForm, data: {} });
const currentConfig = computed(() => {
    return {
        common: { ...formConfig.common },
        [`type${type}`]: { ...formConfig[`type${type}`][commandForm.code] },
    };
});
const unfold = ref(true);

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
                        const speFormItem = speForm[`type${type}`][commandForm.code];
                        const itemArr = Object.keys(speFormItem);
                        if (itemArr.includes(attr)) {
                            const value = element_item[attr];
                            speFormItem[attr] = hexToDecimal(value);
                        }
                    });
                    resolve(speForm[`type${type}`][commandForm.code]);
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
        return;
    }

    if (newVal === 5) {
        try {
            await getDeviceConfig();
            commandForm.data = { ...speForm[`type${type}`][commandForm.code] };
        } catch (error) {
            console.error("Error fetching device config:", error);
        }
        return;
    }

    if (newVal === 7) {
        commandForm.data = { ...speForm[`type${type}`][commandForm.code] };
    }
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
    console.log(operate, 'vvvvvvvvv')
    const showDateTimeRange = operate == "4";
    const showTypeData = operate == '5'
    const showClock = operate == '7'
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
const maxHeight = ref(0);
let commandIntervalId = ref(null);

// 下发指令
const handleClickSubmit = () => {
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
    console.log(params, "=======");

    // return;

    if (!isEmpty(data) && data.dateTimeRange) {
        params.Data = {
            ...params.Data,
            start_time: data.dateTimeRange[0],
            end_time: data.dateTimeRange[1],
        };
    }

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
};

// 重置
// const handleReset = () => {
//     commandForm.code = "";
// };

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

// 计算和设置内容区域的高度
const updateContentHeight = async () => {
    await nextTick();
    if (controlFormRef.value) {
        const ele = controlFormRef.value.$el;
        const headerHeight = ele.clientHeight;
        maxHeight.value = `${window.innerHeight - headerHeight - 194}px`;
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
    return;
    updateContentHeight();
    observeElement();
});
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
        <el-form class="func-command__form" :model="commandForm" ref="controlFormRef" label-width="auto">
            <!-- 功能码 -->
            <el-form-item label="功能码:" class="command-form__operate">
                <el-select v-model="commandForm.code" placeholder="功能码" style="width:100%">
                    <el-option v-for="(operate, index) in operateLists" :key="index" :label="operate.label"
                        :value="operate.code" />
                </el-select>
            </el-form-item>
            <!-- 公共部分表单 -->
            <div class="command-form__details" v-if="dynamicFields.showTypeData
                ">
                <el-form-item label="遥测站地址">
                    <el-input v-model="commandForm.address" placeholder="遥测站地址"
                        @input="handleLimitInput($event, 'address', 10)"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="commandForm.pass" placeholder="密码"
                        @input="handleLimitInput($event, 'pass', 4)"></el-input>
                </el-form-item>

                <el-form-item label="采集周期" class="func-command__group">
                    <el-input :model-value="commandForm.collect" @input="handleCommonInput($event, 'collect', 0, 1, 255)"
                        placeholder="采集周期" />
                    <div class="func-command__unit">min</div>
                </el-form-item>

                <el-form-item label="定时报周期" class="func-command__group">
                    <el-input :model-value="commandForm.timer" @input="handleCommonInput($event, 'timer', 0, 1, 1440)"
                        placeholder="定时报周期" />
                    <div class="func-command__unit">min</div>
                </el-form-item>
                <el-form-item label="定时报开始时间">
                    <el-time-picker v-model="commandForm.timer_start" format="HH:mm" value-format="HH:mm"
                        placeholder="定时报开始时间" />
                </el-form-item>

                <div class="func-command__check">
                    <el-form-item label="自检上报参数" class="func-command__check-item">
                        <el-time-select v-model="commandForm.check_time" style="width:100%" start="00:00" step="1:00"
                            end="23:00" format="HH" placeholder="开始时刻" />
                    </el-form-item>
                    <el-form-item style="width:115px;margin-left:10px">
                        <el-input :model-value="commandForm.check_num"
                            @input="handleExactDivisionInput($event, 'check_num')" placeholder="每天上报次数" />
                    </el-form-item>
                </div>
                <!-- 泥位计 -->
                <div class="func-command__rain" v-if="type == 1">
                    <el-form-item label="泥位计地址">
                        <el-input v-model="commandForm.data.addr" maxlength="255" placeholder="泥位计地址" />
                    </el-form-item>
                    <el-form-item label="安装高度" class="func-command__group">
                        <el-input v-model="commandForm.data.high" @input="handleInput($event, 'high', 0, 0, 65)"
                            placeholder="安装高度" />
                        <div class="func-command__unit">m</div>
                    </el-form-item>

                    <el-form-item label="初始值" class="func-command__group">
                        <el-input v-model="commandForm.data.origin" @input="handleInput($event, 'origin', 0, 0, 65)"
                            placeholder="初始值" />
                        <div class="func-command__unit">m</div>
                    </el-form-item>

                    <el-form-item label="加报阈值" class="func-command__group">
                        <el-input v-model="commandForm.data.threshold" @input="handleInput($event, ' threshold', 0, 1, 65)"
                            placeholder="加报阈值" />
                        <div class="func-command__unit">m</div>
                    </el-form-item>
                </div>
                <!-- 雨量计 -->
                <div class="func-command__rain" v-if="type == 2">
                    <el-form-item label="雨量地址">
                        <el-input v-model="commandForm.data.addr" maxlength="255" />
                    </el-form-item>
                    <el-form-item label="加报周期" class="func-command__group">
                        <el-input v-model="commandForm.data.cycle" @input="handleInput($event, 'cycle', 0, 1, 255)" />
                        <div class="func-command__unit">min</div>
                    </el-form-item>

                    <el-form-item label="报警阈值" class="func-command__group">
                        <el-input v-model="commandForm.data.threshold"
                            @input="handleInput($event, 'threshold', 0, 1, 1440)" />
                        <div class="func-command__unit">mm</div>
                    </el-form-item>

                    <el-form-item label="报警阈值时长" class="func-command__group">
                        <el-input v-model="commandForm.data.the_time" @input="handleInput($event, 'the_time', 0, 1, 255)" />
                        <div class="func-command__unit">min</div>
                    </el-form-item>

                    <el-form-item label="累计雨量" class="func-command__group">
                        <el-input :model-value="commandForm.data.sum" @input="handleInput($event, 'sum', 0, 0, 6553)" />
                        <div class="func-command__unit">mm</div>
                    </el-form-item>
                </div>
                <!-- 断线 -->
                <div class="func-command__rain" v-if="type == 3">
                    <el-form-item label="断线传感器地址">
                        <el-input v-model="commandForm.data.addr" maxlength="255" placeholder="断线传感器地址" />
                    </el-form-item>
                </div>

            </div>
            <el-form-item label="时间段" v-if="dynamicFields.showDateTimeRange">
                <el-date-picker v-model="commandForm.data.dateTimeRange" type="datetimerange" range-separator="To"
                    style="width: width:100%" start-placeholder="开始时间" end-placeholder="结束时间"
                    value-format="YYYY-MM-DD HH:mm:ss" :clearable="false" />
            </el-form-item>

            <el-form-item label="遥测站时钟" v-if="dynamicFields.showClock">
                <el-date-picker v-model="commandForm.data.lock" value-format="YYYY-MM-DD HH:mm:ss" type="datetime"
                    placeholder="设置遥测站时钟" />
            </el-form-item>
            <el-form-item label="" class="command-form__btn">
                <el-button type="primary" :disabled="!commandForm.code || responseLoading"
                    @click="handleClickSubmit">下发指令</el-button>
                <!-- <el-button @click="handleReset">重置</el-button> -->
            </el-form-item>
        </el-form>


        <!-- 下发及反馈内容 -->
        <div class="func-command__feedback">
            <el-empty v-if="!commandData.length" :image-size="100" style="height:100%" />
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

.func-command {
    display: grid;
    grid-template-columns: 366px 1fr;
    padding: 0 24px 24px;
    border: 1px solid var(--card-border-color);
    background: var(--background-color);
    height:100%;
}

.func-command__form {
    padding: 24px 24px 0 0;
    border-right: 1px solid var(--card-border-color);

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
            flex: 1
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

        &.el-input__wrapper {
            // padding-inline: 2px;
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
    padding: 24px 0 0 24px;
    overflow:hidden;
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