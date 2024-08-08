<script setup>
import { reactive, ref, computed } from "vue";
import Bread from "@/components/Bread/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";

import rtuApi from "@/api/rtu";

import { recordFormData, recordFormItems, recordOptions } from "@/constants";

const breadList = ref([{ title: "下发记录" }]);
const loading = ref(false);

// 设备数据
const device = ref([]);

// 初始查询数据
const initParams = {
  ...recordFormData,
  StartTime: "",
  EndTime: "",
};
const searchModel = ref({
  ...initParams,
  page: 1,
  limit: 10,
});

// 查询字段
const recordItems = reactive(recordFormItems);

// 表格头部
const columns = ref([
  { prop: "num", label: "序号" },
  { prop: "device_name", label: "设备名称" },
  { prop: "operate_type", label: "操作类型" },
  { prop: "response", label: "报文内容" },
  { prop: "transfer_name", label: "传输类型" },
  { prop: "create_time", label: "创建时间" },
]);
// 表格数据
const recordData = reactive({ lists: [], total: 0 });

// 获取设备列表
const getDevice = async () => {
  try {
    const res = await rtuApi.getDeviceList({
      status: 2,
      limit: 10000,
      page: 1,
    });
    if (!res.code) {
      const list = recordItems.find((item) => item.prop === "Did");
      device.value = res.data.list;
      if (list) {
        list.options = res.data.list.map((item) => ({
          label: item.device_name,
          value: item.id,
        }));
      }
    }
  } catch (error) {
    console.error("获取设备列表失败", error);
  }
};

// 获取历史记录
const getRecord = async () => {
  loading.value = true;
  try {
    const res = await rtuApi.getRecord(searchModel.value);
    loading.value = false;
    if (!res.code) {
      recordData.lists = (res?.data?.list ?? []).map((item, index) => {
        const list = recordOptions.find((cur) => cur.value == item.operate);
        item.operate_type = list ? list.label : "";
        item.transfer_name = item.transfer_type === 1 ? "上行" : "下行";
        item.response = item.transfer_type === 1 ? item.response : item.request;
        item.num = index + 1;
        item.device_name = device.value.find(
          (cur) => cur.id === item.device_id
        ).device_name;
        return item;
      });
      recordData.total = res?.data?.total_count;
    }
  } catch (error) {
    loading.value = false;
    console.error("获取历史记录失败", error);
  }
};

// 同步调用接口
const fetchData = async () => {
  await getDevice();
  await getRecord();
};

fetchData();

// 查询
const handleSearchSubmit = (data) => {
  const { range } = data;
  searchModel.value = { ...searchModel.value, ...data };
  if (range.length) {
    searchModel.value.StartTime = range[0];
    searchModel.value.EndTime = range[1];
  }
  getRecord();
};

// 重置
const handleReset = () => {
  searchModel.value = { ...searchModel.value, ...initParams };
  searchModel.value.page = 1;
  getRecord();
};

// 切换分页
const handleChangePage = (page) => {
  searchModel.value.page = page;
  getRecord();
};

// 切换条数
const handleChangeSize = (size) => {
  searchModel.value.limit = size;
  getRecord();
};
</script>

<template>
  <div>
    <Bread :breadList="breadList" />
    <!-- 查询 -->
    <SearchForm
      :initialData="searchModel"
      :formItems="recordItems"
      @submit="handleSearchSubmit"
      @reset="handleReset"
    >
      <template #submit-button>查询</template>
      <template #reset-button>重置</template>
    </SearchForm>

    <!-- 列表数据 -->
    <ElCard class="parse-list" title="数据列表">
      <!-- 表格 -->
      <ElTable
        class="rtu-table"
        :loading="loading"
        :columns="columns"
        :data="recordData.lists"
        :tableProps="{ showSelection: false, border: true }"
      >
      </ElTable>

      <!-- 分页 -->
      <ElPagination
        :currentPage="searchModel.page"
        :page-size="searchModel.limit"
        :total="recordData.total"
        @pagination-change="handleChangePage"
        @page-size-change="handleChangeSize"
      />
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.parse-list {
  margin-top: 24px;
}
</style>
