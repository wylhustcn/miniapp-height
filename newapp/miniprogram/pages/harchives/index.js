const app = getApp(),
    t = require('../../utils/getdata'),
    u = require('../../utils/utils');

Page({

    /**
     * 页面的初始数据
     */
    data: {
       currentIndex:1,
       show:false,
       childInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            capsuleInfo:app.globalData.capsuleInfo
           })
    },
    changebaby(){
        console.log(this.data.parent._openid)
        const parent_openid=this.data.parent._openid
        this.showChangeChild.show(parent_openid)
    },
 
    getherHeight(childInfo){
        console.log(childInfo)
        const fheight=parseFloat(childInfo.fheight)
        const mheight=parseFloat(childInfo.mheight)
        console.log(fheight,mheight)
         if(childInfo.sex=='男'){
             return (45.99+0.78*(fheight+mheight)/2).toFixed(1)
             
         }else{
            return (37.85+0.75*(fheight+childInfo)/2).toFixed(1)
         }
    },
    getChildTest(id){
       const that=this
        t.getChildAllTest(id).then(res=>{
            console.log(res)
             that.renderTestResult(res.data)
        })
      
    },
    renderTestResult(list){
        const that=this
        let newList=list.sort((a,b)=>{
            return b.curheight-a.curheight
        })
        console.log(newList)
        let renderlist=[]
        newList.forEach((e,index)=>{
           const ageObj=u.getAgeObj(that.data.childInfo.borthday,e.testTime)
            let obj={
                curheight:e.curheight,
                curweight:e.curweight,
                testTime:e.testTime,
                ageObj:ageObj,
                avheight:u.getAgeList_grade(ageObj,e.sex).avheight,
                hleve:u.getAgeList_grade(ageObj,e.sex,e.curheight,e.curweight)
            }
                for(let i=0;i<renderlist.length;i++){
                    if(renderlist[i].height==e.curheight){
                        renderlist[i].items.push(obj)
                        return
                    }
                }
                renderlist.push({
                    toptime: e.testTime,
                    age:u.getAgeObj(that.data.childInfo.borthday,e.testTime),
                    height:parseFloat(e.curheight),
                    open:index==0?true:false,
                    items:[obj]
                 })
        })
        console.log(renderlist)
        wx.hideLoading()
        this.setData({
            testList:renderlist
        })
    },
   
 
    openlist(e){
           const index=e.currentTarget.dataset.index 
           let testList=this.data.testList
           console.log(testList,e)
           testList[index].open=!testList[index].open
           this.setData({
               testList
           })
    },

    onClose(){
        this.setData({
            show:false
        })
    },
    changeIndex(e){
        const index=e.currentTarget.dataset.index
     
        if(index==2){
           this.bhechart.show()
        }else if(index==3){
            this.bwechart.show()
        }
        this.setData({
            currentIndex:index
        })

    },
    toreport(e){
        const item=e.currentTarget.dataset.item
        console.log(item)

        app.globalData.curHeight=item.curheight
        app.globalData.curWeight=item.curweight
        app.globalData.avHeight=item.avheight
        app.globalData.sex=this.data.childInfo.sex
        app.globalData.ageObj=item.ageObj
        wx.navigateTo({
          url: '../report/index?page=1',
        })
    },
    getback(){
        wx.navigateBack({
          delta: 0,
        })
    },
    addRecord(){

        wx.navigateTo({
          url: '../addshow/index',
        })
    },
   
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.showChangeChild=this.selectComponent('#showChangeChild')
        this.bhechart=this.selectComponent('#bhechart')
        this.bwechart=this.selectComponent('#bwechart')
    },
    refresh(e){
        const that = this
        wx.showLoading()
        t.getUserInfo().then(res => {
            console.log(res)
            const parent = res
            const childId = parent.curChildid
          console.log(parent)
            
            t.getChildInfo(childId).then(r => {
                const childInfo = r
                console.log(childInfo)
                that.setData({
                    childInfo,
                    parent
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
        const {ageObj,sex}=this.data
        const curHeight=parseFloat(curTest.curheight)
        const curWeight=parseFloat(curTest.curweight)
      const { curList,grade,avheight,bmi, hleve,percent,wleve}= u.getAgeList_grade(ageObj,sex,curHeight)
      
        this.setData({
            curHeight,curWeight,avheight,curList,grade,bmi, hleve,percent,wleve
        })
      
        app.globalData.curHeight=curHeight
        app.globalData.curWeight=curWeight
        app.globalData.avHeight=avheight
        app.globalData.sex=sex
        app.globalData.ageObj=ageObj
    },
    renderChild(childInfo) {
        const fheight = u.fixed(childInfo.fheight)
        const mheight = u.fixed(childInfo.mheight)
        const wheight = u.fixed(childInfo.wheight)
        const sex=childInfo.sex
        const babyName=childInfo.babyName
        var herheight = (45.99 + 0.78 * (fheight + mheight) / 2).toFixed(1)
        if (childInfo.sex == '女') {
            herheight = (37.85 + 0.75 * (fheight + mheight) / 2).toFixed(1)
        }
        const ageObj=u.getAgeObj(childInfo.borthday)
        this.getChildTest(childInfo._id)
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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
       this.refresh()
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