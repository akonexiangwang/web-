<template>
  <div class="home">
    <div id="box1" ref="mycharts"></div>
    <div id="box2"></div>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      total: [],
      status: [],
    };
  },

  mounted() {
    this.drawLine();
  },
  methods: {
    getProfile() {},
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myCharts = this.$echarts.init(document.getElementById("box1"));
      let myCharts2 = this.$echarts.init(document.getElementById("box2"));
      // console.log(this.$refs.mycharts);
      // 绘制图表

      //获取表格数据
      this.$axios({
        url: "http://127.0.0.1:3007/my/asset/cates",

        method: "get",
      })
        .then((res) => {
          const m = res.data.data;
          // console.log(m);
          this.data = m.map((n) => {
            return n.type;
          });

          this.data2 = m.map((n) => {
            return n.status;
          });

          console.log(this.data2);
          let data1 = 0;
          let data2 = 0;
          let data3 = 0;
          let data4 = 0;
          let data5 = 0;
          let data6 = 0;
          for (let i in this.data) {
            if (this.data[i] == "个人") {
              data1++;
            } else if (this.data[i] == "管理员") {
              data2++;
            } else {
              data3++;
            }
          }

          for (let k in this.data2) {
            if (this.data2[k] == "0") {
              data4++;
            } else if (this.data2[k] == "1") {
              data5++;
            } else {
              data6++;
            }
          }

          this.status.splice(0, 0, data4, data5, data6);
          this.total.splice(0, 0, data1, data2, data3);
          console.log(this.status);

          myCharts.setOption({
            color: ["blue"],
            title: {
              text: "资产类型",
            },
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: [
              {
                type: "category",
                data: ["个人", "管理员", "公共"],
                axisTick: {
                  alignWithLabel: true,
                },
              },
            ],
            yAxis: [
              {
                type: "value",
              },
            ],
            series: [
              {
                name: "总数",
                type: "bar",
                barWidth: "60%",
                data: this.total,
                itemStyle: {
                  // 修改柱子圆角
                  barBorderRadius: 5,
                },
              },
            ],
          });

          myCharts2.setOption({
            color: ["red", "brown", "green"],
            tooltip: {
              trigger: "item",
            },
            legend: {
              top: "5%",
              left: "center",
            },
            series: [
              {
                name: "资产状态",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: "#fff",
                  borderWidth: 2,
                },
                label: {
                  show: false,
                  position: "center",
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: "40",
                    fontWeight: "bold",
                  },
                },
                labelLine: {
                  show: false,
                },
                data: [
                  { value: this.status[0], name: "闲置中" },
                  { value: this.status[1], name: "使用中" },
                  { value: this.status[2], name: "维修中" },
                ],
              },
            ],
          });

          // console.log(this.total);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.home {
  padding-top: 80px;
}
#box1 {
  margin-left: 50px;
  float: left;
  width: 500px;
  height: 500px;
}
#box2 {
  margin-left: 200px;
  width: 500px;
  float: left;
  height: 500px;
}
</style>
