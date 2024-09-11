<script setup>
import { reactive, ref, onUnmounted } from "vue";
import Bread from "@/components/Bread/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import ElModal from "@/components/ElModal/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import { userInfoStoreHook } from "@/store/modules/user";
import { useMessage } from "@/plugins/message";
import systemApi from "@/api";

import { projectFormData, deviceFormItems, deviceMap } from "@/constants";

const userStore = userInfoStoreHook();
userStore.getUserInfo();

const { success, error } = useMessage();
const breadList = ref([{ title: "设备管理" }]);
const formItems = reactive(deviceFormItems);

const searchInfo = ref({ ...projectFormData, page: 1, limit: 10 });
const loading = ref(false);
const rtuData = reactive({ data: [], total: 0 });
const columns = ref([
  { prop: "num", label: "序号", width: 80 },
  { prop: "addr", label: "设备编号" },
  { prop: "device_name", label: "设备名称" },
  { prop: "device_type", label: "设备类型", type: "slot" },
  { prop: "online", label: "在线状态", type: "slot" },
  {
    prop: "is_on_update",
    label: "升级状态",
    type: "slot",
    notShowTooltip: true,
    width: 180,
  },
  { prop: "online_last", label: "最后在线时间" },
]);
// 获取设备下拉
const getDeviceOption = () => {
  systemApi.getAllDevice().then((res) => {
    if (!res.code) {
      formItems[1].options = res.data.devices.map((item) => ({
        label: item.DeviceName,
        value: item.Id,
      }));
    }
  });
};

getDeviceOption();
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
    const upgradeDevice = rtuData.data.filter((item) => item.is_on_update);
    getDeviceUpgradeStatus(upgradeDevice);
  }
  loading.value = false;
};

getRtuData();

// 查询数据
const handleSearchSubmit = (data) => {
  Object.assign(rtuData, { data: [], total: 0 });
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

// 设置下发指令跳转
const setToPath = (row) => {
  const { online, device_name, device_type, id, is_on_update } = row;
  if (!is_on_update && !!online)
    return `/device/command/${device_name}/${device_type}/${id}`;
  return "";
};

const tooltipContent = (row) => {
  return !row.online ? "设备离线" : row.is_on_update ? "设备升级中" : "";
};

// 切换页数
const handleChangePage = (page) => {
  onUnmounted();
  searchInfo.value.page = page;
  getRtuData();
};

//切换条数
const handleChangeSize = (size) => {
  searchInfo.value.limit = size;
  getRtuData();
};

// 升级固件
const currentList = ref({});
const packageColumns = [
  { prop: "num", label: "序号", width: 80 },
  { prop: "upgrade_name", label: "固件名称" },
  { prop: "md5", label: "MD5" },
];
const packageData = ref([]);
const gid = ref(null);
const searchQuery = ref("");
let all = [];
// 获取固件包   //功能码16
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
const handleClickUpdate = (row) => {
  currentList.value = row;
  getPackageList();
};

// 搜索内容
const searchPackage = () => {
  const query = searchQuery.value.trim().toLowerCase();
  packageData.value = all.filter((item) =>
    item.upgrade_name.toLowerCase().includes(query)
  );
};

// 实时显示升级状态
const getDeviceUpgradeStatus = (lists) => {
  if (!lists.length) return;
  lists.forEach(async (list) => {
    intervalStatus(list);
  });
};

let timers = {};
// 实时请求升级状态
const intervalStatus = async (list) => {
  try {
    const timer = timers[list.id];
    const result = await systemApi.upgradeStatus({ id: list.upgrade_id });
    if (!result.code) {
      const { current, number } = result.data;
      const value = (current / number) * 100;
      list.process = Number.isInteger(value)
        ? Number(value.toFixed(0))
        : Number(value.toFixed(2));
      if (current === number) {
        setTimeout(() => (list.is_on_update = false), 2000);
        clearInterval(timer);
        return;
      }
    }
    if (timer) {
      clearInterval(timer);
    }
    timers[list.id] = setInterval(() => {
      intervalStatus(list);
    }, 6000);
  } catch (error) {
    console.log(error);
  }
};

onUnmounted(() => {
  const values = Object.values(timers);
  values.map((item) => clearInterval(item));
});

// 确认提交
const handleConfirmSelect = () => {
  // 调用升级接口，进行升级
  systemApi
    .upgradeDevice({ did: currentList.value.id, gid: gid.value })
    .then((res) => {
      if (!res.code) {
        getRtuData();
        return;
      }
      error(res.message);
    });
  currentList.value = {};
};

// 关闭
const handleCloseModal = () => {
  gid.value = null;
  currentList.value = {};
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
              'rtu-table__status--online': !!scope.row.online,
            }"
          ></span>
          <span
            :class="{
              'rtu-table__status-text': true,
              'rtu-table__status-text--online': !!scope.row.online,
            }"
          >
            {{ !!scope.row.online ? "在线" : "离线" }}
          </span>
        </template>
        <template #is_on_update="{ row }">
          <span
            v-if="!row.is_on_update"
            :class="{
              'rtu-table__status-text': true,
              'rtu-table__status-text--online': row.is_on_update,
            }"
          >
            {{ row.is_on_update ? "升级中" : "--" }}
          </span>
          <el-progress
            v-else
            :percentage="row.process"
            :stroke-width="6"
            striped
            striped-flow
            :duration="1"
          />
        </template>
        <template #action="{ row }">
          <router-link
            class="rtu-table__action-btn rtu-table__action-btn--details"
            :to="`/device/detail/${row.device_type}/${row.id}`"
          >
            查看详情
          </router-link>

          <el-tooltip
            :content="tooltipContent(row)"
            :disabled="!row.is_on_update && !!row.online"
            placement="top"
          >
            <router-link
              v-if="
                userStore?.userInfo?.role !== '' &&
                userStore?.userInfo?.role !== 5
              "
              :class="[
                'rtu-table__action-btn rtu-table__action-btn--command',
                { 'disabled-link': row.is_on_update || !row.online },
              ]"
              :to="setToPath(row)"
            >
              下发指令</router-link
            >
          </el-tooltip>
          <el-tooltip
            :content="tooltipContent(row)"
            :disabled="!row.is_on_update && !!row.online"
            placement="top"
          >
            <span
              :class="[
                'rtu-table__action-btn',
                { 'disabled-link': row.is_on_update || !row.online },
              ]"
              @click="
                !row.is_on_update && !!row.online && handleClickUpdate(row)
              "
              v-if="
                userStore?.userInfo?.role !== '' &&
                userStore?.userInfo?.role !== 5
              "
              >设备升级</span
            >
          </el-tooltip>
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
      :dialogVisible="currentList.id > -1"
      @handle-close="handleCloseModal"
      width="660"
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
            <el-radio v-model="gid" :value="row.id"></el-radio>
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

  .disabled-link {
    color: var(--normal-disabled);
    cursor: not-allowed;
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
