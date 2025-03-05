// components/hechart/hechart.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const comdata=require('../../utils/comdata')

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
       
    },
    lifetimes: {
        attached: function() {
          
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
      },
    /**
     * 组件的方法列表
     */
    methods: {
        show(){
            const {avHeight,curHeight,ageObj,curWeight,sex}=app.globalData
            const age=Math.round((ageObj.lyear*12+ageObj.lmonth)/12)
            var  is_high=true
            
            if(curHeight>=avHeight){
                is_high=true
            }else{
             is_high=false
            }
            this.setData({
                avHeight,curHeight,age,curWeight,is_high,curHeight,sex
            })
            console.log('图表showl')
            
            const comdata=require('../../utils/comdata')
            let hdata=comdata.boyPHobj
        
            if(sex=='女'){
                console.log('性别为女')
                hdata=comdata.girlPHobj
            }else{
                hdata=comdata.boyPHobj
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
             const p3_p97=[rightdata[0][1],rightdata[0][3],rightdata[0][5],rightdata[0][7],rightdata[0][9],rightdata[0][11],rightdata[0][13]]
             console.log(p3_p97)
             
             var percent=1
             if(curheight>=p3_p97[3]){
                 percent=(curheight-p3_p97[3])/p3_p97[3]
             }else{
                percent=(p3_p97[3]-curheight)/p3_p97[3]
             }
             percent= (percent*100).toFixed(1)
             var hleve='矮小'
             console.log(p3_p97,curheight)
             if(curheight<p3_p97[0]){
                 hleve='矮小'
             }else if(curheight<p3_p97[3]){
                 hleve='偏矮'
             }else if(curheight<p3_p97[4]){
                 hleve='正常'
             }else{
                 hleve='偏高'
             }
            
            this.setData({
                hleve,percent
            })     
         },
        setOption(chart,hdata) {
        //   const age=Math.round(this.data.age)
        const age=Math.round(this.data.age)
          const curHeight=this.data.curHeight
          console.log(age,curHeight)
            var option = {
                title: {
                  text: 'p3 ',
                  left: 'center',
                  show:false
                },
                
                legend: {
                  data: ['P3', 'P10', 'P25','P50', 'P75', 'P97'],
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
                  name:'身高(cm)',
                  min: 30,
                  splitNumber : 20,
               max: 200,
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
                          }
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
                  name: 'P10',
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  itemStyle : {
                    normal : {
                        color:'#FFA74E', //改变折线点的颜色
                        lineStyle:{
                            color:'#FFA74E', width: 1, //改变折线颜色
                        }
                    }
                },
                  data: hdata.P10,
                 
                  markPoint:{
                    itemStyle: {
                        normal: {
                              color: '#00B451',
                              opacity:1
                        },
                        
                    },
                   data:[{
                            symbol:comdata.symbol,
                   symbolSize:20,
                   label:{
                       show:true,
                       color:'#979797',
                       position:[-10,26],
                       backgroundColor:'rgba(255,255,255)',
                    //    padding:[6,11],
                       borderRadius:[15,15,0,15]
                   },
                       name:'点',
                       yAxis:curHeight,
                       xAxis:age,
                       value:'本次身高:'+curHeight+'cm' },
                       {
                        symbol:'pin',
               symbolSize:0,
               label:{
                
                   show:true,
                 
                   position:[5,-3],
                   color:'#FFA74E',
                  fontSize:8
               },
                   name:'点',
                   yAxis: hdata.P10[18],
                   xAxis:18,
                   value:'P10' }
                    ]
               },
             
                }, 
                {
                  name: 'P25',
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  itemStyle : {
                    normal : {
                        color:'#FCDC3E', //改变折线点的颜色
                        lineStyle:{
                            color:'#FCDC3E', width: 1, //改变折线颜色
                        }
                    }
                },
                  data: hdata.P25,
                  markPoint:{
                    data:[
                        {
                         symbol:'pin',
                symbolSize:0,
                label:{
                    show:true,
                    position:[5,-3],
                    color:'#FCDC3E',
                   fontSize:8
                },
                    name:'点',
                    yAxis: hdata.P25[18],
                    xAxis:18,
                    value:'P25' }
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
                        data:[
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
                    name: 'P75',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    itemStyle : {
                        normal : {
                            color:'#5099EF', //改变折线点的颜色
                            lineStyle:{
                                color:'#5099EF', width: 1, //改变折线颜色
                            }
                        }
                    },
                    data:hdata.P75,
                    markPoint:{
                        data:[
                            {
                             symbol:'pin',
                    symbolSize:0,
                    label:{
                        show:true,
                        position:[5,-3],
                        color:'#5099EF',
                       fontSize:8
                    },
                        name:'点',
                        yAxis: hdata.P75[18],
                        xAxis:18,
                        value:'P75' }
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
                                color:'#7262FD', width: 1, //改变折线颜色
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
