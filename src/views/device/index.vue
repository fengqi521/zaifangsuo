<script setup>
import { reactive, ref } from "vue";
import Bread from "@/components/Bread/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElModal from "@/components/ElModal/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import { isOnLine } from "@/utils";
import systemApi from "@/api";

import { projectFormData, deviceFormItems, deviceMap } from "@/constants";

const breadList = ref([{ title: "设备管理" }]);
const formItems = reactive(deviceFormItems);

const searchInfo = ref({ ...projectFormData, page: 1, limit: 10 });
const loading = ref(false);
const rtuData = reactive({ data: [], total: 0 });
const columns = ref([
  { prop: "num", label: "序号", width: 80 },
  { prop: "device_number", label: "设备编号" },
  { prop: "device_name", label: "设备名称" },
  { prop: "device_type", label: "设备类型" ,type:'slot'},
  { prop: "online", label: "在线状态" ,type:'slot'},
  { prop: "create_time", label: "最后在线时间" }

]);
// 获取设备数据
const getRtuData = async () => {
  loading.value = true;
  const { page, limit } = searchInfo.value;
  const res = await systemApi.getDeviceList(searchInfo.value);
  if (!res.code) {
    const newTableData = res.data.list.map((item, index) => ({
      ...item,
      num: (page - 1) * limit + (index + 1),
    }));
    rtuData.data = [...newTableData];
    rtuData.total = res.data.total_count;
  }
  loading.value = false;
};

getRtuData();

// 查询数据
const handleSearchSubmit = (data) => {
  Object.assign(rtuData,{data:[],total:0})
  searchInfo.value = { ...searchInfo.value, ...data };
  getRtuData();
};

// 重置数据
const handleReset = () => {
  searchInfo.value = { ...searchInfo.value, ...projectFormData, page: 1 };
  getRtuData();
};

// 查询传感器类型
const getType = (type) => {
  const list = deviceMap.find(({ value }) => Number(type) === value);
  return list.label;
};

// 切换页数
const handleChangePage = (page) => {
  searchInfo.value.page = page;
  getRtuData();
};

//切换条数
const handleChangeSize = (size) => {
  searchInfo.value.limit = size;
  getRtuData();
};

// 升级固件
const show = ref(false);
const packageColumns = [
  { prop: "num", label: "序号", width: 80 },
  { prop: "upgrade_name", label: "固件名称" },
  { prop: "md5", label: "MD5" },
];
const packageData = ref([]);
const selectedId = ref(null);
const searchQuery = ref("");
let all = [];
// 获取固件包
const getPackageList = async () => {
  const result = await systemApi.getPackageList();
  if (!result?.code) {
    const lists = result.data.list.map((item, index) => ({
      ...item,
      num: index + 1,
    }));
    packageData.value = lists;
    all = lists;
  }
};
// 显示选择固件modal
const handleClickUpdate = () => {
  show.value = true;
  getPackageList();
};

// 搜索内容
const searchPackage = () => {
  const query = searchQuery.value.trim().toLowerCase();
  packageData.value = all.filter((item) =>
    item.upgrade_name.toLowerCase().includes(query)
  );
};

// 确认提交
const handleConfirmSelect = () => {
  show.value = false;
};

// 关闭
const handleCloseModal = () => {
  selectedId.value = null;
  show.value = false;
};
</script>

<template>
  <div>
    <Bread :breadList="breadList" />
    <!-- 查询 -->
    <SearchForm
      :initialData="searchInfo"
      :formItems="formItems"
      @submit="handleSearchSubmit"
      @reset="handleReset"
      ref="searchFormRef"
    />

    <ElCard title="设备列表">
      <!-- 表格 -->
      <ElTable
        class="rtu-table"
        :loading="loading"
        :columns="columns"
        :data="rtuData.data"
        :tableProps="{ showSelection: false, border: true }"
      >
        <template #device_type="scope">
          <span class="rtu-table__device-type">{{
            getType(scope.row.device_type)
          }}</span>
        </template>
        <template #online="scope">
          <span
            :class="{
              'rtu-table__status': true,
              'rtu-table__status--online': scope.row.online,
            }"
          ></span>
          <span
            :class="{
              'rtu-table__status-text': true,
              'rtu-table__status-text--online': scope.row.online,
            }"
          >
            {{ isOnLine(scope.row.online_last) ? "在线" : "离线" }}
          </span>
        </template>
        <template #action="{ row }">
          <router-link
            class="rtu-table__action-btn rtu-table__action-btn--details"
            :to="`/device/detail/${row.device_type}/${row.id}`"
          >
            查看详情
          </router-link>
          <router-link
            class="rtu-table__action-btn rtu-table__action-btn--command"
            :to="`/device/command/${row.device_name}/${row.device_type}/${row.id}`"
          >
            下发指令</router-link
          >
          <span class="rtu-table__action-btn" @click="handleClickUpdate"
            >设备升级</span
          >
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
    <ElModal
      class="update-modal"
      title="选择固件"
      :dialogVisible="show"
      @handle-close="handleCloseModal"
      width="560"
    >
      <template v-slot>
        <div class="update-modal__header">
          <el-input
            v-model="searchQuery"
            placeholder="请输入固件名称"
          ></el-input>
          <el-button type="primary" @click="searchPackage">搜索</el-button>
        </div>
        <ElTable
          :loading="loading"
          :columns="packageColumns"
          :data="packageData"
          :tableProps="{ showSelection: false, border: true }"
        >
          <template #action="{ row }">
            <el-radio v-model="selectedId" :value="row.id"></el-radio>
          </template>
        </ElTable>
      </template>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseModal">取消</el-button>
          <el-button type="primary" @click="handleConfirmSelect"
            >确认</el-button
          >
        </div>
      </template>
    </ElModal>
  </div>
</template>
<style lang="scss" scoped>
.rtu-table {
  .rtu-table__status {
    display: inline-flex;
    margin-right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    color: var(--offline-text-color);
    background: var(--offline-bg-color);
    border: 1px solid var(--offline-border-color);

    &--online {
      background: var(--online-bg-color);
      border-color: var(--online-border-color);
    }
  }

  .rtu-table__status-text {
    color: var(--offline-text-color);
    &--online {
      color: var(--online-bg-color);
    }
  }

  .rtu-table__action-btn {
    margin-inline: 4px;
    color: var(--normal-active-color);
    cursor: pointer;
    white-space: nowrap;
  }
}

.update-modal {
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px 0 24px;

    :deep(.el-input) {
      width: 260px;
      margin-right: 24px;
    }
  }
}
</style>
