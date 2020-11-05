// pages/user/changePwd/changePwd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    token:''
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  changePwd(){
    let that = this
    wx.request({
      url: `https://api.thra-ape.com​/Customer/UpdatePassword`,
      data: that.data.inputValue,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'Content-Type': "application/json",
        'Authorization':that.data.token
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
              wx.navigateBack({//返回
                delta: 1
              })
              wx.showToast({
                title: '修改成功',
                icon: 'none',
                duration: 2000
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'token',
      success (res) {
        that.setData({
          token:res.data
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