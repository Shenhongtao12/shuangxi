// pages/submit.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate:null,
    documentType:['身份证','护照'],
    IDType:'',
    oneSubmitResult:{},
    dateTime1: 'null',
    dateTimeArray1: null,
    startYear: 2020,
    endYear: 2030,
    yearsData:[2020,2021,2022,2023,2024,2025,2026,2027,2028.2029,2030],
    startTime:'',
    endTime:'',
    IsSelf:'',
    Name:'',
    IDNumber:'',
    Phone:'',
    ExamDateId:'',
    showTime:'',
    RecordId:'',
    token:'',
    image:'../../images/avatar.png',
    isMarry:null,
    noMarry:null,
    name : ''
  },
  bindPhoneInput(e){
    this.setData({
      Phone: e.detail.value
    })
  },
  bindIdInput(e){
    this.setData({
      IDNumber: e.detail.value
    })
  },
  bindIDTypeChange: function(e) {
    this.setData({
      IDType: e.detail.value
    })
  },
  gpAppointmentName(e){
    wx.navigateTo({
      url: './appointmentName/appointmentName',
    })
  },
  radioChangeType(e){
    this.setData({
      IsSelf:e.detail.value
    })
  },
  bindNameInput(e){
    this.setData({
      Name: e.detail.value
    })
  },
  sumbit(){
    let that = this
    const {RecordId,IDType,IDNumber,ExamDateId,Name,Phone,IsSelf} = this.data
    wx.request({
      url: `https://api.thra-ape.com/HDAARM/ConfirmOrder`,
      data:{
        RecordId,IDType,IDNumber,ExamDateId,Name,Phone,IsSelf
      },
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
          wx.removeStorage({
            key: 'token',
          })
        }else{
          if(res.data.ErrorCode == 0){
            wx.redirectTo({
              url: '/pages/pay/pay?price=' + res.data.Result
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

  changeDateTime1(e) {
    const year = this.data.yearsData[e.detail.value[0]]
    const mounth = e.detail.value[1] + 1
    const day = e.detail.value[2] + 1
    const  hours = e.detail.value[3]
    const minute =e.detail.value[4]
    const str = `${year}-${mounth}-${day} ${hours}:${minute}`
    if(this.data.endTime != ''){
      this.setData({
        startTime:'',
        endTime:''
      })
    }
    if(this.data.startTime == ''){
      this.setData({
        startTime : str,
        dateTime1: e.detail.value
      })
      wx.showToast({
        title: '请选择结束时间',
        icon: 'success',
        duration: 2000
      })
    }else{
      this.setData({
        endTime : str,
        dateTime1: e.detail.value
      })
      wx.showToast({
        title: '选择成功',
        icon: 'success',
        duration: 2000
      })
    }
  },

  radioChangemarry(e){

  },

  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({ 
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },


  goAppointment(e){
    var start = this.data.startTime
    var end = this.data.endTime
    if(end == ''){
      wx.showToast({
        title: '请选择体检时间',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.navigateTo({
        url: '../submit/appointment/appointment',
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { start,end })
        }
      })
    }
  },

  

  /*获取选择人的信息 */
  getNextPageName:function(data){
    that.setData({
      name : data
    })
  },

  getNextPageData:function(data){
    this.setData({
      ExamDateId:data.id,
      showTime:data.time
    })
  },


 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option){
    let that = this
  const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({
        oneSubmitResult : data
      })
    })
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
        that.setData({
          token : res.data
        })
      }
    })
    wx.getStorage({
      key: 'marry',
      success (res) {
        if(res.data == 'true'){
          that.setData({
            isMarry : true
          })
        }else{
          that.setData({
            noMarry : true
          })
        }
       
      }
    })
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
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