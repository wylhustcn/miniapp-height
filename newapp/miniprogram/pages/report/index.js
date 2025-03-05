// pages/archives/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp(),t=require('../../utils/getdata'),u=require('../../utils/utils')


Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        childInfo: {},
        grade:'中下',
        curList:[55.9,57.2,58.7,60.3]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options)
        if(options.parentId!=undefined){
            this.setData({
                parentId:options.parentId
            })
        }else{
            this.setData({
                parentId:''
            })
        }
        if(options.page==1){
            this.getReport()
        }else{
         
            this.refresh()
         
        }
        this.setData({
            capsuleInfo: app.globalData.capsuleInfo,
            capsuleInfo: app.globalData.capsuleInfo
        })
    },
    getReport(){
        const parentId=this.data.parentId
        const {curHeight,curWeight,avHeight,ageObj,sex}=app.globalData
        const {curList,grade,bmi,hleve,percent,wleve}= u.getAgeList_grade(ageObj,sex,curHeight,curWeight)
       console.log(bmi)
        this.setData({
            curHeight,curWeight,avHeight,ageObj,grade,curList,bmi, hleve,percent,wleve
        })
        const that = this
        wx.showLoading()
        t.getUserInfo(parentId).then(res => {
            const parent = res
            const childId = parent.curChildid
          
           
            t.getChildInfo(childId).then(r => {
                const childInfo = r
                console.log(childInfo)
                const { sex,fheight,mheight}=childInfo
                const herheight=u.getHerHeight(sex,fheight,mheight)
                wx.hideLoading()
                that.setData({
                    childInfo,
                    parent,
                    herheight,
                    BMIlist:u.getBMIList(ageObj,sex)
                })
              
        that.bhechart.show()
        that.bwechart.show()
        that.hstate.show()
        that.ycheight.show()
            })
            
        })
    },
   
    changebaby() {
        console.log(this.data.parent._openid)
        const parent_openid=this.data.parent._openid
        this.showChangeChild.show(parent_openid)
    },
   
  
   

    refresh(e) {
        const parentId=this.data.parentId
            const that = this
            wx.showLoading()
            t.getUserInfo(parentId).then(res => {
                const parent = res
                const childId = parent.curChildid
              
                that.setData({
                    parent
                })
                t.getChildInfo(childId).then(r => {
                    const childInfo = r
                    console.log(childInfo)
                    that.setData({
                        childInfo
                    })
                    that.renderChild(childInfo)
                   
                    t.getCurTest(childId).then(r => {
                        const curTest = r
                        console.log(curTest)
                        that.renderCurentTest(curTest)
                    })
                })
                
            })
        
    },
    renderCurentTest(curTest) {
        const {ageObj,sex,childInfo}=this.data
        const curHeight=parseFloat(curTest.curheight)
        const curWeight=parseFloat(curTest.curweight)
      const { curList,grade,avheight,bmi, hleve,percent,wleve}= u.getAgeList_grade(ageObj,sex,curHeight,curWeight)
      console.log(bmi)
        this.setData({
            curHeight,curWeight,avheight,curList,grade,bmi, hleve,percent,wleve
        })
      
        app.globalData.curHeight=curHeight
        app.globalData.curWeight=curWeight
        app.globalData.avHeight=avheight
        app.globalData.sex=sex
        app.globalData.ageObj=ageObj
      
        wx.hideLoading()
        this.setData({
            curHeight,curWeight,avHeight:avheight,ageObj,grade,curList,bmi, hleve,percent,wleve
        })
        this.bhechart.show()
        this.bwechart.show()
        this.hstate.show()
        this.ycheight.show()
    },
    renderChild(childInfo) {
        const fheight = u.fixed(childInfo.fheight)
        const mheight = u.fixed(childInfo.mheight)
        const wheight = u.fixed(childInfo.wheight)
        const sex=childInfo.sex
        const babyName=childInfo.babyName
        var herheight = (45.99 + 0.78 * (fheight + mheight) / 2).toFixed(1)
        if (sex == '女') {
            herheight = (37.85 + 0.75 * (fheight + mheight) / 2).toFixed(1)
        }
        const ageObj=u.getAgeObj(childInfo.borthday)
       
        this.setData({
            fheight,
            mheight,
            wheight,
            herheight,
            ageObj,
            sex,
            babyName,
            BMIlist:u.getBMIList(ageObj,sex)
        })
    },
    
   
    getback() {
       wx.reLaunch({
        
         url: '../archives/index',
       })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.showChangeChild=this.selectComponent('#showChangeChild')
        this.bhechart=this.selectComponent('#bhechart')
        this.bwechart=this.selectComponent('#bwechart')
        this.hstate=this.selectComponent('#hstate')
        this.ycheight=this.selectComponent('#ycheight')
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // this.getChildInfo(app.globalData.userInfo.curChildid)
       
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
        t.updateShareReportNumber()
        
        console.log(this.data.parent)
        const parentId=this.data.parent._openid
        return{
            title:'记录孩子每一天',
            path:'pages/report/index?parentId='+parentId,
            imageUrl:''
        }
    }
})