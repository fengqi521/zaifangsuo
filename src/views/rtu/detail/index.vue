<script setup>
import { ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Bread from "@/components/Bread/index.vue";
import { useRtuStoreHook } from "@/store/modules/rtu";
import {
  BaseInfo,
  MudHistory,
  RainHistory,
  BreakHistory,
  Work,
} from "../components";

const useRtuStore = useRtuStoreHook();
const route = useRoute();

const { id, type } = route.params;
const active = ref("day");

const mudRef = ref(null);
const rainRef = ref(null);
const breakRef = ref(null);
const workRef = ref(null);

const componentLists = [
  {
    type: 1,
    component: MudHistory,
  },
  { type: 2, component: RainHistory },
];
const currentComponent = computed(() => {
  const list = componentLists.find((item) => item.type == type);
  return list?.component ?? null;
});
const currentComponentRef = computed(() => {
  switch (type) {
    case "1":
      return mudRef;
    case "2":
      return rainRef;
    case "3":
      return breakRef;
    default:
      return null;
  }
});
// 导航
const breadList = ref([
  { to: "/rtu", title: "设备管理" },
  { title: "设备详情" },
]);

// 通过id获取详情
const detail = ref({});
const getDetailById = () => {
  const res =
    type == 2
      ? {
          code: 0,
          status: true,
          msg: "OK",
          pageNo: null,
          pageSize: null,
          total: null,
          data: {
            id: "bb1e7688-8472-44cf-82cc-bf26d2510609",
            name: "lcjdevice003",
            createtime: "2024-06-26 10:16:49",
            lastupdate: null,
            no: null,
            useby: null,
            usedept: null,
            lat: 40.455,
            lng: 115.96,
            productid: null,
            cusno: "6600000025",
            thingprojid: null,
            projectinnerid: null,
            thinglistid: null,
            heartcode: null,
            token: "XMooTK7CKvGGLwlrcDmE",
            tokenlen: null,
            virtualid: null,
            simtype: null,
            simnumber: null,
            producefactoryid: null,
            productfactoryname: null,
            other: "1",
            simopentime: null,
            simduetime: null,
            simupdatetime: null,
            devicestatus: null,
            addvcd: null,
            addvcdname: null,
            address: null,
            manageuserid: null,
            managerusername: null,
            devicecount: null,
            productname: null,
            comprojectid: null,
            comprojectname: null,
            deviceimageid: null,
            moditime: "2024-07-16 15:15:06",
            intervalue: 6,
            transferstatus: null,
            devicetypeid: "0fba3288-02a0-4aa4-b39a-4103a0b023e8",
            devicetypename: "智能采集器",
            batchid: null,
            batchname: null,
            devicerecord: null,
            expiretime: null,
            order: null,
            pid: null,
            tfflag: null,
            tlflag: null,
            coltime: null,
            devicemodel: null,
            purchasetime: null,
            purchasecompany: null,
            deviceparam: null,
            type: null,
            managephone: null,
            buildunit: null,
            eletype: null,
            comtype: null,
            simcompany: null,
            constructionunit: null,
            tags: 1048609,
            clientid: "Gxhy_MXBL1pISdKX8Tni5",
            username: "Gxhy_MXBL1pISdKX8Tni5",
            apikey: null,
            sensor: null,
            protocol: 3,
            network: null,
            monitortype: null,
            sensornumber: null,
            devicetype: null,
            indicatorId: null,
            online: null,
            elementmr: null,
            deviceCategory: null,
            enDeviceType: null,
            eui: "88VM4I8WLEBDHZ8T6O7M",
            sensors: null,
            createUserId: 109,
            groupName: null,
            groupId: null,
          },
          hasNext: false,
          hasPrevious: false,
        }
      : {
          code: 0,
          status: true,
          msg: "OK",
          pageNo: null,
          pageSize: null,
          total: null,
          data: {
            id: "6a725606-0c89-4e0e-bbb6-1f977ce6c785",
            name: "lcjdevice001",
            createtime: "2024-06-26 10:16:38",
            status: 0,
            lastupdate: null,
            no: null,
            useby: null,
            usedept: null,
            lat: 40.455,
            lng: 115.96,
            productid: null,
            cusno: "6600004572",
            thingprojid: null,
            projectinnerid: null,
            thinglistid: null,
            heartcode: null,
            token: "eWhV_C7y18BSTU6zTJqA",
            tokenlen: null,
            virtualid: null,
            simtype: null,
            simnumber: null,
            producefactoryid: null,
            productfactoryname: null,
            other: "1",
            simopentime: null,
            simduetime: null,
            simupdatetime: null,
            devicestatus: null,
            addvcd: null,
            addvcdname: null,
            address: null,
            manageuserid: null,
            managerusername: null,
            devicecount: null,
            productname: null,
            comprojectid: null,
            comprojectname: null,
            deviceimageid: null,
            moditime: "2024-07-15 08:20:07",
            intervalue: 6,
            transferstatus: null,
            devicetypeid: "0fba3288-02a0-4aa4-b39a-4103a0b023e8",
            devicetypename: "智能采集器",
            batchid: null,
            batchname: null,
            devicerecord: null,
            expiretime: null,
            order: null,
            pid: null,
            tfflag: null,
            tlflag: null,
            coltime: null,
            devicemodel: null,
            purchasetime: null,
            purchasecompany: null,
            deviceparam: null,
            type: null,
            managephone: null,
            buildunit: null,
            eletype: null,
            comtype: null,
            simcompany: null,
            constructionunit: null,
            tags: 96,
            clientid: "Gxhy_b3NifG-VPaa5-PXK",
            username: "Gxhy_b3NifG-VPaa5-PXK",
            apikey: null,
            sensor: null,
            protocol: 3,
            network: null,
            monitortype: null,
            sensornumber: null,
            devicetype: null,
            indicatorId: null,
            online: null,
            elementmr: null,
            deviceCategory: null,
            enDeviceType: null,
            eui: "T4OW1YFBBF9P83XF8JVG",
            sensors: null,
            createUserId: 109,
            groupName: null,
            groupId: null,
          },
          hasNext: false,
          hasPrevious: false,
        };

  if (!res.code) {
    detail.value = res.data;
  }
};
getDetailById();

watchEffect(() => {
  useRtuStore.setDateRange(active.value);
});

const dateRange = computed({
  get: () => useRtuStore.dateTimeRange,
  set: (newValue) => {
    useRtuStore.setDateRange(newValue, true);
  },
});
</script>

<template>
  <div class="detail-data">
    <Bread :breadList="breadList" />
    <BaseInfo :detail="detail" />
    <div class="detail-data__content">
      <div class="detail-data__actions">
        <el-radio-group v-model="active">
          <el-radio-button label="今天" value="day" />
          <el-radio-button label="本周" value="week" />
          <el-radio-button label="本月" value="month" />
        </el-radio-group>
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="To"
          style="width: 355px"
        />
      </div>
      <el-tabs type="border-card">
        <el-tab-pane lazy label="设备数据">
          <component :is="currentComponent" :ref="currentComponentRef" />
        </el-tab-pane>
        <el-tab-pane lazy label="设备工况"> <Work ref="workRef" /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-data {
  &__title {
    line-height: 52px;
    font-size: 16px;
    color: var(--normal-title-color);
    font-weight: 700;
  }

  &__tabs {
    margin-top: 24px;
  }

  &__content {
    position: relative;
  }

  &__actions {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    z-index: 1;

    .el-radio-group {
      margin-right: 12px;
    }
  }
}
</style>
