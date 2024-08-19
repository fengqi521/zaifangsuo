<script setup>
import { reactive, ref, computed } from "vue";
import Bread from "@/components/Bread/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElCard from "@/components/ElCard/index.vue";

import { isEmpty } from "lodash";
import { useMessage } from "@/plugins/message";
import { encodeMessage, getCRCAsHex } from "@/utils";
import { parseFormData, parseFormItems } from "@/constants";
import systemApi from "@/api";

const { error } = useMessage();
const breadList = ref([{ title: "报文解析" }]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const searchModel = ref({ ...parseFormData });
const parseData = reactive({ detail: {}, lists: [] });
console.log(
  getCRCAsHex("7E7E110101010200201238100C0200012407010005240831235905")
);
// 解析报文
const handleSearchSubmit = (data) => {
  if (!data.code) return;
  // data.code =
  //   "7E7E0011010208892012323014020002240808091157320136000000010521020AB1038A0A";
  searchModel.value = { ...searchModel.value, ...data };
  getParse();
};

// 获取数据
const getParse = () => {
  systemApi.getParse(searchModel.value).then((res) => {
    if (!res.code) {
      parseData.detail = res.data;
      return;
    }

    error(res.message);
  });
};

// 内容中数据
const content = computed(() => {
  const { content } = parseData.detail;
  console.log(content);
  if (!content) return;
  try {
    const { collect_time, data, sensor_name, serial } = content;
    const { ambient_temperature, collect, battery_voltage } = data;
    return (
      (serial && `流水号：${serial}，`) +
      (sensor_name && `设备类型：${sensor_name}，`) +
      (collect_time && `采集时间：${collect_time}，`) +
      (collect !== "" && `泥水位：${collect}，`) +
      (ambient_temperature !== "" && `温度：${ambient_temperature}，`) +
      (battery_voltage !== "" && `电压：${battery_voltage}`)
    );
  } catch (error) {
    console.log(error);
  }
});

// 重置
const handleReset = () => {
  searchModel.value.code = "";
  // handleSearchSubmit();
};
</script>

<template>
  <div>
    <Bread :breadList="breadList" />
    <!-- 查询 -->
    <SearchForm
      :initialData="searchModel"
      :formItems="parseFormItems"
      @submit="handleSearchSubmit"
      @reset="handleReset"
    >
      <template #submit-button>解析报文</template>
      <template #reset-button>重置报文</template>
    </SearchForm>

    <!-- 基本信息 -->
    <ElCard title="解析内容" v-loading="loading">
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
        <p class="parse-detail__item parse-detail__content">
          <span class="parse-detail__label">报文正文:</span>
          {{ parseData.detail.origin }}
        </p>
        <p class="parse-detail__item parse-detail__data" v-if="content">
          <span class="parse-detail__label">数据内容:</span>
          {{ content }}
        </p>
      </div>
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.el-form {
  :deep(.el-input) {
    width: 468px;
  }
}
.parse-detail {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  background: var(--card-detail-bg-color);

  &__item {
    line-height: 36px;
    width: 32%;
    color: var(--normal-title-color);
    font-weight: 700;
  }

  &__data,
  &__content {
    width: 100%;
  }

  &__label {
    font-weight: normal;
    color: var(--normal-subtitle-color);
  }
}
</style>
