<script setup>
import { onMounted, reactive, ref } from "vue";
import ElCard from "@/components/ElCard/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import systemApi from "@/api";

// 查询数据
const initialData = { did: "" };
const formItems = ref([
  {
    label: "设备名称",
    prop: "did",
    attrs: { placeholder: "请选择设备名称", style: { width: "240px" } },
    type: "el-select",
    options: [],
  },
]);
const deviceList = ref([]);
// 获取设备列表
const getDevice = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await systemApi.getDeviceList({
        status: 2,
        page: 1,
        limit: 10000,
      });
      resolve();
      if (!result?.code) {
        const lists = result.data.list.map((item) => ({
          label: item.device_name,
          value: item.id,
        }));
        deviceList.value = lists;
        formItems.value[0].options = lists;
      }
    } catch (error) {
      reject();
      throw new Error(error);
    }
  });
};

const searchInfo = ref({ ...initialData, page: 1, limit: 10 });
const loading = ref(false);
const rtuData = reactive({ data: [], total: 0 });
const columns = ref([
  { prop: "num", label: "序号", width: 80 },
  { prop: "request", label: "下发报文" },
  { prop: "device_name", label: "设备名称" },
  { prop: "content", label: "播放内容" },
  { prop: "way", label: "播放方式", type: "slot" },
  { prop: "create_time", label: "下发时间" },
  { prop: "alarm_time", label: "报警时间" },
]);

// 获取下发记录
const getList = async () => {
  loading.value = true;
  const { page, limit } = searchInfo.value;
  const res = await systemApi.getDownList(searchInfo.value);
  if (!res.code) {
    const newTableData = res.data.list.map((item, index) => {
      const list = deviceList.value.find((cur) => cur.value === item.device_id);
      return {
        ...item,
        num: (page - 1) * limit + (index + 1),
        device_name: list?.label,
      };
    });
    rtuData.data = [...newTableData];
    rtuData.total = res.data.total_count;
  }
  loading.value = false;
};

onMounted(async () => {
  await getDevice();
  await getList();
});

// 播放方式
const getWay = (way) => {
  if (way < 17) {
    return `单曲播放${way}次`;
  }
  if (way < 18) {
    return `循环播放`;
  }
  return "停止循环";
};

// 查询数据
const handleSearchSubmit = (data) => {
  Object.assign(rtuData, { data: [], total: 0 });
  searchInfo.value = { ...searchInfo.value, ...data };
  getList();
};

// 重置数据
const handleReset = () => {
  searchInfo.value = { ...searchInfo.value, ...initialData, page: 1 };
  getList();
};

// 切换页数
const handleChangePage = (page) => {
  searchInfo.value.page = page;
  getList();
};

//切换条数
const handleChangeSize = (size) => {
  searchInfo.value.limit = size;
  getList();
};
</script>
<template>
  <div>
    <!-- 查询 -->
    <SearchForm
      :initialData="searchInfo"
      :formItems="formItems"
      @submit="handleSearchSubmit"
      @reset="handleReset"
      ref="searchFormRef"
    />

    <ElCard title="报警列表">
      <!-- 表格 -->
      <ElTable
        class="rtu-table"
        :loading="loading"
        :columns="columns"
        :data="rtuData.data"
        :tableProps="{ showSelection: false, border: true }"
      >
        <template #way="scope">
          <span class="rtu-table__device-type">{{
            getWay(scope.row.way)
          }}</span>
        </template>
      </ElTable>

      <!-- 分页 -->
      <ElPagination
        :currentPage="searchInfo.page"
        :page-size="searchInfo.limit"
        :total="rtuData.total"
        @pagination-change="handleChangePage"
        @page-size-change="handleChangeSize"
      />
    </ElCard>
  </div>
</template>
