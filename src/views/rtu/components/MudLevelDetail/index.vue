<script setup>
import { ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import ElTabs from "@/components/ElTabs/index.vue";
import Bread from "@/components/Bread/index.vue";

import BaseInfo from "./BaseInfo.vue";
import History from "./History.vue";
import Work from "./Work.vue";

import { useEchartsHook } from "@/hooks/useEcharts";
import { getStartAndEndTime } from "@/utils/index";
import eventBus from "@/utils/eventBus";

const route = useRoute();
useEchartsHook();

const id = route.params.id;
const tabActive = ref(0);
const active = ref("day");
const dateTimeRange = ref([]);
const tabs = [
  {
    title: "设备数据",
    pannel: History,
    eleNames: ["historyChart"],
  },
  {
    title: "设备工况",
    pannel: Work,
    eleNames: ["wordChart"],
  },
];
// 导航
const breadList = ref([
  { to: "/rtu", title: "设备管理" },
  { title: "设备详情" },
]);

// 切换tabs
const handleChangeTabs = (val) => {
  nextTick(() => {
    const eleNames = tabs[val]?.eleNames;
    eleNames.forEach((item) => {
      eventBus.emit(item);
    });
  });
};

// 通过id获取详情
const detail = ref({});
const getDetailById = () => {
  const res = {
    code: 0,
    status: true,
    msg: "OK",
    pageNo: null,
    pageSize: null,
    total: null,
    data: {
      id: "6a725606-0c89-4e0e-bbb6-1f977ce6c785",
      name: "泥位图像站",
      createtime: "2024-06-26 10:16:38",
      status: 1,
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
watch(
  active,
  (newVal) => {
    dateTimeRange.value = getStartAndEndTime(newVal);
    nextTick(() => {
      // 监测数据
      eventBus.emit("getMudChartData");
      eventBus.emit("getMudLevelHistory");

      // 工况数据
      eventBus.emit("getWorkChartData");
      eventBus.emit("getWorkHistory");
    });
  },
  { immediate: true }
);
</script>

<template>
  <div class="device-data">
    <Bread :breadList="breadList"/>
    <BaseInfo :detail="detail" />
    <ElTabs
      class="device-data__tabs"
      :tabs="tabs"
      v-model="tabActive"
      @change="handleChangeTabs"
    >
      <template #actions>
        <div class="device-data__actions">
          <el-radio-group v-model="active">
            <el-radio-button label="今天" value="day" />
            <el-radio-button label="本周" value="week" />
            <el-radio-button label="本月" value="month" />
          </el-radio-group>
          <el-date-picker
            v-model="dateTimeRange"
            type="datetimerange"
            range-separator="To"
            style="width: 355px"
          />
        </div>
      </template>
    </ElTabs>
  </div>
</template>

<style lang="scss" scoped>
.device-data {
  &__title {
    line-height: 52px;
    font-size: 16px;
    color: var(--normal-title-color);
    font-weight: 700;
  }

  &__tabs {
    margin-top: 24px;
  }

  &__actions {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;

    .el-radio-group {
      margin-right: 12px;
    }
  }
}
</style>
