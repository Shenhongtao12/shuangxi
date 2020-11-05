// pages/customized.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initData:[],
    token:'',
    RecordId:'',
    slideButtons: [{
      type: 'warn',
      text: '删除',
      extClass: 'test',
    }],
    price:'',
    index:''
  },
  sumbitOrder(){
    var data = this.data.initData
    var idData = []
    for(var i = 0;i<data.length;i++){
      for(var j=0;j<data[i].ExamItems.length;j++){
        if(data[i].ExamItems[j].Selected == true){
          idData.push(data[i].ExamItems[j].Id)
        }
      }
    }
    let _this = this
        wx.request({
          url: `https://api.thra-ape.com/HDAARM/ConfirmExamItems`,
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
          data:{
            RecordId :_this.data.RecordId,
            Organization: 1,
            ExamItems: idData.toString()
          },
          header: {
            'Content-Type': "application/json",
            'Authorization' : _this.data.token
          }, // 设置请求的 header
          success: function(res) {
          let ajaxRes = res
            if(res.statusCode == 401){
              wx.reLaunch({
                url: '/pages/login/login'
              })
              wx.showToast({
                title: '请重新登录',
                icon: 'none',
                duration: 2000
              })
            }else{
              if(res.data.ErrorCode == 0){
                wx.navigateTo({
                  url: '../submit/submit',
                  success: function(res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('acceptDataFromOpenerPage',ajaxRes.data.Result)
                  }
                })
            }else{
              wx.showToast({
                title: res.data.ErrorMessage,
                icon: 'none',
                duration: 2000
              })
            }
            }
          },
        })
  },
  slideButtonTap(e) {
    var data = [...this.data.initData]
    var price = 0
    var index = 0
    var fatherIndex = e.currentTarget.dataset.father
    var childIndex = e.currentTarget.dataset.child
    data[fatherIndex].ExamItems[childIndex].Selected = false
    for(var i=0;i<data.length;i++){
      for(var j =0;j<data[i].ExamItems.length;j++){
        if(data[i].ExamItems[j].Selected == true){
          price += data[i].ExamItems[j].Price
          index = index+1
        }
      }
    }
    this.setData({
      initData : data,
      price : price.toFixed(2),
      index : index
    })
  },
  showAdd(){
    let that = this
    wx.navigateTo({
      url: './modal/modal',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage',that.data.initData)
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({
        initData:data
      })
    })
      wx.getStorage({
      key: 'token',
      success (res) {
        that.setData({
          token : res.data
        })
      }
    })
    wx.getStorage(   {
      key: 'RecordId',
      success (res) {
        that.setData({
          RecordId : res.data
        })
      }
    })

  },


  getNextPageData:function(data){
    var price = 0
    var index = 0
    for(var i=0;i<data.length;i++){
      for(var j =0;j<data[i].ExamItems.length;j++){
        if(data[i].ExamItems[j].Selected == true){
          price += data[i].ExamItems[j].Price
          index = index+1
        }
      }
    }
    this.setData({
      price : price.toFixed(2),
      index : index,
      initData : data
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var data = this.data.initData
    var price = 0
    var index = 0
    for(var i=0;i<data.length;i++){
      for(var j =0;j<data[i].ExamItems.length;j++){
        if(data[i].ExamItems[j].Selected == true){
          price += data[i].ExamItems[j].Price
          index = index+1
        }
      }
    }
    this.setData({
      price : price.toFixed(2),
      index : index,
      initData:data
    })
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