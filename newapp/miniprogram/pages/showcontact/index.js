const app=getApp()
const t=require('../../utils/getdata')
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
     console.log(options)
   this.setData({
    windowHeight:app.globalData.windowHeight,
    capsuleInfo:app.globalData.capsuleInfo,
    from:options.from
   })
  },
  close(){
      wx.switchTab({
        url: '../mine/index',
      })
  },
  copy(){
     wx.setClipboardData({
       data: 'MilkHightenCHN',
       success:res=>{
           wx.showToast({
             title: '复制成功',
           })
       }
     })
  },
  tablong(){
   wx.showToast({
     title: '请长按图片识别',
     icon:'none'
   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  cancel(){
      wx.navigateBack({
        delta: 0,
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
    t.updateShareNumber()
  }
})