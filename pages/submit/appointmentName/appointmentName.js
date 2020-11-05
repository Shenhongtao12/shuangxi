// pages/submit/appointmentName/appointmentName.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    error:false
  },

  radioChange(e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.getNextPageName( e.detail.value)
    wx.navigateBack({//返回
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this
    wx.getStorage({
      key: 'token',
      success (res) {
        wx.request({
          url: 'https://api.thra-ape.com​/Customer/GetContactListByCustomerId',
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
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
              wx.removeStorage({
                key: 'token',
              })
            }else{
              if(res.data.ErrorCode == 0 && res.data.Result.length == 0){
                  wx.showToast({
                    title: '没有可选体检人',
                    icon: 'none',
                    duration: 2000
                  })
              }else{
                that.setData({
                  data:res.data.Result
                })
              }
            }
          },
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