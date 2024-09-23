import { getCssVariableValue } from "@/utils";
import handleIconUrl from "@/assets/images/dataZoom-handle.png"; // 引入图片
import WLImg from "@/assets/images/test.png"; // 引入图片

import downloadIconUrl from "@/assets/images/download.png";
import viewIconUrl from "@/assets/images/view.png";

// 折线图公共配置
export const getCommonLine = function ({
  seriesUnit = ["mm"],
  yAxisTitlePadding = [0, 0, 0, 50],
} = {}) {
  return {
    legend: {
      show: false,
      itemWidth: 18,
      itemHeight: 10,
      x: "right",
      itemGap: 16,
      data: [],
      textStyle: {
        fontSize: 12,
        rich: {
          a: {
            verticalAlign: "middle",
          },
        },
        lineHeight: 12,
        padding: [0, -2, -4, 4],
      },
    },
    grid: {
      top: 36,
      left: 0,
      right: 6,
      bottom: 25,
      containLabel: true,
    },
    // 显示提示框组件，包括提示框浮层和 axisPointer。
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      backgroundColor: "rgba(0,0,0,0.8)",
      borderRadius: 2,
      formatter: (params) => {
        let res = "";
        let formatterName = "";
        params.forEach((current) => {
          let { name, color, value, seriesName, seriesIndex } = current;
          if (color?.colorStops) {
            color = color.colorStops[1].color;
          }
          if (seriesUnit && seriesUnit.length === 1) seriesIndex = 0;
          formatterName = `<span style='display:block;font-weight:bold'>${name}</span>`;
          res +=
            `<div style="display:flex;align-items:center;justify-content:space-between;padding:2px 0"><div><span style="display:inline-block;vertical-align:middle;margin-right:6px;margin-bottom:4px;border-radius:6px;` +
            `width:6px;height:6px;background-color:${color};"></span>${seriesName}:</div><span>${value}${
              seriesUnit ? seriesUnit[seriesIndex] : "mm"
            }</span></div>`;
        });
        return formatterName + res;
      },
      extraCssText: "padding:12px",
      textStyle: {
        fontSize: 12,
        color: getCssVariableValue("--text-color"),
      },
    },

    xAxis: [
      {
        type: "category",
        // boundaryGap: true,
        // minInterval: 7200,
        data: [],
        // 坐标轴刻度相关设置。
        axisTick: {
          show: false,
        },
        // 坐标轴线设置。
        axisLine: {
          show: true,
          margin: 12,
          lineStyle: {
            color: "#CCC",
          },
        },
        // 坐标轴刻度标签的相关设置
        axisLabel: {
          color: "#666",
          fontSize: 12,
          rotate: -20,
        },
        // 坐标轴在 grid(网格) 区域中的分隔线。
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        name: "{title|累计降雨量(mm)}",
        type: "value",
        // alignTicks: true,
        axisLabel: {},
        nameTextStyle: {
          fontSize: 12,
          color: getCssVariableValue("--normal-title-color"),
          fontWeight: "normal",
          rich: {
            title: {
              padding: yAxisTitlePadding ? yAxisTitlePadding : [0, 0, 0, 50], // 通过负的右边距将标题向左移动
              align: "left", // 左对齐
            },
          },
        },
      },
      {
        type: "value",
        // 坐标轴刻度相关设置。
        // alignTicks: true,
        axisTick: {
          show: false,
        },
        // 坐标轴线设置。
        axisLine: {
          show: false,
        },
        // 坐标轴刻度标签的相关设置
        axisLabel: {
          color: "#999",
        },
        splitLine: {
          lineStyle: {
            color: "#ECECEC",
            width: 1,
          },
        },
        nameTextStyle: {
          fontSize: 12,
          color: getCssVariableValue("--normal-title-color"),
          fontWeight: "normal",
          rich: {
            title: {
              padding: yAxisTitlePadding ? yAxisTitlePadding : [0, 0, 0, 50], // 通过负的右边距将标题向左移动
              align: "left", // 左对齐
            },
          },
        },
      },
    ],
    series: [],
    dataZoom: [
      {
        type: "slider",
        show: true,
        height: 16,
        bottom: 8,
        borderColor: "#EFF2F6",
        handleStyle: {
          backgroundColor: "#D6DFF1",
          width: 8,
        },
        textStyle: {
          color: "",
        },
        handleSize: "100%", // 手柄大小
        handleWidth: 8,
        handleIcon: `image://${handleIconUrl}`, //手柄
        fillerColor: "#D6DFF1", //条-填充颜色
        backgroundColor: "#EFF2F6", //条-上
        dataBackground: {
          width: 8,
          areaStyle: {
            color: "#E0E6EE", //条下
          },
          lineStyle: {
            opacity: 0,
            color: "#C4CFDE", //背景-中分线
          },
        },
      },
      {
        type: "inside",
        height: 30
      },
    ],
  };
};

