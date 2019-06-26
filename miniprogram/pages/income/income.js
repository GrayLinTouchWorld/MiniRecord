let util = require("../../js/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'',
    current:'',
    money:'',
    infoment:'',
    type:'',
    incomeType: [{
          id: 1,
          name: '工资'
        }, {
          id: 2,
          name: '兼职'
        }, {
          id: 3,
          name: '其他收入'
        }],
        expendType: [{
          id: 4,
          name: '购物'
        }, {
          id: 5,
          name: '饮食'
        }, {
          id: 6,
          name: '交通'
          }, {
            id: 4,
            name: '其他支出'
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  handleTypeChange : function(event) {
    var id = ''
    switch (event.detail.value){
      case "工资":
        id = 1;
        break;
      case "兼职":
        id = 2;
        break
      case "其他收入":
        id = 3;
        break
      case "购物":
        id = 4;
        break
      case "饮食":
        id = 5;
        break
      case "交通":
        id = 6;
        break
      case "其他支出":
        id = 7;
        break
    }
    this.setData({
      current: event.detail.value,
      type : id
    })
  },

  handlemoney: function (event){
    let money ;
    if(this.data.status == 1){
      money = event.detail.detail.value
    } else if (this.data.status == 2){
      money = event.detail.detail.value < 0 ? event.detail.detail.value : 0 - event.detail.detail.value
    }
    this.setData({
      money
    })
  },

  handleInfo: function (event){
    this.setData({
      infoment: event.detail.detail.value
    })
  },

  submitClick : function(){
    var that = this;
    var countData = [];
    var thisTime = util.timeFormat(new Date(),'yyyy.mm.dd-hh:MM');
    wx.getStorage({
      key: "countList",
      success(res) {
        countData =  res.data
        var newData = { 
          id: countData.length + 1, 
          money: parseFloat(that.data.money), 
          time: thisTime, info: that.data.infoment, 
          type: that.data.type 
        }
        countData.push(newData);
        wx.setStorage({
          key: "countList",
          data: countData,
          success(res) {
            wx.reLaunch({
              url: '../index/index'
            })
          }
        })
      },
      fail(err){
        console.log(err)
      }
    })     
  }
})