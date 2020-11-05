// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    send: true,
    alreadySend: false,
    second: 60,
    quickly:false,
    register:false,
    error:'',
    rules: [{
      name: 'mobile',
      rules: {required: true, message: '请输入手机号'},
  }, {
      name: 'pwd',
      rules: {required: true, message: '请输入密码'},
  }],
  quicklyRules: [{
    name: 'mobile',
    rules: {required: true, message: '请输入手机号'},
  }, {
    name: 'vcode',
    rules: {required: true, message: '请输入验证码'},
  }],
registerRules: [{
  name: 'mobile',
  rules: {required: true, message: '请输入手机号'},
  }, {
  name: 'vcode',
  rules: {required: true, message: '请输入验证码'},
  }],
  formData: {
   
  },
  quicklyFormData:{

  },
  registerFormData:{

  }
},
  quicklyLoginType(){
    this.setData({
      quickly : true
    })
  },
  registerType(){
    this.setData({
      register : true
    })
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
        [`formData.${field}`]: e.detail.value
    })
  },
  quicklyFormInputChange(e){
    const {field} = e.currentTarget.dataset
    this.setData({
        [`quicklyFormData.${field}`]: e.detail.value
    })
  },
  registerFormInputChange(e){
    const {field} = e.currentTarget.dataset
    this.setData({
        [`registerFormData.${field}`]: e.detail.value
    })
  },
  getRegisterCode(){
    let that = this
    wx.request({
      url: `https://api.thra-ape.com/Customer/SendRegisterCaptcha?Phone=${that.data.registerFormData.mobile}`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'Content-Type': "application/json",
      }, // 设置请求的 header
      success: function(res) {
        if(res.data.ErrorCode == 0){
          that.setData({
            codeType : '已发送验证码'
           })
        }else{
          wx.showToast({
            title: res.data.ErrorMessage,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(res) {
        console.log('123',res)
      },
    })
  },

  getLoginCode(){
    
    let that = this
   
    wx.request({
      url: `https://api.thra-ape.com/Customer/SendLoginCaptcha?Phone=${that.data.quicklyFormData.mobile}`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'Content-Type': "application/json",
      }, // 设置请求的 header
      success: function(res) {
        if(res.data.ErrorCode == 0){
         that.setData({
          codeType : '已发送验证码'
         })
         that.setData({
          alreadySend: true,
          send: false
        })
        that.timer()
        }else{
          wx.showToast({
            title: res.data.ErrorMessage,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  login(){
    let that = this
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
              this.setData({
                  error: errors[firstError[0]].message
              })
          }
      } else {
          wx.showToast({
              title: '校验通过'
          })
      }
  })
    wx.request({
      url: `https://api.thra-ape.com/Customer/LoginByPassword`,
      data:{
        Phone : that.data.formData.mobile,
        Password : that.data.formData.pwd
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
      header: {
        'Content-Type': "application/json",
      }, // 设置请求的 header
      success: function(res) {
        if(res.data.ErrorCode == 0){
          wx.setStorage({
            key:"token",
            data:res.data.Result
          })
         
          wx.redirectTo({
            url: '../index/index'
          })
          wx.showToast({
            title: '登陆成功',
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
      },
      fail: function(res) {
        console.log('123',res)
      },
    })
  },
  quicklyLogin(){
    let that = this
    this.selectComponent('#quicklyForm').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
              this.setData({
                  error: errors[firstError[0]].message
              })

          }
      } else {
          wx.showToast({
              title: '校验通过'
          })
      }
  })
  wx.request({
    url: `https://api.thra-ape.com/Customer/LoginByPhone`,
    data:{
      Phone : that.data.quicklyFormData.mobile,
      Captcha : that.data.quicklyFormData.vcode
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
    header: {
      'Content-Type': "application/json",
    }, // 设置请求的 header
    success: function(res) {
      if(res.data.ErrorCode == 0){
        wx.setStorage({
          key:"token",
          data:res.data.Result
        })
        wx.redirectTo({
          url: '../index/index'
        })
        wx.showToast({
          title: '登陆成功',
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
    },
    fail: function(res) {
      console.log('123',res)
    },
  })
  },

  back(){
    this.setData({
      quickly:false,
      register:false,
      codeType : '获取验证码',
    })
  },


  register(){
    let that = this
    this.selectComponent('#registerForm').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
              this.setData({
                  error: errors[firstError[0]].message
              })
          }
      } else {
          wx.showToast({
              title: '校验通过'
          })
      }
  })
  wx.login({
    success (res) {
      if (res.code) {
        //发起网络请求
        wx.request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx72280998498b78c9&secret=8263fc2b11f486300e9b45a73c8bfb21&js_code=${res.code}&grant_type=authorization_code`,
          method: 'GET', 
          header: {
            'Content-Type': "application/json",
          }, 
          success: function(res) {
              wx.request({
                url: `https://api.thra-ape.com/Customer/Register`,
                data:{
                  Phone :that.data.registerFormData.mobile,
                  Captcha :that.data.registerFormData.vcode ,
                  OpenId:res.data.openid
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
                header: {
                  'Content-Type': "application/json",
                }, // 设置请求的 header
                success: function(res) {
                  if(res.data.ErrorCode == 0){
                    wx.setStorage({
                      key:"token",
                      data:res.data.Result.Token
                    })
                    wx.redirectTo({
                      url: '../index/index'
                    })
                    wx.showToast({
                      title: '登陆成功',
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
                },
              })
          },
          
        })
      }
    }
  })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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