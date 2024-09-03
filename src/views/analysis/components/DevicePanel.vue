<script setup>
import { reactive, ref, watch } from "vue";
import { remove } from "lodash";
import systemApi from "@/api";
const treeRef = ref(null);
const loading = ref(false);
const filterText = ref("");
const dataSource = reactive([
  {
    id: 1,
    label: "泥位计",
    children: [],
  },
  {
    id: 2,
    label: "雨量计",
    children: [],
  },

  {
    id: 3,
    label: "断线传感器",
    children: [],
  },
]);

// 获取设备列表
const getDeviceList = async () => {
  loading.value = true;
  let res = await systemApi.getDeviceList({
    device_type: 0,
    status: 2,
    limit: 10000,
  });

  if (!res.code) {
    const list = res.data.list;
    dataSource.forEach((item) => {
      const lists = list.filter((cur) => item.id === cur.device_type);
      item.children = lists.map((list, index) => ({
        id: `${item.id}-${index + 1}`,
        label: list.device_name,
        _id: list.id,
        type: list.device_type,
        name: list.device_name,
      }));
    });
    remove(dataSource, (item) => item.children.length === 0);
  }
  loading.value = false;
};

getDeviceList();

// 查询列表
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.includes(value);
};
watch(filterText, (val) => {
  treeRef.value?.filter(val);
});

const emit = defineEmits(["update:modelValue"]);

// 选择tree
const handleChangeTree = (nodeObj, data) => {
  const { checkedNodes } = data;
  emit("update:modelValue", {
    id: nodeObj._id,
    type: nodeObj.type,
    name: nodeObj.name,
  });
};
</script>
<template>
  <div class="panel-container">
    <p class="panel-title">设备列表</p>
    <el-input class="panel-input" v-model="filterText" placeholder="查询设备" />

    <el-tree
      ref="treeRef"
      class="panel-tree"
      :data="dataSource"
      node-key="id"
      default-expand-all
      :filter-node-method="filterNode"
      @node-click="handleChangeTree"
      @check="handleChangeTree"
    >
      <template #default="{ node, data }">
        <div class="span-ellipsis" :title="data.label">{{ data.label }}</div>
      </template>
    </el-tree>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
.panel-container {
  padding: 16px;
  border-radius: 3px;
  background: var(--background-color);
  height: 100%;
  .panel-title {
    font-weight: 700;
    font-size: 14px;
    color: #202938;
  }
}
.panel-input {
  margin: 16px 0;
}

.el-tree {
  height: calc(100% - 88px);
  overflow-y: auto;
  font-size: 12px;
  @extend %scrollbar;

  .span-ellipsis {
    @extend %ellipsis;
  }
}
:deep(.el-tree > .el-tree-node > .el-tree-node__content) {
  font-weight: bold;
}
:deep(.el-tree > .el-tree-node > .el-tree-node__content .el-checkbox) {
  display: none;
}
</style>