// 柱状图公共配置
export const getCommonBar = function ({ seriesUnit = ["mm"] }) {
  return {
    legend: {
      // 显示提示框组件，包括提示框浮层和 axisPointer。
      show: false,
      itemWidth: 14,
      itemHeight: 4,
      x: "left",
      itemGap: 24,
      data: [],
      textStyle: {
        fontSize: 14,
        color: "#FFF",
        rich: {
          a: {
            verticalAlign: "middle",
          },
        },
        lineHeight: 12,
        padding: [0, -2, -4, 4],
      },
    },
    // 直角坐标系内绘图网格
    grid: {
      top: 46,
      left: 10,
      right: 16,
      bottom: 8,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      backgroundColor: "rgba(0,0,0,0.8)",
      formatter: (params) => {
        let res = "";
        let formatterName = "";
        params.forEach((current) => {
          let { name, color, value, seriesName, seriesIndex } = current;
          if (typeof color !== "string" && color.colorStops) {
            color = color.colorStops[0].color;
          }
          if (seriesUnit && seriesUnit.length === 1) seriesIndex = 0;
          formatterName = `<span style='display:block;font-weight:bold'>${name}</span>`;
          res +=
            `<div style="display:flex;align-items:center;justify-content:space-between;padding:2px 0"><div><span style="display:inline-block;vertical-align:middle;margin-right:6px;margin-bottom:4px;border-radius:6px;` +
            `width:6px;height:6px;background-color:${color};"></span>${seriesName}：</div><span>${value}${
              seriesUnit ? seriesUnit[seriesIndex] : "mm"
            }</span></div>`;
        });
        return formatterName + res;
      },
      extraCssText: "padding:12px",
      textStyle: {
        fontSize: 12,
        color: getCssVariableValue("--text-color"),
      },
    },
    xAxis: [
      {
        type: "category",
        // minInterval: 7200,
        data: [],
        // 坐标轴刻度相关设置。
        axisTick: {
          show: false,
          interval: 1,
        },
        // 坐标轴线设置。
        axisLine: {
          show: true,
          margin: 12,
          lineStyle: {
            color: "#2C4756",
            width: 1,
          },
        },
        // 坐标轴刻度标签的相关设置
        axisLabel: {
          color: "#96B4BE",
          fontSize: 14,
          margin: 16,
        },
        // 坐标轴在 grid(网格) 区域中的分隔线。
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        interval: 1,
        // 坐标轴刻度相关设置。
        axisTick: {
          show: false,
        },
        // 坐标轴线设置。
        axisLine: {
          show: false,
        },
        // 坐标轴刻度标签的相关设置
        axisLabel: {
          color: "#96B4BE",
          fontSize: 14,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#2C4756",
            width: 1,
          },
        },
      },
    ],
    series: [
      {
        name: "在线",
        type: "bar",
        stack: "总量",
        label: {
          show: false,
          position: "insideRight",
          // textStyle: {
          //   color: "#000",
          // },
        },
        barGap: "35%",
        barCategoryGap: "35%",
        color: ["rgba(77, 84, 169, 0.8)"],
      },
      {
        name: "总量",
        type: "bar",
        stack: "总量",
        label: {
          show: true,
          // position: 'insideRight',
          position: "right",
          // textStyle: {
          //   color: "#000",
          // },
          // formatter: function (params) {
          //   for (var i = 0, l = option.yAxis["data"].length; i < l; i++) {
          //     if (option.yAxis["data"][i] == params.name) {
          //       return option.series[0].data[i] + params.value;
          //     }
          //   }
          // },
        },
        barGap: "40%",
        barCategoryGap: "40%",
        color: ["#e2e8ec"],
      },
    ],
    dataZoom: [
      {
        type: "slider",
        height: 24,
        bottom: 16,
        borderColor: "#EFF2F6",
        handleStyle: {
          backgroundColor: "#D6DFF1",
          width: 8,
        },
        textStyle: {
          color: "",
        },
        handleSize: "100%", // 手柄大小
        handleWidth: 8,
        handleIcon: `image://${handleIconUrl}`, //手柄
        fillerColor: "#D6DFF1", //条-填充颜色
        backgroundColor: "#EFF2F6", //条-上
        dataBackground: {
          width: 8,
          areaStyle: {
            color: "#E0E6EE", //条下
          },
          lineStyle: {
            opacity: 0,
            color: "#C4CFDE", //背景-中分线
          },
        },
      },
      {
        type: "inside",
        height: 30,
      },
    ],
  };
};
// 饼图公共配置
export const getCommonPie = function () {
  return {
    title: [
      {
        text: "Title 1", // 第一个标题的文本内容
        left: "center",
        top: "40%",
        textStyle: {
          fontSize: 24,
          fontWeight: "bold",
          color: getCssVariableValue("--panel-active-color"),
        },
      },
      {
        text: "设备总数(个)", // 第二个标题的文本内容
        left: "center",
        top: "52%",
        textStyle: {
          fontSize: 12,
          fontWeight: "normal",
          color: getCssVariableValue("--panel-text-color"),
        },
      },
    ],
    tooltip: {
      trigger: "none",
      show: false,
      backgroundColor: "rgba(0,0,0,0.8)",
      borderRadius: 2,
      extraCssText: "padding:12px",
      textStyle: {
        fontSize: 12,
        color: getCssVariableValue("--text-color"),
      },
    },
    legend: {
      bottom: 6,
      right: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        fontSize: 12,
        lineHeight: 12,
        color: getCssVariableValue("--text-normal-color"),
        rich: {
          a: {
            verticalAlign: "middle",
          },
        },
        padding: [0, 0, -2, 0],
      },
    },
    series: [
      {
        type: "pie",
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        selectedMode: "single",
        // padAngle: 5,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          // alignTo: 'edge',
          formatter: "{name|{b}}数(个)\n{count|{c}}",
          lineHeight: 16,
          rich: {
            count: {
              fontSize: 18,
              fontWeight: "bold",
              color: getCssVariableValue("--chart-pie-value-color"),
            },
          },
        },
        data: [],
      },
    ],
  };
};

