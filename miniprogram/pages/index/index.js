let util = require("../../js/util.js");

Page({


  /**
   * 页面的初始数据
   */
  data: {
    today: '',
    countData: [],
    expenditure : 0,
    total : 0,
    income : 0,
    isOptional:false,
    scroll_height : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //检测是否有countList
    wx.getStorageInfo({
      success(res) {
        if(!res.keys.length){
          wx.setStorage({
            key: "countList",
            data: [],
            success(res) {
              console.log('新建成功');
            },
            fail(err){
              conosle.log(err);
            }
          })
        }
      }
    })
    this.getHeight();
    this.countMoney();
    let now = new Date();
    let today = util.timeFormat(now);
    let that = this;
    wx.getStorage({
      key:"countList",
      success(res){
        that.setData({
          countData: res.data,
        })
      },
      fail(err){
        console.log(err);
      },
      complete(){
        that.setData({
          today: today
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  //显示操作按钮
  showOptional : function () {
    let isOpt = this.data.isOptional
    this.setData({
      isOptional: !isOpt
    })
  },

  //添加收入
  addIncome : function (){
    this.setData({
      isOptional: false
    }),
    wx.navigateTo({
      url: '../income/income?id=1'
    })
  },

  //添加支出
  addExpend: function () {
    this.setData({
      isOptional: false
    }),
    wx.navigateTo({
      url: '../income/income?id=2'
    })
  },

  //获取高度
  getHeight: function (){
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      scroll_height: windowHeight * 750 / windowWidth - 400 - 30
    })
  },

  //计算金额
  countMoney : function (){
    let data = [],
        income = 0,
        total = 0,
        expend = 0,
        that = this
    wx.getStorage({
      key: "countList",
      success(res) {
          if(!res.data.length) return;
          function sum (arr){
            return arr.reduce(function (total, num) {
              return total + num
            })
          }
          for(let item of res.data){
            data.push(item.money);
          } 

          //计算收入
          let countIncome = data.filter(function(mon){
            return mon > 0
          })
          if (countIncome.length){
            income = sum(countIncome)
          }
          //计算支出
          let thisExpend = data.filter(function (mon) {
            return mon < 0
          })
          if (thisExpend.length){
            expend = sum(thisExpend)
          }
          //计算总额
          total = sum(data)
          that.setData({
            income,
            expenditure:expend,
            total
          })
      }
    })
  }



})