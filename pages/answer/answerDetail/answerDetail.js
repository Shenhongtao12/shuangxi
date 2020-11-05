// pages/personality/choseBasic.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    age:58,
    sex:'',
    marry:'',
    showSubject:false,
    subject:[],
    choice:0,
    checked:false,
    percent1:0,
    result:'',
    token : ''
  },
  created (){
    let that = this
    wx.getStorage({
      key: 'token',
      success (res) {
        that.setData({
          token : res.data
        })
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
   
    bindvalue: function (e) {
      const value = e.detail.value
      this.setData({
        age:value
      })
    },
    selectSex(e){
      var sex =  e.currentTarget.dataset.sex
      this.setData({
        sex : sex,
      })
    },
    selectMarry(e){
      var marry =  e.currentTarget.dataset.marry
      this.setData({
        marry : marry,
      })
    },

    beginTest(){
      var _this = this;
      if(this.data.sex == '' || this.data.marry == '' ){
        wx.showToast({
          title: '请选择',
          icon: 'none',
          duration: 2000
        })
      }else{
        wx.request({
          url: 'https://api.thra-ape.com/HDAARM/Start',
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
          header: {
            'Content-Type': "application/json",
            'Authorization' : _this.data.token
          }, // 设置请求的 header
          data: {
           Age: _this.data.age,
           IsMan : _this.data.sex === 'male' ? true : false,
           Married :  _this.data.marry === 'true' ? true : false,
          },
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
              var result = res.data.Result
              const {age,sex,marry} = _this.data
              var data = {age,sex,marry}
              _this.triggerEvent('sendUserInfo',data)
              _this.setData({
              showSubject : true,
              subject:result,
              percent1 : (100 / result.Total) + _this.data.percent1
              })
              wx.setStorage({
                key:"marry",
                data:_this.data.marry
              })
            }
          },
          
        })
      }
     
    },
    radioChange(e) {
      var value  = e.detail.value
      this.setData({
        choice : value
      })
    },
    checkboxChange(e){
      var value = e.detail.value.toString()
      this.setData({
        choice : value
      })
    },
    backQuestion(){
      var _this = this;
      wx.request({
        url: `https://api.thra-ape.com/HDAARM/Back?choices=${this.data.choice}`,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
        header: {
          'Content-Type': "application/json",
          'Authorization' : _this.data.token
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
              _this.setData({
                subject :res.data.Result,
                checked:false,
                percent1 : _this.data.percent1 - (100 / res.data.Result.Total )
              })
              wx.pageScrollTo({
                scrollTop: 0
              })
          }else{
            wx.showToast({
              title: res.data.ErrorMessage,
              icon: 'none',
              duration: 2000
            })
          }
        }
          }
          
      })
    },
    nextQuestion(){
      var _this = this;
        wx.request({
          url: `https://api.thra-ape.com/HDAARM/Next?choices=${this.data.choice}`,
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
          header: {
            'Content-Type': "application/json",
            'Authorization' :_this.data.token
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
                if(res.data.Result.Done == true){
                  wx.setStorage({
                    key:"RecordId",
                    data:res.data.Result.ResultId
                  })
                  let that = res.data.Result
                  wx.request({
                    url: `https://api.thra-ape.com/HDAARM/GetExamPackage?id=${res.data.Result.ResultId}&organizationId=0`,
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
                    header: {
                      'Content-Type': "application/json",
                      'Authorization' : _this.data.token
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
                          wx.navigateTo({
                            url: '/pages/result/result',
                          })
                          var result = res.data.Result
                          result['Score'] = that.Score
                          wx.setStorage({
                            key:"result",
                            data:result
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
                 }else{
                 
                  _this.setData({
                    subject :res.data.Result,
                    checked:false,
                    percent1 : (100 / res.data.Result.Total) + _this.data.percent1
                  })
                 }
              
                wx.pageScrollTo({
                  scrollTop: 0
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

    
    }
  }
})