//堆叠柱状图配置
export const getCommonStackBar = function () {
  return {
    animation: false,
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "rgba(37,55,118,.12)",
          type: "solid",
          width: 60,
        },
        z: -1,
      },
      formatter: (params) => {
        let res = "";
        let formatterName = "";
        params.reverse().forEach((current) => {
          const { name, color, seriesName, value } = current;
          const selfMarker =
            `<span style="display:inline-block;margin:0 8px 2px 0;border-radius:6px;` +
            `width:6px;height:6px;background-color:${color};"></span>`;

          formatterName =
            "<span style='font-weight:bold'>" + name + "</span><br/>";
          res +=
            selfMarker +
            seriesName +
            "<span style='float:right'>" +
            value +
            "%" +
            "</span><br/>";
        });
        return formatterName + res;
      },
      extraCssText: "width:174px;padding:12px",
      textStyle: {
        fontSize: 12,
      },
    },
    legend: {
      itemHeight: 10,
      itemWidth: 10,
      itemGap: 16,
      left: 0,
      top: 16,
      padding: 0,
      textStyle: {
        padding: [4, 0, 0],
      },
      data: [],
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: 16,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: false,
        lineStyle: {
          color: "#CCC",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#666",
      },
      data: [],
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#ECECEC",
        },
      },
    },
    series: [],
  };
};

