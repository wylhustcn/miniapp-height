// components/hechart/hechart.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp(),u=require('../../utils/utils');


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
             const {curList,grade,avheight,bmi, hleve,percent,wleve}=u.getAgeList_grade(ageObj,sex,curHeight,curWeight)
            var  is_high=true
            if(curHeight>=avHeight){
                is_high=true
            }else{
             is_high=false
            }
            this.setData({
                avHeight,curHeight,ageObj,curWeight,sex,is_high,percent
            })
 
             const comdata=require('../../utils/comdata')
             let hdata=comdata.boyPHobj
             console.log(this.data.sex)
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
                 width: 500,
                 height: 200,
                 devicePixelRatio: dpr // new
               });
               //调用设定EChart报表状态的函数，并且把从后端拿到的数据传过去
 
               this.setOption(chart, hdata);
               // 注意这里一定要返回 chart 实例，否则会影响事件处理等
               return chart;
             });
        },
        setOption(chart,hdata) {
            const {avHeight,curHeight}=app.globalData
            
            
            var option = {
                color:['#33C374'],
               
                // tooltip: {
                //     trigger: 'axis',
                //     axisPointer: {
                //         type: 'shadow'
                //     }
                // },
                title: {
                    text: 'p3 ',
                    left: 'center',
                    show:false
                  },
                  
                // grid: {
                //     left: '3%',
                //     right: '4%',
                //     bottom: '3%',
                //     containLabel: true
                // },
                grid: {
                    x: 0, //距离左边
                    x2: 0, //距离右边
                    y:0, //距离上边
                    y2:0,//距离下边
                    top:0,
                    left: '3%',
                    right: '10%',
                    bottom: '3%',
                    containLabel: true
               },

                xAxis: {
                    type: 'value',
                    // boundaryGap: [0, 0.01],
                    splitNumber : 7,
                    min:0,
                    max:210,
                    name:'(cm)',
                  
                },
                yAxis: {
                    type: 'category',
                    data: ['当前身高','同龄平均身高'],	
                    axisLine: {
                        lineStyle: {
                          color: '#efefef'
                        }
                      },
                      axisLabel: {
                        textStyle: {
                            color: '#979797',
                            fontStyle: 'normal',
                           
                            fontSize: 12,
                        },
                        interval : 0,
                        formatter : function(params){
                            var newParamsName = "";
                            var paramsNameNumber = params.length;
                            var provideNumber = 4;
                            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                            if (paramsNameNumber > provideNumber) {
                                for (var p = 0; p < rowNumber; p++) {
                                    var tempStr = "";
                                    var start = p * provideNumber;
                                    var end = start + provideNumber;
                                    if (p == rowNumber - 1) {
                                        tempStr = params.substring(start, paramsNameNumber);
                                    } else {
                                        tempStr = params.substring(start, end) + "\n";
                                    }
                                    newParamsName += tempStr;
                                }
             
                            } else {
                                newParamsName = params;
                            }
                            return newParamsName
                        }
                      },
              
                },
                series: [
                    {
                        name: '', 
                        barWidth: 30,		
                        type: 'bar',
                        data: [ curHeight, avHeight], 
                        barGap:'80%',/*多个并排柱子设置柱子之间的间距*/
                        barCategoryGap:'50%',/*多个并排柱子设置柱子之间的间距*/
                        itemStyle: {
                            normal: {
                                //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
                                barBorderRadius:[0, 15, 15, 0],
                                
                                label: {
                                    　　　　　　show:true,//是否显示 
                                    　　　　　　position: 'insideRight',//显示位置 
                                    　　　　　　textStyle: { //文字样式
                                    　　　　　  　color: '#fff',
                                                fontSize:16,
                                                fontWeight:600
                                    　　　　    }
                                }
                            }
                        }
            
                    }
                ]
            };


            chart.setOption(option);
          }
    }
})
