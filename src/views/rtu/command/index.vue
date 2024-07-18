<script setup>
import { computed, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import Bread from "@/components/Bread/index.vue";
import ElCard from "@/components/ElCard/index.vue";
import Icon from "@/components/Icon.vue";
import { operateLists } from "@/constants";

const route = useRoute();
const { id, type } = route.params;

// 导航
const breadList = ref([
  { to: "/rtu", title: "设备管理" },
  { title: "指令下发" },
]);

const commandFormRef = ref(null)
const loading = ref(false);

const deviceName = ref('')
const unfold = ref(true);
const dateTimeRange = ref([]);
const showTimer = ref(false);
const showOther = ref(false);

const content = reactive({
  command: '',
  back: {},
});
const commonForm = {
  id,
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

};

// 表单
const commandForm = ref({ ...commonForm });

// 判断类型
const getTypeForm = () => {
  if (type === "1") {
    // 泥位
    commandForm.value = { ...commandForm.value, high:'',init: 0, report: 0 };
  }

  if (type === "2") {
    commandForm.value = {
      ...commandForm.value,
      cycle: 1,
      alarm: 0,
      duration: 1,
    };
  }
};
getTypeForm();

// 获取设备详情
const getDetail = () => {
  const res = {
    code: 0,
    data: {
      name: "lcjdevice003",
      frame_start: "7E7E",
      address: "11009001",
      reserve: "00",
      password: "10101",
      operate: "",
      version_length: "1002",
      start: "31",
      end: "110111",
      content: "32",
      crc: "ca27",
    },
  };

  if (!res.code) {
    const {name,...others} = res.data;
    deviceName.value = name;
    commandForm.value = {...commandForm.value ,...others};
  }
};
getDetail();

// 切换功能码
const handleChangeOperate = (val) => {
  switch (val) {
    case "38":
      return (showTimer.value = true);
    case "32":
    case "33":
      getTypeForm();
      return (showOther.value = true);
    default:
      showTimer.value = false;
      showOther.value = false;
      return;
  }
};

// 下发指令
const handleClickSubmit = async () => {
  loading.value = true;
  const valid = await commandFormRef.value.validate()
  if(valid){
    content.command  = JSON.stringify(commandForm.value)
  }
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>
<template>
  <div>
    <!-- 导航 -->
    <Bread :breadList="breadList" />

    <!-- 设备名称 -->
    <p class="command-name">{{ deviceName }}</p>

    <!-- 报文下发表单 -->
    <ElCard title="下发指令" class="form-card">
      <el-form :model="commandForm" label-width="auto" label-position="left" ref="commandFormRef">
        <div class="command-form__operate">
          <el-form-item label="功能码:" label-width="44">
            <el-select
              v-model="commandForm.operate"
              @change="handleChangeOperate"
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
            <Icon iconClass="icon-shaixuan toggle-icon" />
            <span class="command-form__toggle-label">{{
              unfold ? "收起" : "展开"
            }}</span>
          </div>
        </div>

        <div v-if="unfold" class="command-form__details">
          <el-form-item label="帧起始符:" label-width="56">
            <el-input
              v-model="commandForm.frame_start"
              style="width: 120px"
              disabled
            />
          </el-form-item>

          <el-form-item label="遥测站地址:" label-width="68">
            <el-input
              v-model="commandForm.address"
              style="width: 180px"
              disabled
            />
          </el-form-item>

          <el-form-item label="预留位:" label-width="44">
            <el-input
              v-model="commandForm.reserve"
              style="width: 120px"
              disabled
            />
          </el-form-item>
          <el-form-item label="密码:" label-width="32">
            <el-input
              v-model="commandForm.password"
              style="width: 200px"
              disabled
            />
          </el-form-item>

          <el-form-item
            label="版本号及长度:"
            label-width="80"
            v-if="!showTimer"
          >
            <el-input
              v-model="commandForm.version_length"
              style="width: 120px"
              disabled
            />
          </el-form-item>

          <el-form-item label="报文起始符:" label-width="68" v-if="!showTimer">
            <el-input
              v-model="commandForm.start"
              style="width: 120px"
              disabled
            />
          </el-form-item>

          <el-form-item label="报文结束符:" label-width="68" v-if="!showTimer">
            <el-input v-model="commandForm.end" style="width: 120px" disabled />
          </el-form-item>
          <el-form-item label="校验码:" label-width="44" v-if="!showTimer">
            <el-input v-model="commandForm.crc" style="width: 200px" disabled />
          </el-form-item>

          <el-form-item label="时间段:" label-width="44" v-if="showTimer">
            <el-date-picker
              v-model="dateTimeRange"
              type="datetimerange"
              range-separator="至"
              style="width: 355px"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>

          <!-- 雨量计 -->
          <el-form-item
            label="加报周期:"
            label-width="56"
            v-if="type === '2' && showOther"
          >
            <el-input-number
              v-model="commandForm.cycle"
              :min="1"
              :max="255"
              controls-position="right"
            />
          </el-form-item>

          <el-form-item
            label="报警阈值:"
            label-width="56"
            v-if="type === '2' && showOther"
          >
            <el-input-number
              v-model="commandForm.alarm"
              :min="1"
              :max="6553.5"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item
            label="报警阈值时长:"
            label-width="80"
            v-if="type === '2' && showOther"
          >
            <el-input-number
              v-model="commandForm.duration"
              :min="1"
              :max="255"
              controls-position="right"
            />
          </el-form-item>

          <!-- 泥位计 -->
          <el-form-item
            label="安装高度:"
            label-width="56"
            v-if="type === '1' && showOther"
          >
            <el-input-number
              v-model="commandForm.high"
              :min="0"
              :max="65.535"
              controls-position="right"
            />
          </el-form-item>

          <el-form-item
            label="初始值:"
            label-width="44"
            v-if="type === '1' && showOther"
          >
            <el-input-number
              v-model="commandForm.init"
              :min="0"
              :max="65.535"
              controls-position="right"
            />
          </el-form-item>

          <el-form-item
            label="加报阈值:"
            label-width="56"
            v-if="type === '1' && showOther"
          >
            <el-input-number
              v-model="commandForm.report"
              :min="0.001"
              :max="65.535"
              controls-position="right"
            />
          </el-form-item>
        </div>

        <el-form-item label="" class="command-form__btn">
          <el-button type="primary" :disabled="!commandForm.operate" @click="handleClickSubmit"
            >下发指令</el-button
          >
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </ElCard>

    <!-- 下发内容和反馈内容 -->
    <ElCard title="下发内容" class="feedback-card" >
      <el-empty v-if="!content.command.length" :image-size="80" />
       <p v-else class="feedback-card__command">{{ content.command }}</p>
    </ElCard>

     <!-- 反馈内容 -->
     <ElCard title="反馈内容" class="feedback-card" v-loading="loading">
      <el-empty v-if="!Object.keys(content.back).length":image-size="80" />
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.command-name {
  padding-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #666;
  line-height: 20px;
}
.form-card {
  .command-form__operate {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .command-form__toggle {
      line-height: 30px;
      margin-bottom: 18px;
      color: var(--btn-bg-color);
      cursor: pointer;
      user-select: none;
    }
    .toggle-icon {
      vertical-align: middle;
      color: var(--btn-bg-color) !important;
    }
    .command-form__toggle-label {
      margin-left: 8px;
    }
  }

  .command-form__details {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      margin-right: 16px;
    }
  }

  .command-form__btn {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    padding-right: 4px;
  }
}

.feedback-card {
  margin-top: 24px;

  &__command{
  padding: 16px;
  line-height:24px;
  color: var(--normal-title-color);
  background: var(--card-detail-bg-color);
  word-break:break-all;
  }
}
</style>
