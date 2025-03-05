// app.js
App({
  onLaunch: function () {
      const updateManager=wx.getUpdateManager()
      updateManager.onUpdateReady(function(){
          wx.showModal({
           title:'更新提醒',
           content:'新版本已经准备好,是否重启更新',
           success:res=>{
               if(res.confirm){
                   updateManager.applyUpdate()
               }
           }
          })
      })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        
        env: 'cloud1-3gv9sq4hb66658b5',
        traceUser: true,
      });
    }
       wx.getSystemInfo({
        success: (result) => {
            console.log(result)
            console.log(result.statusBarHeight)
            this.globalData.statusBarHeight=result.statusBarHeight
            this.globalData.windowHeight=result.windowHeight
        },
      })
      this.globalData.capsuleInfo=wx.getMenuButtonBoundingClientRect()
  },
  globalData : {
    //家长登录信息
 userInfo:{},
 //当前城市信息
 locName:{}
},
setShareData:function(){
    return{
        title:'记录孩子每一天',
        path:'pages/index/index',
        imageUrl:'./images/index/topbg.png'
    }
},
});