export const getCommon3dBar = function () {
  return {
    tooltip: { show: false },
    // visualMap: {
    //   show: false,
    //   inRange: {
    //     color: ['#FF4500', '#FF6347'],
    // },
    // },

    xAxis3D: {
      type: "category",
      name: "",
      data: [],
      axisLabel: {
        margin: 30,
        textStyle: {
          fontSize: 16,
          color: "#FFF",
        },
      },
    },
    yAxis3D: {
      type: "category",
      name: "",
      data: [],
      axisLabel: {
        margin: 10,
        textStyle: {
          fontSize: 14,
        },
      },
      axisLine: {
        lineStyle: {
          color: "#FFF",
        },
      },
    },
    zAxis3D: {
      type: "value",
      name: "",
      axisLabel: {
        margin: 10,
        textStyle: {
          color: "#FFF",
          fontSize: 14,
        },
      },
    },
    grid3D: {
      boxWidth: 180,
      boxDepth: 80,
      axisLine: {
        lineStyle: {
          color: "#FFF",
          width: 1,
        },
      },
      splitLine: {
        lineStyle: {
          opacity: 0.4,
        },
      },
      axisLabel: {
        fontSize: "12",
      },
      light: {
        main: {
          intensity: 1.2,
          shadow: true,
        },
        ambient: {
          intensity: 0.7,
          shadow: true,
        },
      },
      viewControl: {
        alpha: 0,
        beta: 0,
        autoRotate: true,
        autoRotateAfterStill: 5,
        distance: 225,
      },
      bottom:0
    },
    series: [
      {
        type: "bar3D",
        data: [],
        shading: "lambert",
        label: {
          show: true,
          distance: 1,
          borderWidth: 1,
          color: "#FFF",
          fontSize: 18,
        },
        emphasis: {
          label: {
            fontSize: 20,
            color: "#FFF",
          },
          // itemStyle: {
          //   color: "#900",
          // },
        },
      },
    ],
  };
};

export const getCommon3dMap = function () {
  return {
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.8)",
      borderRadius: 2,
      extraCssText: "padding:12px",
      textStyle: {
        fontSize: 12,
        color: "#FFF",
      },
      formatter: (params) => {
        let {
          name,
          value,
          seriesName,
          data: { selfParams },
        } = params;
        const colors = ["#24FEB4", "#ff4b55"];
        let str = `<span style='display:block;font-weight:bold'>${name}</span>`;
        let online = 0;
        let offline = 0;
        if (selfParams) {
          online = selfParams.online;
          offline = selfParams.offline;
        } else {
          if (seriesName === "在线") {
            online = value[2];
          } else {
            offline = value[2];
          }
        }

        str += `<div style="display:flex;align-items:center;padding:2px 0""><span style="margin-right:6px;width:6px;height:6px;background:${colors[0]}"></span>在线：<span>${online}个</span></div><div style="display:flex;align-items:center;padding:2px 0""><span style="margin-right:6px;width:6px;height:6px;background:${colors[1]}"></span>离线：<span>${offline}个</span></div>`;
        return str;
      },
    },
    visualMap: {
      show: false,
    },
    geo3D: {
      map: "beijing",
      left: 0,
      bottom:0,
      label: {
        // 标签的相关设置
        show: false, // (地图上的城市名称)是否显示标签 [ default: false ]

        // 标签的字体样式
        // color: "#FFF", // 地图初始化区域字体颜色
        fontSize: 12, // 字体大小
        opacity: 1, // 字体透明度
        backgroundColor: "transparent", // 字体背景色
      },

      itemStyle: {
        opacity: 0.5,
        borderWidth: 1,
        borderColor: "#fdb347",
      },
      emphasis: {
        label: {
          show: false,
          color: "#fff000",
        },
      },
      viewControl: {
        distance: 100,
        center: [-10, -10, 0],
      },
      shading: "realistic",
      realisticMaterial: {
        // 引入纹理贴图
        detailTexture: WLImg,
        // textureTiling: 1,
      },
      light: {
        main: {
          shadow: true,
          shadowQuality: "ultra",
          intensity: 1,
          alpha: 40,
          // beta: 300,
        },
      },
    },
    series: [
      {
        name: "在线",
        type: "bar3D",
        shading: "lambert",
        coordinateSystem: "geo3D",
        data: [],
        minHeight: 1,
        barSize: 2, // 柱子粗细
        label: {
          show: true,
          distance: 1,
          color: "#FFF",
          fontSize: 14,
          fontWeight: "bold",

          formatter(params) {
            return params.value[2];
          },
        },
      },
      {
        name: "离线",
        type: "bar3D",
        shading: "lambert",
        coordinateSystem: "geo3D",
        minHeight: 1,
        data: [],
        barSize: 1.99,
        label: {
          show: true,
          distance: 1,
          color: "#FFF",
          fontSize: 14,
          fontWeight: "bold",
          formatter(params) {
            return params.value[2];
          },
        },
      },
    ],
  };
};
