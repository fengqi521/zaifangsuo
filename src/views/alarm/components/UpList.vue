<script setup>
import { onMounted, reactive, ref } from "vue";
import ElCard from "@/components/ElCard/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import systemApi from "@/api";
import { alarm } from "@/constants";

// 查询数据
const initialData = { did: "" };
const formItems = ref([
  {
    label: "设备名称",
    prop: "did",
    attrs: { placeholder: "请选择设备名称",      filterable: true,style: { width: "240px" } },
    type: "el-select",
    options: [],
  },
]);
const deviceList = ref([]);
// 获取设备列表
const getDevice = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await systemApi.getAllDevice();
      resolve();
      if (!result?.code) {
        const lists = result.data.devices.map((item) => ({
          label: item.DeviceName,
          value: item.Id,
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
  { prop: "response", label: "上报报文" },
  { prop: "device_name", label: "设备名称" },
  { prop: "alarm_content", label: "播放内容" },
  { prop: "alarm_level", label: "报警等级", type: "slot" },
  { prop: "create_time", label: "上报时间" },
  { prop: "alarm_time", label: "报警时间" },
]);

// 获取下发记录
const getList = async () => {
  loading.value = true;
  const { page, limit } = searchInfo.value;
  const res = await systemApi.getUpList(searchInfo.value);
  if (!res.code) {
    const newTableData = res.data.list.map((item, index) => {
      return {
        ...item,
        num: (page - 1) * limit + (index + 1),
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
        <template #alarm_level="scope">
          <span class="rtu-table__device-type">
            {{ alarm.level[scope.row.alarm_level] || "--" }}
          </span>
        </template>
        <template #alarm_sound="scope">
          <span class="rtu-table__device-type">
            {{ alarm.sound[scope.row.alarm_sound] || "--" }}
          </span>
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
