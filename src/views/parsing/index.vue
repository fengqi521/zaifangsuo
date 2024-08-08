<script setup>
import { reactive, ref, computed } from "vue";
import Bread from "@/components/Bread/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElCard from "@/components/ElCard/index.vue";

import { parseFormData, parseFormItems } from "@/constants";
import { encodeMessage, getCRCAsHex } from "@/utils";
import parseApi from "@/api/parse";
import { useMessage } from "@/plugins/message";

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
  searchModel.value = { ...searchModel.value, ...data };
  getParse();
};

const getParse = () => {
  parseApi.getParse(searchModel.value).then((res) => {
    if (!res.code) {
      const { content, ...others } = res.data;
      parseData.detail = { ...others };
      return;
    }

    error(res.message);
  });
};

const isDetailEmpty = computed(() => {
  return Object.keys(parseData.detail).length === 0;
});

// 重置
const handleReset = () => {
  searchModel.value.code = "";
  handleSearchSubmit();
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
      <el-empty v-if="isDetailEmpty" :image-size="80" />
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
        <p class="parse-detail__item">
          <span class="parse-detail__label">报文正文:</span>
          {{ parseData.detail.origin }}
        </p>
      </div>
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.parse-list {
  margin-top: 24px;
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

  &__label {
    font-weight: normal;
    color: var(--normal-subtitle-color);
  }
}
</style>
