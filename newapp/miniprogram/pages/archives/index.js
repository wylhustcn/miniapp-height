// pages/archives/index.js
const app = getApp(),
    t = require('../../utils/getdata'),
    u = require('../../utils/utils');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        showlog: false,
        parentInfo: {},
        childInfo: {},
        curtest: {},
        curList: [1, 2, 3, 4, 5],
        grade: '中下'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            capsuleInfo: app.globalData.capsuleInfo
        })
    },
    showlog() {
        this.setData({
            showlog: true
        })
    },
    onClose() {
        this.setData({
            showlog: false
        })
    },


    refresh() {
        const that = this
        wx.showLoading()
        t.getUserInfo().then(res => {
            console.log(res)
            const parent = res
            const childId = parent.curChildid
            if(childId!=''){
                t.getChildInfo(childId).then(r => {
                    const childInfo = r
                    console.log(childInfo)
                    that.setData({
                        childInfo,
                        parent
                    })
                    console.log(parent)
                    that.renderChild(childInfo)
                    t.getCurTest(childId).then(r => {
                        const curTest = r
                        console.log(curTest)
                        that.renderCurentTest(curTest)
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
    getback() {
        wx.navigateBack({
            delta: 0,
        })
    },
    addChild() {
        if(app.globalData.userLogin){
            wx.navigateTo({
                url: '../testHeight/index?page=' + 2,
            })
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
    toharchives() {
        if(app.globalData.userLogin){
            wx.navigateTo({
                url: '../harchives/index',
            })
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
    changebaby() {
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.showChangeChild = this.selectComponent('#showChangeChild')
    },
    renderCurentTest(curTest) {
        const {
            ageObj,
            sex
        } = this.data
        const curHeight = parseFloat(curTest.curheight)
        const curWeight = parseFloat(curTest.curweight)
        const {
            avheight,
            curList,
            grade
        } = u.getAgeList_grade(ageObj, sex, curHeight)

        this.setData({
            curHeight,
            curWeight,
            avheight,
            curList,
            grade
        })
        wx.hideLoading()
    },
    renderChild(childInfo) {
        const fheight = parseFloat(childInfo.fheight)
        const mheight = parseFloat(childInfo.mheight)
        const wheight = parseFloat(childInfo.wheight)
        console.log(childInfo, fheight, mheight)
        const sex = childInfo.sex
        const babyName = childInfo.babyName
        var herheight = (45.99 + 0.78 * (fheight + mheight) / 2).toFixed(1)
        if (childInfo.sex == '女') {
            herheight = (37.85 + 0.75 * (fheight + mheight) / 2).toFixed(1)
        }
        console.log(herheight)
        const ageObj = u.getAgeObj(childInfo.borthday)
        this.setData({
            fheight,
            mheight,
            wheight,
            herheight,
            ageObj,
            sex,
            babyName,
          
        })
    },
    changeAvator() {
        const childid =this.data.parent.curChildid
        const that=this
        console.log(childid)
        console.log(wx.cropImage)
        // if ( wx.cropImage) {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success:res=>{
                    console.log(res)
                   
                   let tempFilePath=res.tempFilePaths[0]
               
                        wx.cloud.uploadFile({
                            cloudPath:'avator/'+Date.parse(new Date())+tempFilePath.slice(-4),
                            filePath: tempFilePath, // 文件路径
                            success: res => {
                            
                              const avatorUrl=res.fileID
                 
                             t.updateChildAvator({childid,avatorUrl}).then(r=>{
                                that.refresh()
                             })
                            },
                            
                          })
                //    wx.cropImage({
                //     src: tempFilePath, 
                //     cropScale: '1:1', 
                //     success:res=>{
                        
                //     }
                //   })
            
               
                }
            })
        //   } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        //     wx.showModal({
        //       title: '提示',
        //       content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        //     })
        //   }
       
    },
    tologin(){
        wx.navigateTo({
          url: '../login/index',
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
       
        if(app.globalData.userLogin){
            this.refresh()
        }
        this.setData({
            userLogin:app.globalData.userLogin
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