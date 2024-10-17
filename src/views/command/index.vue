<script setup>
import { reactive, ref } from "vue";
import Bread from "@/components/Bread/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import systemApi from "@/api";

import {
  recordFormData,
  recordFormItems,
  recordOptions,
  deviceMap,
} from "@/constants";

const breadList = ref([{ title: "下发记录" }]);
const loading = ref(false);

// 初始查询数据
const initParams = {
  ...recordFormData,
  StartTime: "",
  EndTime: "",
};
const searchModel = ref({
  ...initParams,
  page: 1,
  limit: 20,
});

// 查询字段
const recordItems = reactive(recordFormItems);

// 表格头部
const columns = ref([
  { prop: "num", label: "序号", width: 80 },
  { prop: "device_name", label: "设备名称" },
  { prop: "type_name", label: "设备类型", width: 150 },
  { prop: "operate_type", label: "操作类型", width: 180 },
  { prop: "transfer_name", label: "传输类型", width: 100 },
  { prop: "response", label: "报文内容", type: "slot" },
  { prop: "create_time", label: "上报时间", width: 200 },
]);
// 表格数据
const recordData = reactive({ lists: [], total: 0 });

// 获取设备列表
const getDevice = async () => {
  try {
    const res = await systemApi.getAllDevice();
    if (!res.code) {
      const list = recordItems.find((item) => item.prop === "Did");
      if (list) {
        list.options = res.data.devices.map((item) => ({
          label: item.DeviceName,
          value: item.Id,
        }));
      }
    }
  } catch (error) {
    console.error("获取设备列表失败", error);
  }
};

// 获取历史记录
const getRecord = async () => {
  try {
    loading.value = true;
    const res = await systemApi.getRecord(searchModel.value);
    const { page, limit } = searchModel.value;
    loading.value = false;
    if (!res.code) {
      recordData.lists = (res?.data?.list ?? []).map((item, index) => {
        const list = recordOptions.find((cur) => cur.value == item.operate);
        const device_list = deviceMap.find(
          ({ value }) => Number(item.device_type) === value
        );
        item.operate_type = list ? list.label : "";
        item.transfer_name = item.transfer_type === 1 ? "上行" : "下行";
        item.response = item.transfer_type === 1 ? item.response : item.request;
        item.num = (page - 1) * limit + (index + 1);
        item.type_name = device_list?.label;
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
  searchModel.value.page = 1;
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
  searchModel.value.page = 1;
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
    <ElCard class="command-list" title="数据列表">
      <!-- 表格 -->
      <ElTable
        class="command-table"
        :loading="loading"
        :columns="columns"
        :data="recordData.lists"
        :tableProps="{ showSelection: false, border: true }"
      >
        <template #response="scope">
          <span v-if="scope.row.operate === 13">{{ scope.row.response }}</span>
          <router-link
            v-else
            class="cell-item command-table__response"
            :to="`/command/parser/${scope.row.id}/${scope.row.device_type}`"
          >
            {{ scope.row.response }}
          </router-link>
        </template>
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
.command-table {
  &__response {
    color: #1089ff;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
