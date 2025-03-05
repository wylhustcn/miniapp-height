var app = getApp()
var t = {
   
    sendMessage: async function () {

        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: ' sendMessage'
                },
                success: res => {
                    console.log(res)
                    resolve(res)
                },

            })
        })
    },
    getUserInfo: async function (shareOpenid='') {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'getUserInfo',
                    shareOpenid:shareOpenid

                },
                success: res => {
                    console.log(res)
                    if(res.result.data.length){
                        const userInfo = res.result.data[0]
                        app.globalData.userInfo = userInfo
                        app.globalData.userLogin=1
                        resolve(userInfo)
                    }else{
                        app.globalData.userLogin=0
                        app.globalData.userInfo = {}
                        resolve('ok')
                    }
                    
                   
                },

            })
        })
    },
    getChildInfo: async function (id) {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'getChildInfo',
                    id: id
                },
                success: res => {

                    const childInfo = res.result.data
                    app.globalData.childInfo = childInfo
                    resolve(childInfo)
                },
                fail:err=>{
                    wx.hideLoading()
                }

            })
        })
    },
    getCurTest: async function (id) {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'getCurTest',
                    childid: id
                },
                success: res => {
                    const curTest = res.result.data[0]
                    resolve(curTest)
                },
            })
        })
    },
    getChilds: async function (parent_openid) {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'getChilds',
                    parent_openid:parent_openid
                },
                success: res => {
                    wx.hideLoading()
                    const childs = res.result.data
                    resolve(childs)
                },

            })
        })
    },
    changeChild: async function (Child, docid) {
        console.log(Child,docid)
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'changeChild',
                    childid: Child.childid,
                    parentdocid:docid
                },
                success: res => {
                    wx.hideLoading()
                    console.log(res)
                    const result = res.result
                    resolve(result)
                },
                fail:err=>{
                    console.log(err)
                }

            })
        })
    },
    getChildAllTest: async function (childid) {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'getChildAllTest',
                    childid: childid,
                },
                success: res => {
                    wx.hideLoading()
                    const result = res.result
                    resolve(result)
                },

            })
        })
    },
    getManageList: async function (data) {
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'getManageList',
                    ...data
                },
                success: res => {
                    wx.hideLoading()
                    const result = res.result
                    resolve(result)
                },

            })
        })
    },
    getCartListData:async function (data){
        wx.showLoading()
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'getCartListData',
                    parentdocid:data.id,
                    benginDate:data.benginDate,
                    endDate:data.endDate
                },
                success: res => {
                    wx.hideLoading()
                    wx.hideLoading()
                    const result = res.result
                    resolve(result)
                },

            })
        })
    },
    updateChildAvator:async function (data){
        wx.showLoading()
        console.log(data)
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'updateChildAvator',
                    childid:data.childid,
                    avatorUrl:data.avatorUrl
                },
                success: res => {
                    wx.hideLoading()
                    wx.hideLoading()
                    const result = res.result
                    resolve(result)
                },

            })
        })
    },
    getUser: async function (openid) {
        console.log(openid)
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'getUser',
                    popenid:openid
                },
                success: res => {
                    console.log(res)

                    const userInfo = res.result.data[0]
                    app.globalData.userInfo = userInfo
                    resolve(userInfo)
                },

            })
        })
    },

    updateShareNumber: async function (openid) {
        console.log(openid)
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'updateShareNumber',
                   
                },
                success: res => {
                    console.log(res)
                    resolve(res)
                },

            })
        })
    },
    updateShareReportNumber: async function (openid) {
        console.log(openid)
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'updateShareReportNumber',
                   
                },
                success: res => {
                    console.log(res)
                    resolve(res)
                },

            })
        })
    },
}
module.exports = t