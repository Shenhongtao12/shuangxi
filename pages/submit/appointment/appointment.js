// pages/submit/appointment/appointment.js
var time = require('../../../utils/changeTime')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RecordId:'',
    data:[]
  },
   
  appoin(e){
    const data = {id:e.currentTarget.dataset.id,time:e.currentTarget.dataset.time}
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.getNextPageData(data)
    wx.navigateBack({//返回
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option){
    let that =  this
    const eventChannel = this.getOpenerEventChannel()
    wx.getStorage({
      key: 'RecordId',
      success (res) {
        that.setData({
          RecordId : res.data
        })
      }
    })
    wx.getStorage({
      key: 'token',
      success (res) {
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
          wx.request({
            url: `https://api.thra-ape.com/HDAARM/GetAvailableTimes`,
            data:{
              RecordId:that.data.RecordId,
              StartTime :data.start,
              EndTime :data.end
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
            header: {
              'Content-Type': "application/json",
              'Authorization':res.data
            }, // 设置请求的 header
            success: function(res) {
              if(res.statusCode == 401){
                wx.reLaunch({
                  url: '/pages/login/login'
                })
                wx.showToast({
                  title: '请重新登录',
                  icon: 'none',
                  duration: 2000
                })
              }else{
                if(res.data.ErrorCode == 0){
                  res.data.Result.map(item => {
                    var date = new Date(date)
                    var oldTime = (new Date(item.StartTime)).getTime();
                    item.StartTime = time.formatTime(oldTime,'Y-M-D h:m:s')
                    var old1Time = (new Date(item.EndTime)).getTime();
                    item.EndTime = time.formatTime(old1Time,'Y-M-D h:m:s')
                  })
                  that.setData({
                    data:res.data.Result
                  })
                }else{
                  wx.showToast({
                    title: res.data.ErrorMessage,
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            },
          })
        })
      }
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
    
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})