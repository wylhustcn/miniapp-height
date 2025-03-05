var dayjs = require('dayjs'),
    relativeTime = require('dayjs/plugin/relativeTime'),
    comdata = require('./comdata')
dayjs.extend(relativeTime)
var u = {
    getToday: function () {
        return dayjs().format('YYYY-MM-DD')
    },
    getAgeObj: function (borthday, testtime = dayjs().format('YYYY-MM-DD')) {
        console.log(borthday, testtime)
        var date1 = Date.parse(borthday)
        var date2 = Date.parse(testtime)
        var ms = Math.abs(date2 - date1);
        var days = Math.floor(ms / (24 * 3600 * 1000));
        var lyear = parseInt(days / 365)
        var lmonth = parseInt(parseInt(days % 365) / 30)
        var lday = parseInt(parseInt(days % 30))
        console.log(lyear, lmonth, lday)
        return {
            lyear,
            lmonth,
            lday
        };
    },
    fixed: function (num) {
        return parseFloat(num)
    },
    getHerHeight: function (sex, fheight, mheight) {

        fheight = parseFloat(fheight)
        mheight = parseFloat(mheight)
        var herheight = (45.99 + 0.78 * (fheight + mheight) / 2).toFixed(1)
        if (sex == '女') {
            herheight = (37.85 + 0.75 * (fheight + mheight) / 2).toFixed(1)
        }
        return parseFloat(herheight)
    },
    getPreHeight: function (sex, fheight, mheight) {

        fheight = parseFloat(fheight)
        mheight = parseFloat(mheight)
        let preheight = ((fheight + mheight + 13) / 2).toFixed(1)
        if (sex == '女') {
            preheight = ((fheight + mheight - 13) / 2).toFixed(1)
        }
        return parseFloat(preheight)
    },
    getAgeList_grade: function ({
        lyear,
        lmonth,
        lday
    }, sex, curheight, curweight = 0) {
        const bmi = (curweight / (curheight * curheight / 10000)).toFixed(2)

        let shwlist = comdata.boyshw
        if (sex == '女') {
            shwlist = comdata.girlshw
        }
        const totalmonth = lyear * 12 + lmonth
        const rightdata = shwlist.filter(item => {
            return item[0] >= totalmonth
        })
        console.log(rightdata[0])
        const p3_p97 = [rightdata[0][1], rightdata[0][3], rightdata[0][5], rightdata[0][7], rightdata[0][9], rightdata[0][11], rightdata[0][13]]
        var grade = ''
        if (curheight < p3_p97[0]) {
            grade = '下'
        } else if (curheight <= p3_p97[2]) {
            grade = '中下'
        } else if (curheight <= p3_p97[4]) {
            grade = '中'
        } else if (curheight <= p3_p97[6]) {
            grade = '中上'
        } else {
            grade = '上'
        }
        const avheight = p3_p97[3]
        const curList = [p3_p97[0], p3_p97[2], p3_p97[4], p3_p97[6]]

        const wp3_p97 = [rightdata[0][8], rightdata[0][10], rightdata[0][12], rightdata[0][14]]
        var standw = wp3_p97[0]
        var wleve = '正常标准'
        if ((0.29 >= (curweight - standw) / standw) >= 0.2) {
            wleve = '轻度肥胖'
        } else if ((0.49 >= (curweight - standw) / standw) >= 0.30) {
            wleve = '中度肥胖'
        } else if (((curweight - standw) / standw) >= 0.50) {
            wleve = '重度肥胖'
        }
        console.log(p3_p97)
        var percent = 1
        if (curheight >= p3_p97[3]) {
            percent = (curheight - p3_p97[3]) / p3_p97[3]
        } else {
            percent = (p3_p97[3] - curheight) / p3_p97[3]
        }
        percent = (percent * 100).toFixed(1)
        var hleve = '矮小'
        console.log(p3_p97, curheight)
        if (curheight < p3_p97[0]) {
            hleve = '矮小'
        } else if (curheight < p3_p97[3]) {
            hleve = '偏矮'
        } else if (curheight <= p3_p97[4]) {
            hleve = '正常'
        } else {
            hleve = '偏高'
        }
        return {
            curList,
            grade,
            avheight,
            bmi,
            hleve,
            percent,
            wleve
        }

    },
    getBMIList: function ({
        lyear,
        lmonth,
        lday
    }, sex) {
        let BMIlist = comdata.BMI
        let blist = comdata.BMI[0]
        if (lyear >= 2) {
            const age = Math.round((lyear * 12 + lmonth) / 12)
            BMIlist.forEach(item => {
                if (item[0] == age) {
                    blist = item
                }
            })
        }
        console.log(blist)
        let BMIl = [blist[4], blist[5], blist[6]]
        if (sex = '女') {
            BMIl = [blist[1], blist[2], blist[3]]
        }

        return BMIl
    },
    recentTime(day, fmt, time) {
        //获取当前时间的毫秒值
        let now = (time ? new Date(time) : new Date()).getTime();
        // 获取前后n天时间
        let recent = new Date(now + day * 24 * 60 * 60 * 1000)

        // key：正则匹配表达式，value：对应的时间、日期
        let fmtObj = {
            'M+': recent.getMonth() + 1, //月份
            'd+': recent.getDate(), //日
            'h+': recent.getHours(), //时
            'm+': recent.getMinutes(), //分
            's+': recent.getSeconds(), //秒
        }
        // 获取匹配年份替换
        if (/(y+)/.test(fmt)) {
            //RegExp.$1 匹配结果，替换成对应的长度。如：yyyy就替换成整个年份2021，yy就替换成后两位21，以此类推
            fmt = fmt.replace(RegExp.$1, (recent.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let key in fmtObj) {
            if (new RegExp(`(${key})`).test(fmt)) {
                //日期，时、分、秒替换，判断fmt是否需要补0，如：yyyy-M-d h:m:s 不补0,yyyy-MM-dd hh:mm:ss 则自动补0
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? fmtObj[key] : ('00' + fmtObj[key]).substr(('' + fmtObj[key]).length))
            }
        }
        return fmt
    },
    getHeightList: function ({
        lyear,
        lmonth,
        lday
    }, sex) {
        let heightList = comdata.boyshw
        if (sex == '女') {
            heightList = comdata.girlshw
        }
        let months = lyear * 12 + lmonth
        var bigList = []
        heightList.forEach(item => {
            if (item[0] >= months) {
                bigList.push(item)
            }
        })
        var symbolList = bigList[0]
        var reSymbol = [symbolList[1] - 1, symbolList[1] - 0.5, symbolList[1], symbolList[3], symbolList[5], symbolList[7], symbolList[9], symbolList[11], symbolList[13], symbolList[13] + 1]

        return reSymbol
    }



}
module.exports = u