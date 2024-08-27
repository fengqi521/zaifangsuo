<script setup>
import { reactive, ref, watch } from "vue";
import systemApi from "@/api";
const treeRef = ref(null);
const loading = ref(false);
const filterText = ref("");
const dataSource = reactive([
  {
    id: 1,
    label: "泥位计",
  },
  {
    id: 2,
    label: "雨量计",
  },

  {
    id: 3,
    label: "断线传感器",
  },
]);

// 获取设备列表
const getDeviceList = async () => {
  loading.value = true;
  const res = await systemApi.getDeviceList({
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
      }));
    });
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

// 设置节点类名
const treeNodeClass = (data, node) => {
  return node.isLeaf ? "child-node" : "parent-node";
};

// 选择tree
const handleChangeTree = (nodeObj, data) => {
  const { checkedNodes } = data;
  //   const nodes = checkedNodes.filter((item) => item.children);
  //   const selectNodes = nodes.flatMap((item) => item.children);

  emit("update:modelValue", { id: nodeObj._id, type: nodeObj.type });
};
</script>
<template>
  <div class="panel-container">
    <p class="panel-title">设备列表</p>
    <el-input class="panel-input" v-model="filterText" placeholder="查询设备" />

    <el-tree
      ref="treeRef"
      class="panel-tree"
      :props="{ class: treeNodeClass }"
      :data="dataSource"
      node-key="id"
      show-checkbox
      default-expand-all
      :filter-node-method="filterNode"
      @check="handleChangeTree"
    />
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/tools.scss";
.panel-container {
  padding: 16px;
  border-radius: 3px;
  background: var(--background-color);
  .panel-title {
    font-weight: 700;
    font-size: 14px;
    color: #202938;
  }
}
.panel-input {
  margin: 16px 0;
}
.panel-tree {
  height: calc(100% - 88px);
  overflow-y: auto;
}

// .parent-node {
//   font-weight: bold;
//   color: blue;
// }

.child-node {
  .el-tree-node__label {
    color: green;
  }
}
</style>
