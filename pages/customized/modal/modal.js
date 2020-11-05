// pages/customized/modal/modal.js
Page({
  /**
   * 组件的属性列表
   */
  /**
   * 组件的初始数据
   */
  data: {
    addData:[],
    fatherIndex:[],
    itemIndex:[],
    selectData:[]
  },

  onLoad: function(option){
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({
        addData : data,
      })
    })
  },
 
  submit:function(){
    const selectData = [...this.data.addData] //复制数组
    const fatherIndex = this.data.fatherIndex
    const itemIndex = this.data.itemIndex
    for(var i = 0;i<fatherIndex.length;i++){
      selectData[fatherIndex[i]].ExamItems[itemIndex[i]].Selected = true
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.getNextPageData(selectData)
    wx.navigateBack({//返回
      delta: 1
    })
  },


  checkboxChange: function(e) {
    var item = e.detail.value //选中的数组
    var itemIndex = []
    var fatherIndex = []
    for (var i = 0; i < item.length; i++) {
      var row = item[i].split(",") //将数组进行分割
      itemIndex = itemIndex.concat(row[0]) //数组下表的第一个为id
      fatherIndex = fatherIndex.concat(row[1]) //数组下表的第二个为name
    }
    this.setData({
      itemIndex : itemIndex,
      fatherIndex : fatherIndex
    })
  }


})
