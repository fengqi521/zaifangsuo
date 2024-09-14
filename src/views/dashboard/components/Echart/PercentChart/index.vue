<script setup>
import { ref, watch, reactive, nextTick } from "vue";
import Chart from "@/components/Chart/index.vue";
import Empty from "../../Empty.vue";
import { getCommonPie } from "@/utils/chartData";
import { useScreenStoreHook } from "@/store/modules/screen";
const screenStore = useScreenStoreHook();
// 定义 ref 引用和初始化数据
const option = reactive({ ...getCommonPie() });
const chartComponent = ref(null);
var colors = [
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "#323CFF", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "#1ABEFE", // 100% 处的颜色
      },
    ],
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "#8a42ff", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "rgba(138,66,255,0.6)", // 100% 处的颜色
      },
    ],
  },
  {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: "#24FEB4", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "rgba(36,254,180,0.6)", // 100% 处的颜色
      },
    ],
  },
];

watch(
  () => screenStore.screenData.deviceCount,
  (values, oldValue) => {
    resetOptions(values);
  }
);

// 操作实例
let dataIndex = 0;
let intervalId = null;
let mouseOverListener = null;
let mouseOutListener = null;
const positions = [
  [300, 20],
  [150, 200],
  [20, 20],
];
const intervalAction = (chartInstance, data) => {
  intervalId = setInterval(() => {
    chartInstance.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
    });

    chartInstance.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      position: positions[dataIndex],
      dataIndex,
    });
    chartInstance.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex,
    });
    dataIndex = dataIndex >= data.length - 1 ? 0 : dataIndex + 1;
  }, 2000);
};
const handleChartInstance = (data) => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  nextTick(() => {
    const chartInstance = chartComponent.value?.chart;
    if (!chartInstance) return;

    // 清理旧的事件监听器
    if (mouseOverListener) {
      chartInstance.off("mouseover", mouseOverListener);
    }
    if (mouseOutListener) {
      chartInstance.off("mouseout", mouseOutListener);
    }
    intervalAction(chartInstance, data);

    // 鼠标移入时暂停定时器并恢复高亮
    mouseOverListener = (params) => {
      clearInterval(intervalId);
      intervalId = null;
      chartInstance.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
      });
      chartInstance.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: params.dataIndex,
      });
      chartInstance.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: params.dataIndex,
      });
    };
    chartInstance.on("mouseover", mouseOverListener);

    // 鼠标移出时重新启动定时器
    mouseOutListener = () => {
      if (intervalId === null) {
        chartInstance.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
        });
        intervalAction(chartInstance, data);
      }
    };
    chartInstance.on("mouseout", mouseOutListener);
  });
};

const resetOptions = (lists) => {
  lists = lists.map((item, index) => ({ ...item, value: item.count }));
  // 更新饼图数据和样式配置
  const sum = lists.reduce((prev, next) => prev + next.value, 0);
  option.color = colors;
  option.tooltip = {
    ...option.tooltip,
    show: true,
    trigger: "item",
    formatter: (params) => {
      return `
        <div>
          <span style="font-weight: bold;">${params.seriesName}</span><br/>
          ${params.name}: ${params.value}个 (${params.percent}%)
        </div>
      `;
    },
  };
  option.title[0].text = sum;
  option.title.forEach((item) => {
    item.textStyle.color = "#00FFF6";
  });

  option.legend.orient = "vertical";
  option.legend.textStyle.color = "#FFF";
  option.series = [
    {
      name: "设备数量",
      type: "pie",
      emphasis: { scale: true, scaleSize: 12 },
      itemStyle: {
        borderRadius: 10,
        borderColor: "#FFF",
        borderWidth: 6,
      },
      label: {
        show: false,
      },
      radius: ["50%", "88%"],
      center: ["50%", "50%"],
      data: lists,
    },
  ];

  option.aria = {
    enabled: true,
    decal: {
      show: true,
      decals: [
        {
          color: "rgba(255,255,255,.5)",
          dashArrayX: [1, 0],
          dashArrayY: [4, 3],
          rotation: -Math.PI / 4,
        },
      ],
    },
  };
  handleChartInstance(lists);
};
</script>

<template>
  <Empty v-if="!screenStore.screenData.deviceCount.length" />
  <chart ref="chartComponent" :option="option" v-else />
</template>
