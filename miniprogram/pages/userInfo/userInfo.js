let util = require("../../js/util.js");
import * as echarts from '../../ec-canvas/echarts.js'

var chart1 = null;   //每日统计
var chart2 = null;   //每月总结--收入
var chart3 = null;   //每月总结--支出



Page({

  /**
   * 页面的初始数据
   */
  data: {
    time : '',
    current: 'tab1',
    ec1: {
        onInit: function(canvas, width, height) {
          chart1 = echarts.init(canvas, 'light', {
            width: width,
            height: height
          });
          canvas.setChart(chart1);
          return chart1;
        }
    },
    ec2: {
      onInit: function (canvas, width, height) {
        chart2 = echarts.init(canvas, 'light', {
          width: width,
          height: height
        });
        canvas.setChart(chart2);
        return chart2;
      }
    },
    ec3: {
      onInit: function (canvas, width, height) {
        chart3 = echarts.init(canvas, 'light', {
          width: width,
          height: height
        });
        canvas.setChart(chart3);
        return chart3;
      }
    },
  },
  /**
   * 将time的初始化设置为当前月份，优化下而已，其实感觉没有什么用
   */
  onLoad: function (options) {
    this.setData({
      time: util.timeFormat(new Date(),'yyyy-mm')
    })
  },

  /**
   * 为图表进行初始化
   */
  onReady: function () {
      setTimeout(this.initChartOption, 500);
  },
  //选择图表类型
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
    this.onReady();
  },
  //选择月份
  bindDateChange: function (e) {
    let currentMon = this.formatDate(e.detail.value);
    this.setData({
      time: currentMon
    },()=>{
      this.initChartOption()
    })
  },
  //格式化日期
  formatDate: function (date) {
    let dateArr = date.split('-');
    dateArr.pop();
    return dateArr.join('-');
  },
  //默认一个月为31天，设置y轴为31天
  getDay : function() {
      let res = [];
      for(let i = 1; i <= 31; i++) {
        res.push(i + "号")
      }
      return res;
  },
  //获取数据并setOption
  initChartOption : function (){
    let day = this.getDay();
    wx.showLoading({
      title: '加载中...',
    })
    //加载数据
    var _this = this
    wx.getStorage({
      key: 'countList',
      success(res) {
        //整理数据并设置Option
        if (_this.data.current === 'tab1'){
          let counts = _this.formatDailyData(res.data);
          chart1.setOption({
            //提示框组件
            tooltip: {
              //触发类型，有item/axios/none三种类型可选
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效，配置项的优先级低于轴上的配置项
                type: 'shadow'          // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            //图例
            legend: {
              data: ['总计', '支出', '收入'],
              top: '10rpx'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '8%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'value'
              }
            ],
            yAxis: [
              {
                type: 'category',
                axisTick: { show: false },
                data: day
              }
            ],
            series: [
              {
                name: '总计',
                type: 'bar',
                data: counts.total
              },
              {
                name: '收入',
                type: 'bar',
                stack: '总量',//设置同一个值可以使圆柱在同一位置
                data: counts.income
              },
              {
                name: '支出',
                type: 'bar',
                stack: '总量',
                data: counts.expend
              }
            ]
          });
        }else if(_this.data.current === 'tab2'){
          let counts = _this.formatMensalData(res.data);
          console.log(counts)
          let data1 = []
              data1.push(counts[1])
              data1.push(counts[2])
              data1.push(counts[3])
          let data2 = []
              data2.push(counts[4])
              data2.push(counts[5])
              data2.push(counts[6])
              data2.push(counts[7])
          console.log(data1);
          console.log(data2);
          chart2.setOption({
            title: {
              text: '当月收入',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{b} : {c}￥ ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['工资', '兼职', '其他收入']
            },
            series: [
              {
                name: '收入',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data1,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          });
          chart3.setOption({
            title: {
              text: '当月支出',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{b} : {c}￥ ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['购物', '饮食', '交通','其他支出']
            },
            series: [
              {
                name: '支出',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data2,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          })

        }
        wx.hideLoading();
      }
    })  
  },
  //获取每一天的数据
  formatDailyData : function(data) {
    let count = {
      total: [],
      income: [],
      expend: [] 
    };
    if (!data.length) return count;
    let _this = this;
    let thisMon = data.filter(function(item){
      let currentDate = item.time.split('-')[0].split('.');
      currentDate.pop();
      let getMon = currentDate.join('-'); 
      return getMon == _this.data.time;
    })
    for(let i in thisMon){
      let thisDay = thisMon[i].time.split('-')[0].split('.')[2]-1
      if (thisMon[i].type == 1 || thisMon[i].type == 2 || thisMon[i].type == 3){
        count.income[thisDay] ? count.income[thisDay] += thisMon[i].money : count.income[thisDay] = thisMon[i].money
      }else{
        count.expend[thisDay] ? count.expend[thisDay] += thisMon[i].money : count.expend[thisDay] = thisMon[i].money
      } 
      count.total[thisDay] ? count.total[thisDay] += thisMon[i].money : count.total[thisDay] = thisMon[i].money
    }
    return count
  },
  //获取月总结数据
  formatMensalData : function(data) {
    console.log(data)
    let count = {
      1: { value: 0, name: '工资'},
      2: { value: 0, name: '兼职' },
      3: { value: 0, name: '其他收入' },
      4: { value: 0, name: '购物' },
      5: { value: 0, name: '饮食' },
      6: { value: 0, name: '交通' },
      7: { value: 0, name: '其他支出' },
    }
    for(let i in data){
      let dataType = data[i].type
      if(dataType==0 || dataType==1 || dataType==2){
        count[dataType].value += data[i].money
      }else{
        count[dataType].value += data[i].money
      }
    }
    return count;
  }
})