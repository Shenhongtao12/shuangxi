// pages/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result : '',
  },

  baseExam(){
    let that = this
    wx.navigateTo({
      url: './resultList/resultList',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('getCartDatalist',  that.data.result.BaseExam.ExamPackageList)
      }
    })
  },

  exactExam(){
    let that = this
    wx.navigateTo({
      url: './resultList/resultList',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('getCartDatalist',  that.data.result.ExactExam.ExamPackageList)
      }
    })
  },
  seriousExam(){
    let that = this
    wx.navigateTo({
      url: './resultList/resultList',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('getCartDatalist',  that.data.result.SeriousExam.ExamPackageList)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option){
    let that = this
    wx.getStorage({
      key: 'result',
      success (res) {
        that.setData({
          result : res.data
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