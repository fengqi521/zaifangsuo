<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Bread from "@/components/Bread/index.vue";
import ElCard from "@/components/ElCard/index.vue";

import { isEmpty } from "lodash";
import { useMessage } from "@/plugins/message";
import { encodeMessage } from "@/utils";

import { recordOptions, deviceMap } from "@/constants";
import systemApi from "@/api";

const {
  params: { id, type },
} = useRoute();
const { error } = useMessage();
const breadList = ref([
  { to: "/command", title: "下发记录" },
  { title: "报文解析" },
]);

const loading = ref(false);
const parseData = reactive({ detail: {}, info: {} });

// 获取设备数据
const getReportInfo = () => {
  return new Promise((resolve, reject) => {
    systemApi.getReportInfo({ id }).then((res) => {
      if (!res.code) {
        const list = recordOptions.find((cur) => cur.value == res.data.operate);
        const code = res.data?.request ? res.data.request : res.data.response;
        const transfer_name = res.data?.transfer_type === 1 ? "上行" : "下行";
        const deviceTypeList = deviceMap.find(
          ({ value }) => Number(type) === value
        );
        parseData.info = {
          ...res.data,
          code,
          transfer_name,
          operate_name: list?.label,
          type_name: deviceTypeList?.label,
        };
        resolve(code);
        return;
      }
      error(res.message);
      reject();
    });
  });
};

// 获取数据
const getParse = (code) => {
  loading.value = true;
  systemApi.getReportParse({ code }).then((res) => {
    loading.value = false;
    if (!res.code) {
      parseData.detail = res.data;
      return;
    }

    error(res.message);
  });
};

onMounted(async () => {
  const result = await getReportInfo();
  await getParse(result);
});

// 内容中数据
const content = computed(() => {
  const { content } = parseData.detail;
  if (!content) return;
  try {
    const { collect_time, data = {}, sensor_name, serial } = content;
    const {
      collect,
      muddy_addr,
      rain_addr,
      air_humidity,
      air_temperature,
      rain_period,
      rain_sum,
      rain_time,
      wind_direction,
      wind_speed,
      ambient_temperature,
      battery_voltage,
      signal_strength,
      atmos
    } = data;
    const parts = [
      serial ? `流水号：${serial}` : "",
      sensor_name ? `设备类型：${sensor_name}` : "",
      collect_time ? `采集时间：${collect_time}` : "",
      collect > -1 ? `泥水位：${collect}m` : "",
      muddy_addr ? `泥位计地址：${muddy_addr}` : "",
      rain_addr ? `雨量计地址：${rain_addr}` : "",
      rain_period > -1 ? `降雨量：${rain_period}mm` : "",
      rain_sum > -1 ? `累计降雨量：${rain_sum}mm` : "",
      rain_time > -1 ? `降雨时长：${rain_time}min` : "",
      air_temperature > -1 ? `温度：${air_temperature}°C` : "",
      air_humidity > -1 ? `湿度：${air_humidity}%RH` : "",
      wind_direction ? `风向：${wind_direction}°` : "",
      wind_speed ? `风速：${wind_speed}m/s` : "",
      atmos ? `气压：${atmos}hPa` : "",
      ambient_temperature ? `设备温度：${ambient_temperature}℃` : "",
      battery_voltage ? `设备电压：${battery_voltage}V` : "",
      signal_strength?`设备信号强度：${signal_strength}` : "",
    ];

    // 过滤掉空字符串并使用逗号连接
    return parts.filter(Boolean).join("，");
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div>
    <Bread :breadList="breadList" />
    <ElCard title="报文信息">
      <h3 class="report-title">{{ parseData.info.code }}</h3>
      <ul class="report-list">
        <li class="report-list-item">
          <p class="report-list-top">
            操作用户<span class="report-list-value">{{
              parseData.info.user_name
            }}</span>
          </p>
          <p>
            操作类型<span class="report-list-value">{{
              parseData.info.operate_name
            }}</span>
          </p>
        </li>
        <li class="report-list-item">
          <p class="report-list-top">
            设备名称<span class="report-list-value">{{
              parseData.info.device_name
            }}</span>
          </p>
          <p>
            设备类型<span class="report-list-value">{{
              parseData.info.type_name
            }}</span>
          </p>
        </li>
        <li class="report-list-item">
          <p class="report-list-top">
            传输类型<span class="report-list-value">{{
              parseData.info.transfer_name
            }}</span>
          </p>
          <p>
            上报时间<span class="report-list-value">{{
              parseData.info.create_time
            }}</span>
          </p>
        </li>
      </ul>
    </ElCard>
    <!-- 基本信息 -->
    <ElCard class="parser-bom" title="解析内容" v-loading="loading">
      <el-empty v-if="isEmpty(parseData.detail)" :image-size="80" />
      <div v-else class="parse-detail">
        <p class="parse-detail__item">
          <span class="parse-detail__label"> 帧起始符:</span>
          {{ parseData.detail.frame_start }}
        </p>
        <p class="parse-detail__item">
          <span class="parse-detail__label">遥测站地址:</span>
          {{ parseData.detail.address }}
        </p>
        <p class="parse-detail__item">
          <span class="parse-detail__label">预留位:</span>
          {{ parseData.detail.reserve }}
        </p>
        <p class="parse-detail__item">
          <span class="parse-detail__label">密码:</span>
          {{ parseData.detail.password }}
        </p>
        <p class="parse-detail__item">
          <span class="parse-detail__label">功能码:</span>
          {{ `${parseData.detail.operate}(${parseData.detail.operates})` }}
        </p>
        <p class="parse-detail__item">
          <span class="parse-detail__label">协议版本号及长度:</span>
          {{ encodeMessage(parseData.detail.version, parseData.detail.length) }}
        </p>
        <p class="parse-detail__item">
          <span class="parse-detail__label">报文起始符:</span>
          {{ parseData.detail.start }}
        </p>
        <p class="parse-detail__item">
          <span class="parse-detail__label">报文结束符:</span>
          {{ parseData.detail.end }}
        </p>
        <p class="parse-detail__item">
          <span class="parse-detail__label">校验码:</span>
          {{ parseData.detail.crc }}
        </p>
        <p class="parse-detail__item parse-detail__data">
          <span class="parse-detail__label">报文正文：</span>
          {{ parseData.detail.origin }}
        </p>
        <p class="parse-detail__item parse-detail__data" v-if="content">
          <span class="parse-detail__label">数据内容：</span>
          {{ content }}
        </p>
      </div>
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.report-title {
  font-size: 14px;
  color: var(--normal-title-color);
  line-height: 24px;
  font-weight: 700;
  word-break: break-all;
}
.report-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  color: var(--normal-title-color);
  line-height: 24px;
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  &-item {
    padding: 0 8px 0 24px;
    border-right: 1px solid #e7e8e9;
    &:last-child {
      border: none;
    }
    &:first-child {
      padding-left: 0;
    }
  }

  &-value {
    display: inline-block;
    vertical-align: bottom;
    margin-left: 12px;
    font-size: 14px;
    font-weight: 700;
  }

  &-top {
    margin-bottom: 10px;
  }

  &-label {
    font-size: 14px;
  }
}
.parser-bom {
  margin-top: 16px;
}
.parse-detail {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  background: var(--card-detail-bg-color);

  &__item {
    line-height: 24px;
    padding:10px;
    width: 32%;
    color: var(--normal-title-color);
    font-weight: 700;
  }

  &__data {
    width: 100%;
  }

  &__label {
    font-weight: normal;
    color: var(--normal-subtitle-color);
  }
}
</style>
