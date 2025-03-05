import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp(),u=require('../../utils/utils'),g=require('../../utils/getdata');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        childList: {}
    },

    /**
     * 组件的方法列表
     */

    methods: {
         show(parent_openid) {
            const that=this
            
            wx.showLoading({
                title: '加载中',
            })
            g.getUser(parent_openid).then(res=>{
                console.log(res)
                g.getChilds(parent_openid).then(res=>{
                    console.log(res)
                    that.renderChild(res)
                })
            })
        },
        renderChild(cList) {
            console.log(cList)
            const that = this
            const parentInfo = app.globalData.userInfo
            console.log(parentInfo)
            let childList = []

            cList.forEach(item => {
                var child = {
                    dayinfo: u.getAgeObj(item.borthday),
                    babyName: item.babyName,
                    sex: item.sex,
                    iscurrent: item._id == parentInfo.curChildid ? 1 : 0,
                    childid: item._id,
                    avatorUrl:item.avatorUrl||'../../images/index/IP-02@2x.png'
                }
                childList.push(child)
            })
            console.log(childList)
            childList.sort((a, b) => {
                return b.iscurrent - a.iscurrent
            })
            wx.hideLoading()
            this.setData({
                childList,
                show: true,
                parentInfo
            })
        },
        
        onClose() {
            this.setData({
                show: false
            })
        },
        onClose() {
            this.setData({
                show: false
            })
        },
        changeChild(e) {
            console.log(e)
            const child = e.currentTarget.dataset.item
            const parentInfo = this.data.parentInfo
            console.log(parentInfo)
            const that = this
            this.setData({
                show: false
            })
            Dialog.confirm({
                    context: this,
                    title: '提示',
                    message: '切换后，首页的默认宝贝将变成切换后的宝贝',
                    confirmButtonText: '确定切换',
                    selector: '#change',
                    cancelButtonText: '暂不切换',
                })
                .then(() => {
                    console.log(222)
                    try {
                        g.changeChild(child,parentInfo._id).then(res=>{
                            console.log(res)
                            that.triggerEvent('refresh',parentInfo._id)
                        })
                       
                    } catch (error) {
                        console.log(error)
                    }
                    console.log(33)
                })
                .catch(() => {
                    // on cancel
                });
        },
      
        delete(e) {
            const childid = e.currentTarget.dataset.id
            const that = this
            this.setData({
                show: false
            })
            Dialog.confirm({
                    context: this,
                    title: '提示',
                    message: '是否删除该宝贝',
                    confirmButtonText: '确定删除',
                    selector: '#delete',
                    cancelButtonText: '暂不删除',

                })
                .then(() => {
                    that.deletechild(childid)
                    // on confirm
                })
                .catch(() => {
                    // on cancel
                });
        },
        deletechild(childid) {
            const that=this
            console.log('开始删除')
            wx.showLoading({
                title: '删除中',
            })
            console.log(11111)
            wx.cloud.callFunction({
                name: 'api',
                data: {
                    method: 'deletechild',
                    childid
                },
                success: res => {
                    console.log('删除成功')
                    wx.hideLoading()
                    wx.showToast({
                        title: '删除成功',
                    })
                    setTimeout(res=>{
                        that.triggerEvent('refresh')
                        console.log(res)
                    },500)
                  
                },
                fail: err => {
                    console.log('删除失败')
                    wx.showToast({
                        title: '删除失败',
                        icon:'error'
                    })
                    setTimeout(res=>{
                        that.triggerEvent('refresh')
                      
                    },500)
                }
            })
        },
    },


})