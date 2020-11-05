// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{}
  },

  exitLogin(){
    wx.showModal({
      title: '提示',
      content: '确认退出登录?',
      success (res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'token',
            success (res) {
              wx.redirectTo({
                url: '/pages/login/login'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  changePwd(){
    wx.navigateTo({
      url: './changePwd/changePwd',
    })
  },

  goOrder:function(e){
    wx.navigateTo({
      url: './order/order',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', e.currentTarget.dataset.type)
      }
    })
  },
  goExamination:function(e){
    wx.navigateTo({
      url: './examination/examination',
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'token'
    }).then(data => {
		//能在storage中取到值
    }).catch(err => {
      //storage取不到值
      wx.reLaunch({
        url: '../login/login'
      })
    })
    wx.getStorage({
      key: 'userInfo',
      success (res) {
        that.setData({
          user : res.data
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