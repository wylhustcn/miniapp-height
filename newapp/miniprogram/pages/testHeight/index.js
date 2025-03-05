// pages/archives/index.js
const app = getApp(),
    dayjs = require('dayjs'),t=require('../../utils/getdata'),
    db = wx.cloud.database();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        babyName: '',
        sexList: ['男', '女'],
        sex: '男',
        borthday: '请选择',
        boneList:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
        FMHeight: [ [ "" ], [ "." ], [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ], [ "厘米" ] ],
        CDHeight: [ [ "" ], [ "." ], [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ], [ "厘米" ] ],
        CDWeight: [ [ "" ], [ "." ], [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ], [ "kg" ] ],
        //母亲身高
        mheight: '',
        //父亲身高
        fheight: '',
        //期望身高
        wheight: '',
        //当前城市
        city: '北京',
       //宝贝测量身高
        curheight: '',
      //宝贝测量体重
        curweight: '',
        boneage: '选填',
        title:'周周测身高',
        showExplain:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        if(app.globalData.userLogin){
            console.log(options)
if(options.page=='1'){
    this.setData({
        title:'周周测身高'
    })
}else if(options.page=='2'){
    this.setData({
        title:'创建身高管理档案'
    })
}
        console.log(app.globalData)
        this.setData({
            capsuleInfo: app.globalData.capsuleInfo,
            testTime: dayjs().format('YYYY-MM-DD'),
           
 })
        }


    },

    changeAvator() {
      
        const that=this
        // if (wx.cropImage) {
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
                    that.setData({
                        avatorUrl:res.fileID
                    })
                      
                    },
                    
                  })
                //    wx.cropImage({
                //     src: tempFilePath, // 图片路径
                //     cropScale: '1:1', // 裁剪比例
                //     success:res=>{
                //         console.log(res)
                //         let tempFilePath=res.tempFilePaths[0]
                
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
    showExplain(){
        const showExplain=this.data.showExplain
        this.setData({
            showExplain:!showExplain
        })
    },
    cancelboneage(){
        this.setData({
            boneage: '请选择',
        })
    },
    bindFHeightChange: function(t) {
        this.setData({
            fheight: this.data.FMHeight[0][t.detail.value[0]] + "." + this.data.FMHeight[2][t.detail.value[2]]
        });
    },
    bindMHeightChange: function(t) {
        this.setData({
            mheight: this.data.FMHeight[0][t.detail.value[0]] + "." + this.data.FMHeight[2][t.detail.value[2]]
        });
    },
    bindWHeightChange: function(t) {
        this.setData({
            wheight: this.data.FMHeight[0][t.detail.value[0]] + "." + this.data.FMHeight[2][t.detail.value[2]]
        });
    },
    bindHeightChange: function(t) {
        this.setData({
            curheight: this.data.CDHeight[0][t.detail.value[0]] + "." + this.data.CDHeight[2][t.detail.value[2]]
        });
    },
    bindWeightChange: function(t) {
        this.setData({
            curweight: this.data.CDWeight[0][t.detail.value[0]] + "." + this.data.CDWeight[2][t.detail.value[2]]
        });
    },
    setHeight: function() {
        var t = Array.from(Array(181), function(t, e) {
            return e + 50;
        });
        this.setData({
            "FMHeight[0]": t,
            "CDHeight[0]": t
        });
    },
    setWeight: function() {
        var t = Array.from(Array(101), function(t, e) {
            return e + 5;
        });
        this.setData({
            "CDWeight[0]": t
        });
    },
    getSex: function (e) {
        const sexList = this.data.sexList
        const index = e.detail.value
        console.log(index)
        this.setData({
            sex: sexList[index]
        })
    },
    getBorthDay(e) {
        const borthday = e.detail.value
        this.setData({
            borthday
        })
    },
   
    
    
    
    getBoneage(e) {
        const boneList = this.data.boneList
        const index = e.detail.value
        console.log(index)
        this.setData({
            boneage: boneList[index]
        })
    },
    getback() {
        wx.navigateBack({
            delta: 0,
        })
    },
    addChildInfo() {
        if(app.globalData.userLogin){
            this.checkInput().then(res=>{
                if(res.type=='ok'){
                    
    this.createCild().then(res => {
       
               setTimeout(r=>{
                wx.navigateTo({
                    url: '../addsuccess/index',
                })
               },500)
            })
                }
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
    async checkInput(){
        const inputData=this.data
        if(inputData.babyName==''||inputData.sex==''||inputData.borthday==''||inputData.fheight==''||inputData.mheight==''||inputData.wheight==''||inputData.curheight==''||inputData.curweight==''){
            wx.showToast({
                title: '请填写完整信息',
                icon:'none'
              })
            return{
                type:'no'
            }
        }else{
            return {
                type:'ok'
            }
        }
    },
    async createCild() {
        const _ = db.command
        wx.showLoading({
          title: '创建中',
          icon:'none'
        })
        const userInfo = app.globalData.userInfo
        const childInfo = this.data
        console.log(childInfo)
        const child = await db.collection('childList').add({
            data: {
                parentid: userInfo._openid,
                phoneNumber:userInfo.phoneNumber,
                babyName: childInfo.babyName,
                sex: childInfo.sex,
                borthday: childInfo.borthday,
                fheight: childInfo.fheight,
                mheight: childInfo.mheight,
                wheight: childInfo.wheight,
                avatorUrl:childInfo.avatorUrl,
                city:childInfo.city,
                curheight: childInfo.curheight,
                curweight: childInfo.curweight,
                curtestTime:childInfo.testTime,
            }
        })

        const childid = child._id
        await db.collection('parentList').doc(userInfo._id).update({
            data: {
                curChildid: childid,
                curtestTime:childInfo.testTime,
                curchildName: childInfo.babyName,
                curheight: childInfo.curheight,
                curweight: childInfo.curweight,
                testNum:_.inc(1),
                grade:_.inc(10),
                tatolGrade:_.inc(10)
            }
        })
        await db.collection('testList').add({
            data: {
                childid: childid,
                curheight: childInfo.curheight,
                curweight: childInfo.curweight,
                boneage: childInfo.boneage,
                testTime: childInfo.testTime
            }
        })
       wx.showToast({
         title: '创建成功',
       })
      t.sendMessage()
        return {
            status: 'ok'
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.setHeight(), this.setWeight();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
this.setData({
    userInfo : app.globalData.userInfo
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