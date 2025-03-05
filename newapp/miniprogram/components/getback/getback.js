// components/geback/getback.js
const app=getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title:{
            type:String,
            value:"周周测身高"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },
    lifetimes: {
        attached: function() {
          this.setData({
            capsuleInfo: app.globalData.capsuleInfo,
          })
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
      },
    /**
     * 组件的方法列表
     */
    methods: {
        getback(){
            if( app.globalData.firstTimeTest){
                wx.switchTab({
                    url: '../../pages/index/index',
                  })
            }else{
                wx.navigateBack({
                    delta: 0,
                    fail:err=>{
                        wx.switchTab({
                          url: '../../pages/index/index',
                        })
                    }
                  })
            }
           
        }
    }
})
