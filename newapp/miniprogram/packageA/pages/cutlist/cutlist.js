// packageA/pages/cutlist/cutlist.js

var dayjs = require('dayjs'),app=getApp(),g=require('../../../utils/getdata')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentDate1: new Date().getTime(),
        maxDate: new Date().getTime(),
        minDate1: new Date().getTime() - 31104000000,
        currentDate2: new Date().getTime(),
        minDate2: new Date().getTime() - 31104000000,
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            }
            if (type === 'month') {
                return `${value}月`;
            }
            if (type === 'day') {
                return `${value}日`;
            }
            return value;
        },
        showChooseDate: false,
        dateIndex: 0,
        endDate: '2022-09-27',
        beginDate: '',
        list:[],
        page:0
    },
    onInput(e) {
        const dateIndex = this.data.dateIndex
        const time = e.detail
        console.log(time)
        if (dateIndex == 0) {
            this.setData({
                beginDate: dayjs(time).format('YYYY-MM-DD')
            })
        } else {
            this.setData({
                endDate: dayjs(time).format('YYYY-MM-DD')
            })
        }
    },
    getBeginDate() {
        this.setData({
            dateIndex: 0
        })
    },
    getEndDate() {
        this.setData({
            dateIndex: 1
        })
    },
    onClose() {
        this.setData({
            showChooseDate: false,
            beginDate: '',
            endDate: ''
        })
    },
    comform() {
        this.setData({
            showChooseDate: false,
        })
    },
    showTime(){
        this.setData({
            showChooseDate:true
        })
    },
    look_hide(e){
const id=e.currentTarget.dataset.id
console.log(id)
const list=this.data.list
list.forEach(item=>{
    if(item._id==id){
        item.open=!item.open
    }
})
this.setData({
    list
})
    },
    export(e){
        console.log(e)
        const id=e.currentTarget.dataset.id
       const  endDate=this.data.endDate
       const beginDate=this.data.beginDate
       const parent_openid=e.currentTarget.dataset.openid
       wx.navigateTo({
         url: '../cartlist/cartlist?id='+id+'&endDate='+endDate+"&beginDate="+beginDate+'&parent_openid='+parent_openid+'&isManager='+true,
       })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            capsuleInfo: app.globalData.capsuleInfo
        })
       
    },
    copyid(e){
            const id=e.currentTarget.dataset.id
           
            wx.setClipboardData({//复制文本
                data: id,
                 success: function (res) {
                       wx.showToast({
                         title: '复制成功',
                        icon:"none",
                        mask:"true"
                      })
                }
             })
        
    },
    chooseDate() {

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    search(){
        this.setData({
            page:0,
            list:[]
        })
        this.getManageList()
    },
    getManageList(){
        const page=this.data.page
        const searchWord=this.data.searchWord
        const beginTime=this.data.beginDate
        const endTime=this.data.endDate
        const oldlist=this.data.list
        wx.showLoading()
        g.getManageList({
            page,
            searchWord,
            beginTime,
            endTime,
        }).then(res=>{
            wx.hideLoading()
            console.log(res)
            const newList=res.data
            const list=oldlist.concat(newList)
          this.setData({
              list
          })
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        
        const mothyearday=dayjs().subtract(0, 'month')
        console.log(mothyearday.$y+'-'+mothyearday.$M+'-'+mothyearday.$D)
        this.setData({
            page:0,
            list:[]
        })
        this.getManageList()
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
      const page=this.data.page
      this.setData({
          page:page+20
      })
      this.getManageList()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})