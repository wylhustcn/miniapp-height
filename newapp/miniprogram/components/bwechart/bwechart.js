// components/hechart/hechart.js
import * as echarts from '../../ec-canvas/echarts';
const comdata=require('../../utils/comdata')
const app = getApp();



Component({
    /**
     * 组件的属性列表
     */
    properties: {
        sex:{
            type: String,
            value: '男',
        }
    },
    lifetimes: {
        attached: function() {
           
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
      },
    /**
     * 组件的初始数据
     */
    data: {
        
    },

    /**
     * 组件的方法列表
     */
    methods: {
        show(){
            const {avHeight,curHeight,ageObj,curWeight,sex}=app.globalData
            const age=Math.round((ageObj.lyear*12+ageObj.lmonth)/12)
            this.setData({
                avHeight,sex,age,curWeight,curHeight,sex
            })
            const comdata=require('../../utils/comdata')
            let hdata=comdata.boyPWobj
            console.log(this.data.sex)
            if(sex=='女'){
                
                hdata=comdata.girlPWobj
            }else{
                hdata=comdata.boyPWobj
            }
            console.log(hdata)
            let ecComponent = this.selectComponent('#mychart-line');
            console.log(ecComponent)
            ecComponent.init((canvas, width, height, dpr) => {
              // 获取组件的 canvas、width、height 后的回调函数
              // 在这里初始化图表
              const chart = echarts.init(canvas, null, {
                width: 400,
                height: 400,
                devicePixelRatio: dpr // new
              });
              //调用设定EChart报表状态的函数，并且把从后端拿到的数据传过去
              this.gethleve(ageObj,sex,curHeight,curWeight)
              this.setOption(chart, hdata);
              // 注意这里一定要返回 chart 实例，否则会影响事件处理等
              return chart;
            });
        },
        gethleve({lyear,lmonth,lday},sex,curheight,curweight){
            console.log(1111111)
           
            let shwlist=comdata.boyshw
               if(sex=='女'){
                 shwlist=comdata.girlshw
               }
            const totalmonth=lyear*12+lmonth
             const rightdata=shwlist.filter(item=>{
                 return item[0]>=totalmonth
             })
             const wp3_p97=[rightdata[0][2],rightdata[0][4],rightdata[0][6],rightdata[0][8],rightdata[0][10],rightdata[0][12],rightdata[0][14]]
             console.log(wp3_p97)

            console.log(curweight)
            var wleve='体瘦'
            if(curweight<wp3_p97[0]){ //p3
                wleve='体瘦'
            }else if(curweight<=wp3_p97[1]){ //p10
                wleve='中度体瘦'
            }else if(curweight<=wp3_p97[2]){ //p25
                wleve='轻度体瘦'
            }else if(curweight<wp3_p97[4]){ //p75
                wleve='标准'
            }else if(curweight<=wp3_p97[6]){ //p97
                wleve='肥胖'
            }else{
                wleve='超胖'   //超过p97
            }
             var percent=1
             if(curweight>=wp3_p97[3]){
                 percent=(curweight-wp3_p97[3])/wp3_p97[3]
             }else{
                percent=(wp3_p97[3]-curweight)/wp3_p97[3]
             }
             console.log(percent)
             percent= (percent*100).toFixed(1)
             this.setData({
                percent,wleve
             })
         },
        setOption(chart,hdata) {
            const age=Math.round(this.data.age)
            const curWeight=parseFloat(this.data.curWeight)
            console.log(curWeight,age)
            var option = {
                title: {
                  text: 'p3 ',
                  left: 'center',
                  show:false
                },
                legend: {
                  data: ['P3',,'P50', 'P97'],
                  top: 8,
                  left: 25,
                  icon: "circle", //设置为实心
                  itemWidth: 10,  // 设置宽度
            
                  itemHeight: 10, // 设置高度
              
                  itemGap: 15, // 设置间距，
                lineStyle:{
                    type:'dotted',
                    opacity:0
                }
                },
                
              
                grid : {
                        // containLabel: true,
                   right:20,
                    bottom: 20   //距离容器下边界30像素
                },
                
                tooltip: {
                  show: true,
                  trigger: 'axis'
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                 
                  data:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18],
                  // show: false
                  top:30
                },
                yAxis: {
                  x: 'center',
                  type: 'value',
                  name:'体重(kg)',
                  min: 0,
                  splitNumber : 10,
               max: 100,
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                  // show: false
                },
                series: [
                    {
                        name: 'P3',
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        itemStyle : {
                          normal : {
                              color:'#FF2222', //改变折线点的颜色
                              lineStyle:{
                                  color:'#FF2222', width: 1, //改变折线颜色
                              }
                          },
                       
                      },
                        data: hdata.P3,
                        markPoint:{
                           
                            data:[
                               
                                {
                                
                                 symbol:'pin',
                        symbolSize:0,
                        label:{
                         
                            show:true,
                          
                            position:[5,-3],
                            color:'#FF2222',
                           fontSize:8
                        },
                            name:'点',
                            yAxis: hdata.P3[18],
                            xAxis:18,
                            value:'P3' }
                             ]
                        },
                      }, 
                
                
                {
                    name: 'P50',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    itemStyle : {
                        normal : {
                            color:'#00B451', //改变折线点的颜色
                            lineStyle:{
                                color:'#00B451' , width: 1,//改变折线颜色
                            }
                        }
                    },
                    data: hdata.P50,
                    markPoint:{
                        itemStyle: {
                            normal: {
                                  color: '#00B451'
                            }
                        },
                        data:[{
                            symbol:comdata.symbol,
                        symbolSize:20,
                        symbolOffset:[0,-10],
                        label:{
                            show:true,
                       color:'#979797',
                       position:[-10,26],
                       backgroundColor:'rgba(255,255,255)',
                 
                       borderRadius:[15,15,0,15]
                        },
                            name:'点',
                            yAxis:curWeight,
                            xAxis:age,
                            value:'本次体重:'+curWeight+'kg'  },
                            {
                             symbol:'pin',
                    symbolSize:0,
                    label:{
                     
                        show:true,
                      
                        position:[5,-3],
                        color:'#00B451',
                       fontSize:8
                    },
                        name:'点',
                        yAxis: hdata.P50[18],
                        xAxis:18,
                        value:'P50' }
                         ]
                    },
                   
                  },
                  
                  {
                    name: 'P97',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    itemStyle : {
                        normal : {
                            color:'#7262FD', //改变折线点的颜色
                            lineStyle:{
                                color:'#7262FD' , width: 1,//改变折线颜色
                            }
                        }
                    },
                    data: hdata.P97,
                    markPoint:{
               
                        data:[
                          
                            {
                             symbol:'pin',
                    symbolSize:0,
                    label:{
                     
                        show:true,
                      
                        position:[5,-3],
                        color:'#7262FD',
                       fontSize:8
                    },
                        name:'点',
                        yAxis: hdata.P97[18],
                        xAxis:18,
                        value:'P97' }
                         ]
                    },
                  }
            ]
              };
            chart.setOption(option);
          }
    }
})
