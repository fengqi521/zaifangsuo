<script setup>
import { ref, reactive, watch } from "vue";
import SearchForm from "@/components/SearchForm/index.vue";
import ElTable from "@/components/ElTable/index.vue";
import ElPagination from "@/components/ElPagination/index.vue";
import ListHead from "@/components/ListHead/index.vue";
import UserFormModal from "./components/UserFormModal/index.vue";
import ElModal from "@/components/ElModal/index.vue";
import Author from "./components/Author/index.vue";

import { userFormData, userFormItems } from "@/constants";
import userApi from "@/api/account";
import { useMessage } from "@/plugins/message";

const { success, error } = useMessage();

// 查询数据
const initialData = ref(userFormData);
const formItems = ref(userFormItems);

// table数据
const loading = ref(false);
const userData = ref([]);
const columns = ref([
  { prop: "id", label: "ID" },
  { prop: "user_name", label: "用户名" },
  { prop: "phone", label: "手机号" },
  // { prop: "email", label: "邮箱" },
  { prop: "devices", label: "已授权设备" },
  { prop: "create_time", label: "创建时间" },
]);

const searchModel = reactive({
  page: 1,
  limit: 10,
});
const total = ref(0);

// 选中数据
const currentRow = ref({});

//获取设备进行授权
const deviceOptions = reactive([]);
const getDeviceAuthList = async () => {
  const res = await userApi.getAuthList();
  if (!res.code) {
    Object.assign(
      deviceOptions,
      res.data.devices.map(({ device_name, id }) => ({
        label: device_name,
        value: id,
        key: id,
      }))
    );
  }
};
getDeviceAuthList();
// 获取用户列表
const getLists = async (page, limit) => {
  loading.value = true;
  Object.assign(searchModel, {
    ...(page && { page }),
    ...(limit && { limit }),
  });
  try {
    const result = await userApi.getUserList(searchModel);
    if (!result?.code) {
      userData.value = result.data.list;
      total.value = result.data.total_count;
    }
  } catch (error) {
    throw new Error(error);
  }
  loading.value = false;
};
getLists();

//-------------添加修改用户信息---------------
// 用户表单modal
const dialogVisible = ref(false);
const title = ref("");

// 添加、修改
const handleEdit = (row) => {
  currentRow.value = {};
  dialogVisible.value = true;
  if (!row) {
    title.value = "新建用户";
    return;
  }

  title.value = "修改用户";
  currentRow.value = row;
};

// 关闭弹窗
const handleClose = (val) => {
  dialogVisible.value = val;
  authorVisible.value = val;
};
//---------------设备授权----------
const transferValue = ref({ uid: "", did: [] });
const authorVisible = ref(false);
const updateTransferValue = (newVal) => {
  transferValue.value.did = newVal;
};
// 显示授权
const handleClickShowAuthor = (row) => {
  transferValue.value.did = [];
  transferValue.value.uid = row.id;
  authorVisible.value = true;
  transferValue.value.did = row.devices.map((item) => item.id);
};

// 授权
const handleClickAuthor = (values) => {
  userApi
    .updateUser({ ...transferValue.value, did: values.join(",") })
    .then((res) => {
      console.log(res);
    });
};

// ----------删除用户---------
const deleteModalStatus = ref(false);

// 点击删除
const handleDelete = (row) => {
  currentRow.value = row;
  deleteModalStatus.value = true;
};

// 确认删除
const handleConfirmDelete = () => {
  userApi.deleteUser({ uid: currentRow?.value?.id }).then((res) => {
    deleteModalStatus.value = false;
    if (!res.code) {
      success("删除成功");
      getLists(1);
      return;
    }

    error(res.message);
  });
};

// 关闭删除
const handleCloseDeleteModal = () => {
  deleteModalStatus.value = false;
  currentRow.value = {};
};
</script>
<template>
  <div>
    <ListHead title="用户列表">
      <el-button type="primary" @click="handleEdit()">新建用户</el-button>
    </ListHead>
    <SearchForm :formItems="formItems" :initialData="initialData" />

    <ElTable
      class="user-table"
      :loading="loading"
      :columns="columns"
      :data="userData"
      :tableProps="{ showSelection: false, border: true }"
    >
      <template #action="{ row }">
        <span class="btn author-btn" @click="handleClickShowAuthor(row)"
          >设备授权</span
        >
        <span class="btn update-btn" @click="handleEdit(row)">修改</span>
        <span class="btn delete-btn" @click="handleDelete(row)">删除</span>
      </template>
    </ElTable>
    <ElPagination
      :currentPage="searchModel.page"
      :page-size="searchModel.limit"
      :total="total"
      @pagination-change="(page, size) => getLists(page, size)"
      @page-size-change="(size) => getLists(searchModel.page, size)"
    />
    <UserFormModal
      :dialogVisible="dialogVisible"
      :title="title"
      :deviceOptions="deviceOptions"
      :currentRow="currentRow"
      @handle-close="handleClose"
      @get-list="getLists(1)"
    />

    <Author
      :dialogVisible="authorVisible"
      :deviceOptions="deviceOptions"
      :data="transferValue.did"
      @update:transfer-value="updateTransferValue"
      @handle-close="handleClose"
      @handle-submit="handleClickAuthor"
    />
    <ElModal
      class="message-box"
      title="删除确认"
      :dialogVisible="deleteModalStatus"
      @handle-close="handleCloseDeleteModal"
    >
      <template v-slot>
        <span class="delete-content"
          >确认要删除用户{{ currentRow.user_name }}吗？</span
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
.user-table {
  .btn {
    margin-inline: 4px;
    color: var(--normal-icon-text-color);
    cursor: pointer;
  }

  .delete-btn{
    color:var(--delete-text-color)
  }
}
.message-box {
  :deep(.el-dialog) {
    width: 420px;
  }

  .delete-content {
    color: var(--delete-text-color);
  }
}
</style>
