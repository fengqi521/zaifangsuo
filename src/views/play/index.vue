<script setup>
import { ref, reactive } from "vue";
import ElCard from "@/components/ElCard/index.vue";
import ElModal from "@/components/ElModal/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import Bread from "@/components/Bread/index.vue";

import { userInfoStoreHook } from "@/store/modules/user";

import { useMessage } from "@/plugins/message";
import systemApi from "@/api";

const userStore = userInfoStoreHook()
userStore.getUserInfo()

const { success, error } = useMessage();

const isRead = userStore.userInfo?.role===5

// 查询数据
const initialData = { did: "" };
const formItems = ref([
  {
    label: "设备名称",
    prop: "did",
    attrs: { placeholder: "请选择绑定设备",style:{width:'240px'} },
    type: "el-select",
    options: [],
  },
]);

// table数据
const loading = ref(false);
const alarmData = reactive({ total: 0, data: [] });
const columns = ref([
  { prop: "id", label: "ID", width: 40 },
  { prop: "content", label: "播放内容" },
  { prop: "device_name", label: "绑定设备" },
  { prop: "user_name", label: "操作用户" },
]);

const initSearchData = {
  page: 1,
  limit: 10,
  ...initialData,
};
const searchModel = ref({ ...initSearchData });
const deviceList = ref([]);
// 获取设备列表
const getDevice = async () => {
  try {
    const result = await systemApi.getDeviceList({
      status: 2,
      page: 1,
      limit: 10000,
    });
    if (!result?.code) {
      const lists = result.data.list.map((item) => ({
        label: item.device_name,
        value: item.id,
      }));
      deviceList.value = lists;
      formItems.value[0].options = lists;
    }
  } catch (error) {
    throw new Error(error);
  }
};
getDevice();
// 获取列表
const getList = async () => {
  loading.value = true;
  try {
    const result = await systemApi.getAlarmContentList(searchModel.value);
    if (!result?.code) {
      alarmData.data = result.data.list;
      alarmData.total = result.data.total_count;
    }
  } catch (error) {
    throw new Error(error);
  }
  loading.value = false;
};
getList();

// 查询数据
const handleSearch = (values) => {
  Object.assign(searchModel.value, values);
  getList();
};

// 重置
const handleReset = () => {
  searchModel.value = { ...initSearchData };
  getList();
};

const dialogVisible = ref(false);
const alarmInfo = ref({
  content: "",
  did: "",
});
const alarmRef = ref(null);
const alarmFormRules = {
  content: [
    {
      required: true,
      message: "请输入播放内容",
      trigger: "change",
    },
  ],
  did: [
    {
      required: true,
      message: "请选择绑定设备",
      trigger: "change",
    },
  ],
};

// 显示新建
const handleClickShowModal = () => {
  dialogVisible.value = true;
};

// 提交数据
const handleSubmit = async () => {
  try {
    // 验证文件
    const valid = await alarmRef.value.validate();
    if (!valid) return;
    const response = await systemApi.createAlarm(alarmInfo.value);

    // 处理响应
    if (response.code === 0) {
      success("上传成功");
      dialogVisible.value = false;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 延迟
      await getList(); // 获取包列表
    } else {
      error(response.message);
    }
  } catch (err) {
    // 处理错误
    // error("上传失败，请稍后再试");
    console.error(err); // 可以在控制台输出详细错误信息
  }
};

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
  alarmInfo.value.content = "";
  alarmInfo.value.did = "";
};

const deleteShow = ref(false);
const curRow = ref({});
// 删除
const handleDelete = (row) => {
  curRow.value = row;
  deleteShow.value = true;
};

// 确认删除
const handleConfirmDelete = async () => {
  if (!curRow.value.id) return;
  const res = await systemApi.removeAlarm({ id: curRow.value.id });
  if (res.code === 0) {
    success("删除成功");
    deleteShow.value = false;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await getList();
  } else {
    error(res.message);
  }
};

// 关闭删除
const handleCloseDeleteModal = () => {
  deleteShow.value = false;
  curRow.value = {};
};
</script>
<template>
  <div class="user-container">
    <Bread :breadList="[{ title: '播放内容管理' }]"> </Bread>
    <SearchForm
      :formItems="formItems"
      :initialData="initialData"
      @submit="handleSearch"
      @reset="handleReset"
    />
    <ElCard title="内容列表">
      <template v-slot:actions v-if="!isRead">
        <el-button type="primary" @click="handleClickShowModal"
          >新建报警播放内容</el-button
        >
      </template>
      <ElTable
        class="package-table"
        :loading="loading"
        :columns="columns"
        :data="alarmData.data"
        :tableProps="{ showSelection: false, border: true }"
      >
        <template #action="{ row }" v-if="!isRead">
          <span
            class="package-table__action-btn delete-btn"
            @click="handleDelete(row)"
            >删除</span
          >
        </template>
      </ElTable>
      <ElPagination
        :currentPage="searchModel.page"
        :page-size="searchModel.limit"
        :total="alarmData.total"
        @pagination-change="(page, size) => getLists(page, size)"
        @page-size-change="(size) => getLists(searchModel.page, size)"
      />
    </ElCard>
    <ElModal
      class="file-modal"
      title="新建报警播放内容"
      :dialogVisible="dialogVisible"
      @handle-close="handleClose"
      width="340"
    >
      <template v-slot>
        <el-form :model="alarmInfo" ref="alarmRef" :rules="alarmFormRules">
          <el-form-item label="绑定设备" prop="did">
            <el-select-v2
              v-model="alarmInfo.did"
              filterable
              :options="deviceList"
              placeholder="选择绑定设备"
            />
          </el-form-item>
          <el-form-item label="播放内容" prop="content">
            <el-input
              type="textarea"
              v-model="alarmInfo.content"
              maxlength="128"
              placeholder="可填写播放内容，最长400字符"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </div>
      </template>
    </ElModal>
    <ElModal
      class="delete-modal"
      title="删除确认"
      :dialogVisible="deleteShow"
      @handle-close="handleCloseDeleteModal"
      width="340"
    >
      <template v-slot>
        <span class="delete-content"
          >确认要删除id为{{ curRow.id }}的报警播放内容吗？</span
        >
      </template>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDeleteModal">取消</el-button>
          <el-button type="danger" @click="handleConfirmDelete">确认</el-button>
        </div>
      </template>
    </ElModal>
  </div>
</template>
<style lang="scss" scoped>
.package-table {
  .delete-btn {
    color: var(--delete-text-color);
    cursor: pointer;
  }
}
.file-modal {
  :deep(.el-form-item__label) {
    height: 24px;
    line-height: 24px;
    min-width: 68px;
  }

  :deep(.el-textarea__inner) {
    height: 120px;
  }
}

.delete-modal {
  .delete-content {
    color: var(--delete-text-color);
  }
}
</style>
