<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Bread from "@/components/Bread/index.vue";
import ElCard from "@/components/ElCard/index.vue";

import { isEmpty, isUndefined } from "lodash";
import { useMessage } from "@/plugins/message";
import { encodeMessage, hexToDecimal } from "@/utils";

import { recordOptions, deviceMap, alarm } from "@/constants";
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
const getWay = (way) => {
  if (way < 17) {
    return `单曲播放${way}次`;
  }
  if (way < 18) {
    return `循环播放`;
  }
  return "停止循环";
};

// 配置数据
const getElementConfig = () => {
  try {
    const {
      content: {
        address,
        pass,
        check,
        collect,
        element,
        serial,
        timer,
        timer_start,
        element: { addr, high, origin, threshold, the_time, sum, cycle },
      },
    } = parseData.detail;
    let addrName = "";
    let thresholdName = "";
    switch (type) {
      case "1":
        addrName = "泥位计";
        thresholdName = "加报阈值";
        break;
      case "2":
        addrName = "雨量计";
        thresholdName = "报警阈值";
        break;
      case "3":
        addrName = "断线";
        break;
    }

    if (timer_start) {
      var timer_start_hh = hexToDecimal(timer_start.slice(0, 2));
      var timer_start_mm = hexToDecimal(timer_start.slice(2));
      if (timer_start_hh <= 9) timer_start_hh = `0${timer_start_hh}`;
      if (timer_start_mm <= 9) timer_start_mm = `0${timer_start_mm}`;
    }

    if (check) {
      var check_time = hexToDecimal(check.slice(0, 2));
      var check_num = hexToDecimal(check.slice(2));
    }

    return [
      address ? `遥测站地址：${address}` : "",
      pass ? `密码：${pass}` : "",
      collect ? `采集周期：${hexToDecimal(collect)}min` : "",
      timer ? `定时报周期：${hexToDecimal(timer)}min` : "",
      timer_start ? `定时报开始时间：${timer_start_hh}:${timer_start_mm}` : "",
      timer_start ? `自检上报开始时刻：${check_time}时` : "",
      timer_start ? `自检上报每天上报次数：${check_num}` : "",

      addr ? `${addrName}地址：${hexToDecimal(addr)}` : "",
      high ? `安装高度：${hexToDecimal(high)}m` : "",
      origin ? `初始值：${hexToDecimal(origin)}m` : "",

      cycle ? `加报周期：${hexToDecimal(cycle)}min` : "",
      threshold ? `${thresholdName}：${hexToDecimal(threshold)}m` : "",
      the_time ? `报警阈值时长：${hexToDecimal(the_time)}min` : "",
      sum ? `累计雨量：${hexToDecimal(sum)}mm` : "",
    ];
  } catch (error) {
    return [];
  }
};

// 自检数据显示
const setSelfCheck = () => {
  const { content, operate } = parseData.detail;
  if (operate === "E2" || operate === "52") {
    const {
      ambient_temperature,
      battery_voltage,
      signal_strength,
      elevation,
      longitude,
      latitude,
      solar_voltage,
      wind_voltage,
    } = content;
    return [
      !isUndefined(longitude) ? `经度：${longitude}` : "",
      !isUndefined(latitude) ? `纬度：${latitude}` : "",
      !isUndefined(elevation) ? `设备高程：${elevation}mm` : "",

      ambient_temperature ? `设备温度：${ambient_temperature}℃` : "",
      battery_voltage ? `设备电压：${battery_voltage}V` : "",
      signal_strength ? `设备信号强度：${signal_strength}dBm` : "",
      solar_voltage ? `太阳能板输出电压：${solar_voltage}V` : "",
      wind_voltage ? `风能输出电压：${wind_voltage}V` : "",
    ];
  }

  return [];
};

// 内容中数据
const content = computed(() => {
  const { content, operate } = parseData.detail;
  if (Array.isArray(content)) return `查询内容：${content.join("，")}`;
  if (!content) return;
  try {
    const {
      collect_time,
      data = {},
      sensor_name,
      serial,
      alarm_content,
      alarm_time,
      alarm_level,
      alarm_sound,
      pkg_number,
      current_number,
      start_time,
      end_time,
      datetime,
    } = content;

    const {
      collect,
      collect2,
      collect3,
      muddy_addr,
      rain_addr,
      line_addr,
      line_addr2,
      line_addr3,
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
      atmos,
      range,
    } = data;
    const dateTimeLabel = {
      51: "时钟信息",
      52: "采集时间",
      F2: "播放时间",
      F3: "播放时间",
      "4A": "遥测站时钟",
    };
    const parts = [
      serial ? `流水号：${serial}` : "",
      // sensor_name ? `设备类型：${sensor_name}` : "",
      collect_time ? `采集时间：${collect_time}` : "",
      muddy_addr ? `泥位计地址：${hexToDecimal(muddy_addr)}` : "",
      rain_addr ? `雨量计地址：${hexToDecimal(rain_addr)}` : "",
      line_addr ? `断线1地址：${hexToDecimal(line_addr)}` : "",
      line_addr2 ? `断线2地址：${hexToDecimal(line_addr2)}` : "",
      line_addr2 ? `断线3地址：${hexToDecimal(line_addr2)}` : "",
      `${
        collect > -1
          ? type == 1
            ? `泥水位：${collect}m`
            : `断线1状态：${collect === 0 ? "正常" : "断开"}`
          : ""
      }`,
      collect2 > -1 ? `断线2状态：${collect2 === 0 ? "正常" : "断开"}` : "",
      collect3 > -1 ? `断线3状态：${collect3 === 0 ? "正常" : "断开"}` : "",

      range ? `泥水位变化值：${range}m` : "",
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
      signal_strength ? `设备信号强度：${signal_strength}dBm` : "",

      alarm_time ? `设备报警时间：${alarm_time}` : "",
      alarm_content ? `报警内容：${alarm_content}` : "",
      alarm_level > -1 ? `报警等级：${alarm["level"][alarm_level]}` : "",
      alarm_sound > -1 ? `音量大小：${alarm["sound"][alarm_sound]}` : "",
      datetime ? `${dateTimeLabel[operate]}：${datetime}` : "",
      pkg_number ? `固件包包数：${pkg_number}` : "",
      current_number ? `当前上传包数：${current_number}` : "",
      // content?.datetime ? `播放时间：${content.datetime}` : "",
      content?.content ? `播放内容：${content.content}` : "",
      content?.way ? `播放方式：${getWay(content.way)}` : "",
      start_time ? `开始时间：${start_time}` : "",
      end_time ? `结束时间：${end_time}` : "",
      ...getElementConfig(),
      ...setSelfCheck(),
    ];

    // 过滤掉空字符串并使用逗号连接
    return parts.filter(Boolean).join("，");
  } catch (error) {
    return [];
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
          <span>{{ content }}</span>
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
    padding: 10px;
    width: 32%;
    color: var(--normal-title-color);
    font-weight: 700;
  }

  &__data {
    width: 100%;
    word-break: break-all;
  }

  &__label {
    font-weight: normal;
    color: var(--normal-subtitle-color);
  }
}
</style>
