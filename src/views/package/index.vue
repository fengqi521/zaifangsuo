<script setup>
import { ref, reactive } from "vue";
import ElCard from "@/components/ElCard/index.vue";
import ElModal from "@/components/ElModal/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import Bread from "@/components/Bread/index.vue";
import Upload from "./components/Upload.vue";

import { userInfoStoreHook } from "@/store/modules/user";

import { userFormData, userFormItems } from "@/constants";
import { useMessage } from "@/plugins/message";
import { formatSize } from "@/utils";
import systemApi from "@/api";

const userStore  = userInfoStoreHook()
const { success,error } = useMessage();
userStore.getUserInfo()

const isRead = userStore.userInfo?.role===5

// 查询数据
const initialData = ref(userFormData);
const formItems = ref(userFormItems);

// table数据
const loading = ref(false);
const packageData = ref([]);
const columns = ref([
  { prop: "id", label: "ID", width: 40 },
  { prop: "upgrade_name", label: "固件名称" },
  { prop: "url", label: "固件地址",width:300},
  { prop: "size", label: "固件大小" },
  { prop: "upgrade_desc", label: "固件描述" },
  { prop: "md5", label: "MD5"},
]);

const initSearchData = {
  page: 1,
  limit: 10,
};
const searchModel = ref({ ...initSearchData });
const total = ref(0);
// 获取固件包列表
const getPackageList = async () => {
  loading.value = true;
  try {
    const result = await systemApi.getPackageList(searchModel.value);
    if (!result?.code) {
      packageData.value = result.data.list.map((item) => ({
        ...item,
        size: formatSize(item.upgrade_size),
      }));
    }
  } catch (error) {
    throw new Error(error);
  }
  loading.value = false;
};
getPackageList();

// 查询数据
const handleSearch = (values) => {
  Object.assign(searchModel.value, values);
  getPackageList();
};

// 重置
const handleReset = () => {
  searchModel.value = { ...initSearchData };
  getPackageList();
};

// 上传固件
const dialogVisible = ref(false);
const fileRef = ref(null);
const firmware = reactive({
  desc: "",
  fileList: [],
});
const fileFormRules = reactive({
  fileList: [
    {
      required: true,
      message: "请上传固件包",
      trigger: "change",
    },
  ],
});
// 显示上传modal
const handleClickShowModal = () => {
  Object.assign(firmware, { desc: "", fileList: [] });
  dialogVisible.value = true;
};

// 更新文件列表
const updateFileList = (lists) => {
  firmware.fileList = [...lists];
};

// 提交数据
const handleSubmit = async () => {
  try {
    // 验证文件
    const valid = await fileRef.value.validate();
    if (!valid) return;

    // 创建 FormData 对象
    const { file } = firmware.fileList[0];
    const formData = new FormData();
    formData.append("desc", firmware.desc);
    formData.append("file", file);

    // 发送 POST 请求
    const response = await systemApi.postPackage(formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // 处理响应
    if (response.code === 0) {
      success("上传成功");
      dialogVisible.value = false;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 延迟
      await getPackageList(); // 获取包列表
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
  firmware.fileList = [];
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
  const res = await systemApi.deletePackage({ id: curRow.value.id });
  if (res.code === 0) {
    success("删除成功");
    deleteShow.value = false;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await getPackageList();
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
    <Bread :breadList="[{ title: '固件管理' }]"> </Bread>
    <!-- <SearchForm
      :formItems="formItems"
      :initialData="initialData"
      @submit="handleSearch"
      @reset="handleReset"
    /> -->
    <ElCard title="固件列表">
      <template v-slot:actions v-if="!isRead">
        <el-button type="primary" @click="handleClickShowModal"
          >上传固件</el-button
        >
      </template>
      <ElTable
        class="package-table"
        :loading="loading"
        :columns="columns"
        :data="packageData"
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
        :total="total"
        @pagination-change="(page, size) => getLists(page, size)"
        @page-size-change="(size) => getLists(searchModel.page, size)"
      />
    </ElCard>
    <ElModal
      class="file-modal"
      title="上传固件"
      :dialogVisible="dialogVisible"
      @handle-close="handleClose"
      width="500"
    >
      <template v-slot>
        <el-form :model="firmware" ref="fileRef" :rules="fileFormRules">
          <el-form-item label="固件描述" prop="desc">
            <el-input
              type="textarea"
              v-model="firmware.desc"
              maxlength="128"
              placeholder="可填写描述信息，最长128字符"
            />
          </el-form-item>
          <el-form-item label="选择文件" prop="fileList">
            <Upload v-model="firmware.fileList" @change="updateFileList">
              <template v-slot:action
                ><el-button type="primary">浏览</el-button></template
              >
            </Upload>
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
          >确认要删除{{ curRow.upgrade_name }}固件包吗？</span
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
