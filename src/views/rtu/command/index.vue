<script setup>
import { computed, ref, reactive } from "vue";
import Bread from "@/components/Bread/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import SearchForm from "@/components/SearchForm/index.vue";
import Icon from "@/components/Icon.vue";
import { operateLists } from "@/constants";
// 导航
const breadList = ref([
  { to: "/rtu", title: "设备管理" },
  { title: "指令下发" },
]);

const unfold = ref(true);
const content = reactive({
  command: {},
  back: {},
});
// 表单
const commandForm = ref({
  frame_start: "",
  address: "",
  reserve: "",
  password: "",
  operate: "",
  version_length: "",
  start: "",
  end: "",
  content: "",
  crc: "",
});
const isHaveContent = computed(() => {
  return (
    Object.keys(content.command).length && Object.keys(content.back).length
  );
});
// 下发指令
const handleClickSubmit = () => {};
</script>
<template>
  <div>
    <!-- 导航 -->
    <Bread :breadList="breadList" />
    <!-- 报文下发表单 -->
    <ElCard title="下发指令">
      <el-form :model="commandForm" label-width="auto">
        <div class="command-form__operate">
          <el-form-item label="功能码:">
            <el-select
              v-model="commandForm.operate"
              placeholder="功能码"
              style="width: 250px"
            >
              <el-option
                v-for="(operate, index) in operateLists"
                :key="index"
                :label="operate.label"
                :value="operate.type"
              />
            </el-select>
          </el-form-item>
          <div class="command-form__toggle" @click="unfold = !unfold">
            <Icon iconClass="icon-shaixuan" />
            <span class="command-form__toggle-label">{{
              unfold ? "收起" : "展开"
            }}</span>
          </div>
        </div>

        <div v-if="unfold">
          <el-form-item label="帧起始符:">
            <el-input v-model="commandForm.frame_start" style="width: 120px" />
          </el-form-item>

          <el-form-item label="遥测站地址:">
            <el-input v-model="commandForm.address" style="width: 180px" />
          </el-form-item>

          <el-form-item label="预留位:">
            <el-input v-model="commandForm.reserve" style="width: 120px" />
          </el-form-item>
          <el-form-item label="密码:">
            <el-input v-model="commandForm.password" style="width: 200px" />
          </el-form-item>

          <el-form-item label="版本号及长度:">
            <el-input
              v-model="commandForm.version_length"
              style="width: 120px"
            />
          </el-form-item>

          <el-form-item label="报文起始符:">
            <el-input v-model="commandForm.start" style="width: 120px" />
          </el-form-item>

          <el-form-item label="报文结束符:">
            <el-input v-model="commandForm.end" style="width: 120px" />
          </el-form-item>
          <el-form-item label="校验码:">
            <el-input v-model="commandForm.crc" style="width: 200px" />
          </el-form-item>
        </div>

        <el-form-item label="">
          <el-button type="primary" @click="handleClickSubmit"
            >下发指令</el-button
          >
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </ElCard>
    <!-- 下发内容和反馈内容 -->
    <ElCard title="下发内容和反馈" class="feedback-card">
      <el-empty v-if="!isHaveContent" :image-size="80" />
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.command-form__operate {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .command-form__toggle {
    cursor: pointer;
    user-select: none;
  }
  .command-form__toggle-label {
    margin-left: 8px;
  }
}

.feedback-card {
  margin-top: 24px;
}
</style>
