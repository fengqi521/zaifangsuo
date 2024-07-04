import { getCssVariableValue } from "@/utils";
import handleIconUrl from "@/assets/images/dataZoom-handle.png"; // 引入图片
import downloadIconUrl from "@/assets/images/download.png";
import viewIconUrl from "@/assets/images/view.png";

// 折线图公共配置
export const getCommonLine = function () {
  return {
    grid: {
      top: 36,
      left: 10,
      right: 16,
      bottom: 50,
      containLabel: true,
    },
    // 显示提示框组件，包括提示框浮层和 axisPointer。
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "rgba(0,0,0,0.8)",
        },
      },
      backgroundColor: "rgba(0,0,0,0.8)",
      borderRadius: 2,
      formatter: (params) => {
        let res = "";
        let formatterName = "";
        params.forEach((current) => {
          const { name, color, value, seriesName } = current;
          const selfMarker =
            `<span style="display:inline-block;vertical-align:middle;margin-right:6px;margin-bottom:4px;border-radius:6px;` +
            `width:6px;height:6px;background-color:${color};"></span>`;
          formatterName = `<span style='display:block;font-weight:bold'>${name}</span><br/>`;

          res += `${selfMarker}${seriesName}<span style='margin-left:24px;float:right'>${value}mm</span><br/>`;
        });
        return formatterName + res;
      },
      extraCssText: "padding:12px",
      textStyle: {
        fontSize: 12,
        color: getCssVariableValue("--text-color"),
      },
    },
    // toolbox: {
    //   itemSize:18,
    //   feature: {
    //     saveAsImage: {
    //       show: true,
    //       title: "",
    //       icon: `image://${downloadIconUrl}`,
    //     },
    //     dataView: {
    //       show: true,
    //       title: "",
    //       lang:['数据视图', '关闭'],
    //       icon: `image://${viewIconUrl}`
    //     },
    //   },
    //   tooltip: {
    //     show: true,
    //     formatter: function (param) {
    //       return "<div>" + param.title + "</div>"; // 自定义的 DOM 结构
    //     },
    //     backgroundColor: "#222",
    //     textStyle: {
    //       fontSize: 12,
    //     },
    //     extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);", // 自定义的 CSS 样式
    //   },
    // },
    xAxis: [
      {
        type: "category",
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

          // align: "center",
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
        nameTextStyle: {
          fontSize: 12,
          color: getCssVariableValue("--normal-title-color"),
          fontWeight: "normal",
          rich: {
            title: {
              padding: [0, 0, 0, 50], // 通过负的右边距将标题向左移动
              align: "left", // 左对齐
            },
          },
        },
      },
      {
        type: "value",
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
          color: "#999",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#ECECEC",
            width: 1,
          },
        },
      },
    ],
    series: [],
    dataZoom: [
      {
        type: "slider",
        show: true,
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
// 柱状图公共配置
export const getCommonBar = function () {
  return {
    // 显示提示框组件，包括提示框浮层和 axisPointer。
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "rgb(228,235,249)",
          type: "solid",
          maxWidth: 50,
        },
      },
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      formatter: (params) => {
        let res = "";
        let formatterName = "";
        params.forEach((current) => {
          const { name, color, value, seriesName } = current;
          formatterName = `<span style='display:block;font-weight:bold'>${name}</span><br/>`;
          const selfMarker =
            `<span style="display:inline-block;vertical-align:middle;margin-right:6px;margin-bottom:4px;border-radius:6px;` +
            `width:6px;height:6px;background-color:${color};"></span>`;

          res += `${selfMarker}${seriesName}<span style='margin-left:24px;float:right'>${value}mm</span><br/>`;
        });
        return formatterName + res;
      },
      extraCssText: "padding:12px",
      textStyle: {
        fontSize: 12,
        color: getCssVariableValue("--text-color"),
      },
    },
    legend: {
      show: false,
      itemWidth: 24,
      itemHeight: 12,
      x: "left",
      itemGap: 16,
    },
    // 直角坐标系内绘图网格
    grid: {
      top: 36,
      left: 10,
      right: 16,
      bottom: 50,
      containLabel: true,
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
            color: "#CCC",
          },
        },
        // 坐标轴刻度标签的相关设置
        axisLabel: {
          color: "#666",
          fontSize: 12,
        },
        // 坐标轴在 grid(网格) 区域中的分隔线。
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        name: "{title|日降雨量(mm)}",
        type: "value",
        nameTextStyle: {
          fontSize: 12,
          color: getCssVariableValue("--normal-title-color"),
          fontWeight: "normal",
          rich: {
            title: {
              padding: [0, 0, 0, 50], // 通过负的右边距将标题向左移动
              align: "left", // 左对齐
            },
          },
        },
        // max: 500
      },
      {
        type: "value",
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
          color: "#999",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#ECECEC",
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
          normal: {
            show: false,
            position: "insideRight",
            textStyle: {
              color: "#000",
            },
          },
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
          normal: {
            show: true,
            // position: 'insideRight',
            position: "right",
            textStyle: {
              color: "#000",
            },
            formatter: function (params) {
              for (var i = 0, l = option.yAxis["data"].length; i < l; i++) {
                if (option.yAxis["data"][i] == params.name) {
                  return option.series[0].data[i] + params.value;
                }
              }
            },
          },
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
        top: "36%",
        textStyle: {
          fontSize: 24,
          fontWeight: "bold",
          color: getCssVariableValue("--panel-active-color"),
        },
      },
      {
        text: "设备总数(个)", // 第二个标题的文本内容
        left: "center",
        top: "48%",
        textStyle: {
          fontSize: 12,
          fontWeight: "normal",
          color: getCssVariableValue("--panel-text-color"),
        },
      },
    ],
    tooltip: {
      trigger: "item",
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
