//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
    goAnswer:function(){
      wx.navigateTo({
        url: '../answer/answer',
    })
    },
    goMyUser:function(){
      wx.navigateTo({
        url: '../user/user'
    })
    },
    goMyPort:function(){
      wx.navigateTo({
        url: './report/report',
    })
    },
    onLoad(){
      wx.getUserInfo({
        success: function(res) {
          wx.setStorage({
            key:"userInfo",
            data:res.userInfo
          })
        }
      })
      wx.login({
        success (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: `https://api.thra-ape.com/Customer/LoginByCode?code=${res.code}`,
              method: 'GET', 
              header: {
                'Content-Type': "application/json",
              }, 
              success: function(res) {
                 console.log(res)
              },
              
            })
          }
        }
      })
    },
})
