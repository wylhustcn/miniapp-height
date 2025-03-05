// pages/mine/index.js
const app = getApp(),
    t = require('../../utils/getdata'),
    u = require('../../utils/utils');
Page({

    /**
     * 页面的初始数据
     */
    data: {
      
        childInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
    },
    refresh() {
        const that = this
        wx.showLoading()
        t.getUserInfo().then(res => {
            const parent = res
            const childId = parent.curChildid
            console.log(parent)
            if(childId!=undefined){
                t.getChildInfo(childId).then(r => {
                  
                    const childInfo = r
                    console.log(childInfo)
                    wx.hideLoading()
                    that.setData({
                        childInfo,
                        parent
                    })
                })
            }else{
                wx.hideLoading()
                that.setData({
                  
                    parent
                })
            }
            
            
        })
    },
    toweb(){
        wx.navigateTo({
          url: '../webview/index',
        })
    },
    changebaby(){
        if(app.globalData.userLogin){
            console.log(this.data.parent._openid)
            const parent_openid=this.data.parent._openid
            this.showChangeChild.show(parent_openid)
        }else{
            wx.showToast({
                title: '你还未登录',
                icon:'none'
              })
              setTimeout(res=>{
                  wx.navigateTo({
                    url: '../login/index',
                  })
              },1000)
        }
        
    },
    showContact(e){
      
        const id=e.currentTarget.dataset.idindex
        wx.navigateTo({
          url: '../showcontact/index?from='+id,
        })
    },
    showgz(){
        wx.navigateTo({
            url: '../showgz/index?from='+3,
          })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.showChangeChild=this.selectComponent('#showChangeChild')
    },
   
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if(app.globalData.userLogin){
            
            this.refresh()
        }
console.log(app.globalData.userLogin)
this.setData({
    userLogin:app.globalData.userLogin
})
    },
    tologin(){
        wx.navigateTo({
          url: '../login/index',
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        t.updateShareNumber()
    }
})