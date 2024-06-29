import {
  getCssVariableValue
} from "@/utils"
// 折线图公共配置
export const getCommonEcharts = function (data_x) {
  return {
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
          const {
            name,
            color,
            seriesName,
            value
          } = current;
          const selfMarker =
            `<span style="display:inline-block;margin:0 8px 2px 0;border-radius:6px;` +
            `width:6px;height:6px;background-color:${color};"></span>`;

          formatterName =
            "<span style='font-weight:bold'>" + name + "</span><br/>";
          res +=
            selfMarker +
            seriesName +
            "<span style='margin-left:24px;float:right'>" +
            value +
            "</span><br/>";
        });
        return formatterName + res;
      },
      extraCssText: "padding:12px",
      textStyle: {
        fontSize: 12,
      },
    },
    // 图例组件
    legend: {
      show: true,
      left: 0,
      top: 16,
      padding: [0, 8, 0, 0],
      itemWidth: 20,
      itemHeight: 8,
      selectedMode: true,
      textStyle: {
        color: "#333",
      },
    },
    // 直角坐标系内绘图网格
    grid: {
      show: true,
      top: "76",
      left: 0,
      right: 8,
      bottom: 16,
      containLabel: true,
      borderColor: "transparent",
    },
    xAxis: [{
      type: "category",
      boundaryGap: true,
      minInterval: 7200,
      data: data_x,
      // 坐标轴刻度相关设置。
      axisTick: {
        show: false,
      },
      // 坐标轴线设置。
      axisLine: {
        show: true,
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
    }, ],
    yAxis: [{
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
          show: false,
          lineStyle: {
            color: "#ECECEC",
            width: 1,
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
  };
};
// 柱状图公共配置
export const getCommonBars = function (data_x) {
  return {
    // 显示提示框组件，包括提示框浮层和 axisPointer。
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "none",
        label: {
          background: "rgba(0, 0, 0, 0.8)",
        },
        crossStyle: {
          color: "#FFFFFF",
        },
      },
    },
    legend: {
      itemWidth: 24,
      itemHeight: 12,
      data: ["在线", "总量"],
      x: "left",
      itemGap: 16,
    },
    // 直角坐标系内绘图网格
    grid: {
      show: true,
      top: "16",
      right: "3%",
      bottom: 0,
      borderColor: "transparent",
    },
    xAxis: [{
      type: "value",
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    }, ],
    yAxis: [{
      type: "category",
      data: data_x,
      // 坐标轴在 grid(网格) 区域中的分隔线。
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    }, ],
    series: [{
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
  };
};
// 饼图公共配置
export const getCommonPie = function () {
  return {
    title: [{
        text: 'Title 1', // 第一个标题的文本内容
        left: 'center',
        top: '36%',
        textStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: getCssVariableValue('--panel-active-color'),
        }
      },
      {
        text: '设备总数(个)', // 第二个标题的文本内容
        left: 'center',
        top: '48%',
        textStyle: {
          fontSize: 12,
          fontWeight: 'normal',
          color: getCssVariableValue('--panel-text-color'),
        }
      }
    ],
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: 6,
      right: 0,
      itemWidth: 14,
      itemHeight: 14,
      textStyle: {
        fontSize: 14,
        lineHeight: 14,
        color: getCssVariableValue('--text-normal-color'),
        rich: {
          a: {
            verticalAlign: 'middle'
          }
        },
        padding: [0, 0, -2, 0]
      },
    },
    series: [{
      type: "pie",
      center: ['50%', '45%'],
      // avoidLabelOverlap: true,
      // padAngle: 5,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        // alignTo: 'edge',
        formatter: '{name|{b}}\n{count|{c} 个}',
        lineHeight: 18,
        rich: {
          count: {
            fontSize: 12,
            color: '#999'
          }
        }
      },
      // labelLine: {
      //   length: 10,
      //   length2: 0
      // },
      data: []
    }],
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
          const {
            name,
            color,
            seriesName,
            value
          } = current;
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