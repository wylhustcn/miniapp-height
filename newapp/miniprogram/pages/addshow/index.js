const app = getApp(),
    db = wx.cloud.database();
var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime)
const t=require('../../utils/getdata')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: 44,
        CDHeight: [
            [""],
            ["."],
            ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            ["厘米"]
        ],
        CDWeight: [
            [""],
            ["."],
            ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            ["kg"]
        ],
        curheight: '',

        curweight: '',
        nowdy: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            windowHeight: app.globalData.windowHeight,
            capsuleInfo: app.globalData.capsuleInfo,
            userInfo: app.globalData.userInfo,
            nowdy: dayjs().format('YYYY-MM-DD')
        })
    },
    bindHeightChange: function (t) {
        this.setData({
            curheight: this.data.CDHeight[0][t.detail.value[0]] + "." + this.data.CDHeight[2][t.detail.value[2]]
        });
    },
    bindWeightChange: function (t) {
        this.setData({
            curweight: this.data.CDWeight[0][t.detail.value[0]] + "." + this.data.CDWeight[2][t.detail.value[2]]
        });
    },
    setHeight: function () {
        var t = Array.from(Array(181), function (t, e) {
            return e + 50;
        });
        this.setData({
            "FMHeight[0]": t,
            "CDHeight[0]": t
        });
    },
    setWeight: function () {
        var t = Array.from(Array(101), function (t, e) {
            return e + 5;
        });
        this.setData({
            "CDWeight[0]": t
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setHeight()
        this.setWeight()
    },
    cancel() {
        wx.navigateBack({
            delta: 0,
        })
    },
    submit() {
        const that = this
        console.log(this.data.userInfo)
        const nowdy = this.data.nowdy
        const childid = this.data.userInfo.curChildid
        wx.showLoading({
            title: '记录中',
        })
        db.collection('testList').where({
            childid: childid,
            testTime: nowdy
        }).get({
            success: res => {
                console.log(res)
                if (res.data.length > 0) {
                    that.uptest(res.data[0]._id)

                } else {
                    that.addtest()
                }
            }
        })
    },

    async uptest(id) {
        const _ = db.command
        const userInfo = this.data.userInfo
      
        const childInfo = this.data

        await db.collection('testList').doc(id).update({
            data: {
                curheight: childInfo.curheight,
                curweight: childInfo.curweight,
                testTime: childInfo.nowdy
            },

        })
        await db.collection('parentList').doc(userInfo._id).update({
            data: {
                curtestTime: childInfo.nowdy,
                curheight: childInfo.curheight,
                curweight: childInfo.curweight,
                testNum: _.inc(1),
            },
            success: res => {
                wx.hideLoading()
                wx.showToast({
                    title: '记录成功',
                })
                setTimeout(res => {
                    wx.navigateBack({
                        delta: 0,
                    })
                }, 1000)
            }
        })
    },
    async addtest() {
        const _ = db.command
        const userInfo = this.data.userInfo
        const childInfo = this.data
        const childid = this.data.userInfo.curChildid
        await db.collection('testList').add({
            data: {
                childid: childid,
                curheight: childInfo.curheight,
                curweight: childInfo.curweight,
                testTime: childInfo.nowdy
            },
        })
        await db.collection('childList').doc(childid).update({
            data:{
                curheight: childInfo.curheight,
                curweight: childInfo.curweight,
                curtestTime:childInfo.nowdy,
            }
        })
        await db.collection('parentList').doc(userInfo._id).update({
            data: {
                curtestTime: childInfo.nowdy,
                curheight: childInfo.curheight,
                curweight: childInfo.curweight,
                testNum: _.inc(1),
                grade: _.inc(10),
                tatolGrade: _.inc(10)
            },
            success: res => {
                wx.hideLoading()
                wx.showToast({
                    title: '记录成功',
                })
                setTimeout(res => {
                    wx.navigateBack({
                        delta: 0,
                    })
                }, 1000)
            }
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