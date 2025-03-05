// pages/login/index.js
var db=wx.cloud.database(),app=getApp();
var dayjs=require('dayjs')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked:false,
        code:'',
        clicked:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       this.checkLogin()
    },
   
    login(){
        const that=this
        if(!this.data.checked){
            wx.showToast({
              title: '请先勾选相关协议',
              icon:'none'
            })
        }else{
            wx.getUserProfile({
              desc: 'desc',
              success:res=>{
                  console.log(res.userInfo)
                  that.setData({
                      userInfo:res.userInfo,
                      clicked:2
                  })
              }
            })
        }
    },
    writeLogin(){
        const userInfo=this.data.userInfo
        const phoneNumber=this.data.phoneNumber
        const regisTime=dayjs().format('YYYY-MM-DD')
        console.log(regisTime)
        wx.showLoading({
          title: '登录中',
        })
        db.collection('parentList').add({
            data:{
                ...userInfo,
                regisTime,
                phoneNumber,
                testNum:0,
                grade:0,
                tatolGrade:0,
                isManager:false,
                shareTimes:0,
                reportShare:0,
                otherShare:0
            },
            success:res=>{
                app.globalData.userLogin=1
                wx.hideLoading({
                  success: (res) => {
                    wx.showToast({
                        title: '登录成功',
                      })
                   setTimeout(res=>{
                      wx.switchTab({
                        url: '../index/index',
                      })
                   },500)
                  },
                })
               
            },
            fail:err=>{
                wx.showToast({
                  title: '登录失败请重新登录',
                  icon:'error'
                })
            }
        })
    },
    choose(){
        const checked=this.data.checked
        this.setData({
            checked:!checked
        })
    },

    getPhoneNumber(e){
       const that=this

       
        const code=e.detail.code
       
        wx.cloud.callFunction({
            name:'api',
            data:{
                method:'getPhone',
                code
            },
            success:res=>{
                console.log(res)
                
                const status=res.result.status
                if(status=='ok'){
                    const phoneNumber=res.result.result.phoneInfo.phoneNumber
                      that.setData({
                        phoneNumber
                      })
                      that.writeLogin()
                }
                
            },
            fail:err=>{
                console.log(err)
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

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

    }
})