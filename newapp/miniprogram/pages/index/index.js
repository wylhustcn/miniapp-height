const app=getApp(),db=wx.cloud.database(),t=require('../../utils/getdata')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:44
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },

  toarchives(){
    wx.navigateTo({
        url: '../archives/index',
      }) 
},
  totestHeight(){
      console.log(app.globalData.userInfo)
      const userInfo=app.globalData.userInfo

      if(userInfo.curChildid!=undefined&&userInfo.curChildid!=''){
          wx.navigateTo({
            url: '../addshow/index',
          })
      }else{
wx.navigateTo({
        url: '../testHeight/index?page='+1,
      })
      }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  tomanage(){
      console.log(111)
      wx.navigateTo({
        url: '../../packageA/pages/cutlist/cutlist',
      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    t.getUserInfo().then(res=>{
        console.log(res)
        this.setData({
            userInfo:res
        })
    })
    app.globalData.firstTimeTest=false
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
    t.updateShareNumber()
  }
})