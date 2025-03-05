import * as echarts from '../../../ec-canvas/echarts';
var g = require("../../../utils/getdata"),
    u = require('../../../utils/utils'),
    c = require('../../../utils/comdata');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        yearList: [2021, 2021, 2022, 2022, 2022, 2022, 2022, 2022, 2022, 2022]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options)
        let {
            id,
            beginDate,
            endDate,
            parent_openid,
            isManager
        } = options
        console.log(id, beginDate, endDate)
        if (beginDate == '') {
            beginDate = endDate
        }
        this.setData({
            beginDate: beginDate.replace(/-/g, '.'),
            endDate: endDate.replace(/-/g, '.'),
            parent_openid,
            id,
            isManager
        })
        g.getCartListData({
            id,
            beginDate,
            endDate
        }).then(res => {
            this.setData({
                parent: res.parentInfo,
                childInfo: res.childInfo,
                testList: res.testList
            })
            this.renderChild(res.childInfo)
            this.renderList(res.testList)
        })

    },
    changebaby() {
        const isManager = this.data.isManager
        console.log(isManager)
        if (isManager != undefined) {
            const parent_openid = this.data.parent._openid
            this.showChangeChild.show(parent_openid)
        } else {
            wx.showToast({
                title: '暂无权限',
                icon: 'error'
            })
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

        this.showChangeChild = this.selectComponent('#showChangeChild')
    },
    refresh(e) {
        const beginDate = this.data.beginDate
        const endDate = this.data.endDate
        const id = e.detail

        g.getCartListData({
            id,
            beginDate,
            endDate
        }).then(res => {
            console.log(res.testList)
            this.setData({
                parent: res.parentInfo,
                childInfo: res.childInfo,
                testList: res.testList
            })
            this.renderChild(res.childInfo)
            this.renderList(res.testList)
        })
    },
    renderChild(childInfo) {
        const testList = this.data.testList
        const curheight = parseFloat(testList[testList.length - 1].curheight)
        console.log(curheight)
        console.log(testList)
        const {
            borthday,
            sex,
            fheight,
            mheight
        } = childInfo
        const ageObj = u.getAgeObj(borthday)
        const herheight = u.getHerHeight(sex, fheight, mheight)
        const heightList = u.getHeightList(ageObj, sex)
        console.log(heightList)
        console.log(ageObj, herheight)
       const {percent,hleve}=u.getAgeList_grade(ageObj,sex,curheight)
       console.log(percent)
        this.setData({
            herheight,
            wheight: childInfo.wheight,
            ageObj,
            babyName: childInfo.babyName,
            sex,
            heightList,
            percent,
            hleve,
            curheight
        })
        this.initavHeightChart()
    },
    renderList(testList) {
        console.log(testList)
        const daylist = testList.map(element => {
            return element.testTime.slice(5).replace('-', '.') + " " + element.testTime.slice(0, 4)
        })
        var heightList = testList.map(element => {
            return parseFloat(element.curheight)
        })
        console.log(heightList, daylist)
        // u.getAgeObj
        var minHeight = testList[0].curheight
        var maxHeight = testList[testList.length - 1].curheight
        const timeLine = u.getAgeObj(testList[testList.length - 1].testTime, testList[0].testTime)
        const days = timeLine.lyear * 12 * 30 + timeLine.lmonth * 30 + timeLine.lday

        console.log(testList[testList.length - 1])
        this.setData({
            daylist,
            heightList,
            days,
            heightdif: Math.abs(maxHeight - minHeight)
        })
        this.initHeightChart()
    },
    initHeightChart() {
        let ecComponent = this.selectComponent('#heightChart');
        console.log(ecComponent)
        ecComponent.init((canvas, width, height, dpr) => {
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr
            });
            this.setOption(chart);
            return chart;
        });
    },
    initavHeightChart() {
        var heightdata = this.data.heightList.join()
        console.log(heightdata)
        let symbolNum = '3,3,6,9,13,13,9,6,3,3'
        var datas = [{
            "data": {
                "stdplot": {
                    "xaxis": heightdata,
                    "yaxis": symbolNum
                }
            },
            "idx": 1
        }];

        for (var i = 0; i < datas.length; i++) {
            var yArr = []; //正态分布频率
            var x = datas[i].data.stdplot.xaxis.split(','); //数据值分布列
            console.log(x);
            var y = datas[i].data.stdplot.yaxis.split(','); //数据值频数数组
            console.log(y);
            var mean = parseFloat(this.getMean(x, y)); //平均值
            console.log("平均值:" + mean);
            var stdev = parseFloat(this.getStdev(x, y, mean)); //
            console.log("标准偏差:" + stdev);
            console.log('x:', x)
            for (var j = 0; j < x.length; j++) {
                var res = this.fun(x[j], mean, stdev).toFixed(2);
                yArr.push(res);
            }
            this.setData({
                x,
                yArr,
            })
        }
        let ecComponent = this.selectComponent('#vaheightChart');
        console.log(ecComponent)
        ecComponent.init((canvas, width, height, dpr) => {
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr
            });
            this.setavOption(chart);
            return chart;
        });
    },
    setOption(chart) {
        const {
            daylist,
            heightList
        } = this.data
        var option = {

            grid: {
                right: 20,
                bottom: 40,
                top: 30
            },
            xAxis: {
                boundaryGap: false,
                type: 'category',
                data: daylist,
                axisLine: {
                    lineStyle: {
                        color: '#979797', //x轴的颜色
                        width: 1, //轴线的宽度
                    },
                },

                axisLabel: {
                    //x轴文字的配置
                    show: true,
                    interval: daylist.length / 10 - 1, //使x轴文字显示全
                    formatter: function (value) //X轴的内容
                    {
                        var ret = ""; //拼接加\n返回的类目项
                        var max = 5; //每行显示的文字字数
                        var val = value.length; //X轴内容的文字字数
                        var rowN = Math.ceil(val / max); //需要换的行数
                        if (rowN > 1) //判断 如果字数大于2就换行
                        {
                            for (var i = 0; i < rowN; i++) {
                                var temp = ""; //每次截取的字符串
                                var start = i * max; //开始截取的位置
                                var end = start + max; //结束截取的位置
                                temp = value.substring(start, end) + "\n";
                                ret += temp; //最终的字符串
                            }
                            return ret;
                        } else {
                            return value
                        }
                    }


                }
            },
            yAxis: {
                name: '身高(cm)',
                axisLine: {
                    lineStyle: {
                        color: '#979797', //x轴的颜色
                        width: 1, //轴线的宽度
                    },
                },
                // minInterval: 1,
                type: 'value',
                min: parseInt(heightList[0] - 2),
            },
            series: [{
                connectNulls: true,
                data: heightList,
                type: 'line',
                symbol: 'circle',
                symbolSize: 4,
                itemStyle: {
                    normal: {
                        color: '#00B451', //改变折线点的颜色
                        lineStyle: {
                            color: '#00B451',
                            width: 1.2, //改变折线颜色
                        }
                    }
                },
                markPoint: {
                    itemStyle: {
                        normal: {
                            color: '#00B451'
                        }
                    },
                    data: [{
                            // symbol:c.symbol,
                            symbolSize: 0,
                            label: {
                                show: true,
                                color: '#979797',
                                position: [-20, 16],
                                backgroundColor: 'rgba(255,255,255)',
                                padding: [3, 3],
                                borderRadius: [3, 3, 3, 3],
                                // fontSize: 10,
                                lineHeight: 15,
                                shadowColor: '#efefef',
                                shadowBlur: 3,
                                shadowOffsetX: 4,

                                shadowOffsetY: 4,
                            },
                            name: '点',
                            yAxis: heightList[heightList.length - 1],
                            xAxis: daylist[daylist.length - 1],
                            value: daylist[daylist.length - 1].split(' ')[1] + '.' + daylist[daylist.length - 1].split(' ')[0] + "\n" + '身高：' + this.data.curheight + 'cm'
                        },

                    ]
                },
            }]
        };
        chart.setOption(option);
    },
    setavOption(chart) {
        const {
            x,
            yArr,

        } = this.data
        const ax = x.map(item => {
            return parseInt(item)
        })
        const curheight = this.data.curheight
        let index = null
        for (let i = 0; i < ax.length; i++) {
            if (curheight >= ax[i]) {
                index++
            }
        }
        const nyArr = yArr.map(item => {
            return parseFloat(item)
        })

        let percent1 = 0
        for (let i = 0; i < nyArr.length; i++) {
            if (i < index) {
                percent1 += nyArr[i]
            }
        }

        const percent = (percent1 * 10).toFixed(1)
        console.log(yArr, index, curheight, ax, percent)
        // this.setData({
        //     percent
        // })
        var colors = ['#4BD3D6', '#FA61A3', '#0070C0', '#FF3428'];
        var option = {
            color: colors,
            // tooltip: {
            //     trigger: 'axis',
            //     axisPointer: {
            //         type: 'cross'
            //     }
            // },
            grid: {
                right: 20,
                bottom: 20,
                top: 30
            },

            xAxis: [{
                axisLine: {
                    lineStyle: {
                        color: '#979797', //x轴的颜色
                        width: 1, //轴线的宽度
                    },
                },

                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: x
            }],
            yAxis: [{
                splitLine: false,
                axisLabel: {
                    show: false, //隐藏刻度值
                },
                axisLine: {
                    show: false,
                },
            }, ],
            series: [

                {
                    name: '',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    data: yArr,
                    itemStyle: {
                        normal: {
                            color: '#00B451', //改变折线点的颜色
                            lineStyle: {
                                color: '#00B451',
                                width: 1.2, //改变折线颜色
                            }
                        }
                    },
                    showSymbol: false,
                    markPoint: {
                        itemStyle: {
                            normal: {
                                color: '#00B451'
                            }
                        },
                        data: [{
                                symbol: c.symbol,
                                symbolSize: 20,
                                label: {
                                    show: true,
                                    color: '#979797',
                                    position: [-20, 26],
                                    backgroundColor: 'rgba(255,255,255)',
                                    padding: [3, 3],
                                    borderRadius: [3, 3, 3, 3],
                                    // fontSize: 10,
                                    lineHeight: 15,
                                    shadowColor: '#efefef',
                                    shadowBlur: 3,
                                    shadowOffsetX: 4,

                                    shadowOffsetY: 4,
                                },
                                name: '点',
                                yAxis: 1,
                                xAxis: x[index],

                                value: '身高: ' + curheight + 'cm'
                            }

                        ]
                    },
                },



            ]
        };

        chart.setOption(option);
    },

    //计算正态数值分布频率
    fun(x, u, a) {
        return (1 / Math.sqrt(2 * Math.PI) * a) * Math.exp(-1 * ((x - u) * (x - u)) / (2 * a * a));
    },
    //给数组添加数据
    addParam(arr, target) {
        //是否是等于
        var flag = false;
        var target = parseFloat(target);
        //最小
        if (target < parseFloat(arr[0])) {
            arr.unshift(target.toString());
            return arr;
        }

        //最大
        if (target > parseFloat(arr[arr.length - 1])) {
            arr.push(target.toString());
            return arr;
        }

        //中间
        for (var i = 0; i < arr.length; i++) {
            if (parseFloat(arr[i]) > target) {
                if (arr[i - 1] == target)
                    flag = true;
                break;
            }
        }
        if (flag) {
            return arr;
        } else {
            arr.splice(i, 0, target.toString());
            return arr;
        }
    },
    //获取数据数组最大值
    getTop(arr) {
        var maxIndex = 0;
        for (var i = 0; i < arr.length; i++) {
            maxIndex = parseFloat(arr[i]) > parseFloat(arr[maxIndex]) ? i : maxIndex;
        }
        return parseFloat(arr[maxIndex]);

    },
    //构造正态曲线特定值对象
    getParam(low, mean, up, top) {
        var res = {};
        res['low'] = low;
        res['mean'] = mean;
        res['up'] = up;
        res['top'] = top;

        return res;
    },
    //求数组和 var getSum =
    getSum(x, y) {
        return parseFloat(x) + parseFloat(y);
    },
    //求平均值var getMean
    getMean(arr_x, arr_y) {
        var mean = 0;
        var sum = 0;
        var len = 1;
        if (arr_x.length == arr_y.length) {
            len = arr_y.reduce(this.getSum);
            for (var i = 0; i < arr_x.length; i++) {
                sum = sum + parseFloat(arr_x[i]) * parseFloat(arr_y[i]);
            }
        } else {

        }
        mean = (sum / len).toFixed(0);
        return mean;
    },

    //求标准偏差var getStdev
    getStdev(arr_x, arr_y, avg) {
        var sum = 0;
        var len = arr_y.reduce(this.getSum); //总样本数
        var subtractAvg = [];
        for (var i = 0; i < arr_x.length; i++) { //做平均差平方
            subtractAvg.push((arr_x[i] - avg) * (arr_x[i] - avg));
        }
        for (var j = 0; j < subtractAvg.length; j++) { //平均差平方和
            sum = sum + parseFloat(subtractAvg[j]) * parseFloat(arr_y[j]);
        }
        return Math.sqrt(sum / len); //标准偏差
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {


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

    }
})