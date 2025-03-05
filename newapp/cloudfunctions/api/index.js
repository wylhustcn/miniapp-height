// 云函数入口文件
const cloud = require('wx-server-sdk')
const dayjs = require('dayjs')
const today = dayjs().format('YYYY-MM-DD')
cloud.init({
    env: 'cloud1-3gv9sq4hb66658b5'
})
const mothyearday=dayjs().subtract(0, 'month')
const lastday=mothyearday.$y+'-'+mothyearday.$M+'-'+mothyearday.$D

const db = cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let openid = wxContext.OPENID
    console.log(event.code)
    if(event.shareOpenid!=''){
        openid=event.shareOpenid
    }
    if (event.method == 'sendMessage') {
        const testNum=await db.collection('testList').where({
            curtestTime: _.and(_.gte(lastday), _.lte(today)),
            _openid:openid
        }).get()
        if(testNum.data.lastTest.length>=4){
            await db.collection('parentList').where({
                _openid:openid
            }).update({
                data:{
                    tags:'活跃用户'
                }
            })
        }else if(testNum.data.lastTest.length==3||testNum.data.lastTest.length==2){
            await db.collection('parentList').where({
                _openid:openid
            }).update({
                data:{
                    tags:'一般用户'
                }
            })
        }else{
            await db.collection('parentList').where({
                _openid:openid
            }).update({
                data:{
                    tags:'沉默用户'
                }
            })
        }
        await cloud.openapi.uniformMessage.send({
            "touser": openid,

            "mp_template_msg": {
                "appid": "wx2998d6d4725784b1 ",
                "template_id": "bCcHEYDHakPy51l67qczMuEalnYC0u32aqkS50qrxNs",

                "miniprogram": {
                    "appid": "wx4cff9d85bb2471ac",
                    "pagepath": "pages/login/index"
                },
                "data": {
                    "first": {
                        "value": "乳高为你定制了科学的高管理方案，立刻点击获取！",
                        "color": "#173177"
                    },
                    "keyword1": {
                        "value": "身高、体重",
                        "color": "#173177"
                    },
                    "keyword2": {
                        "value": "待测量",
                        "color": "#173177"
                    },
                    "keyword3": {
                        "value": today,
                        "color": "#173177"
                    },
                    "remark": {
                        "value": "感谢你的阅读！",
                        "color": "#173177"
                    }
                }
            }
        })
    }
    if (event.method == 'getPhone') {
        try {
            let result = await cloud.openapi.phonenumber.getPhoneNumber({
                code: event.code
            })
            return {
                status: 'ok',
                result
            }
        } catch (error) {
            return {
                status: 'err'
            }
        }


    }
    if (event.method == 'getUserInfo') {
        
        const result = await db.collection('parentList').where({
            _openid: openid
        }).get()

        return result
    }
    if (event.method == 'deletechild') {
        const dechild = await db.collection('childList').doc(event.childid).remove()
        const detest = await db.collection('testList').where({
            childid: event.childid
        }).remove()
        const childList = await db.collection('childList').where({
            parentid: openid
        }).get()
        if(childList.data.length){
            const changechildid = childList.data[0]._id
            await db.collection('parentList').where({
                _openid: openid
            }).update({
               data:{
                curChildid: changechildid
               }
            })
            return {
                changechildid
            }
        }else{
            await db.collection('parentList').where({
                _openid: openid
            }).update({
               data:{
                curChildid: ''
               }
            })

            return 'ok'
        }
       
    }
    if (event.method == 'getCurTest') {
        const childid = event.childid
        const result = await db.collection('testList').orderBy('testTime', 'desc').where({
            childid
        }).limit(1).get()

        return result
    }
    if (event.method == 'getChildInfo') {
        const id = event.id
        const result = await db.collection('childList').doc(id).get()
        return result
    }
    if (event.method == 'getChilds') {
       const parent_openid=event.parent_openid
        const result = await db.collection('childList').where({
            parentid: parent_openid
        }).get()
        return result
    }
    if (event.method == 'changeChild') {
       const childid=event.childid
       const parentdocid=event.parentdocid

        const lastTest=await db.collection('testList').where({
            childid:childid
        }).get()
        const childInfo=await db.collection('childList').doc(childid).get()
        const testdata=lastTest.data[0]
        const result = await db.collection('parentList').doc(parentdocid).update({
            data: {
                curChildid: childid,
                curtestTime:testdata.testTime,
                curchildName: childInfo.babyName,
                curheight: testdata.curheight,
                curweight: testdata.curweight,
            }
        })
        return result
    }
    if (event.method == 'getChildAllTest') {
        const childid = event.childid
        const result = await db.collection('testList').orderBy('testTime', 'desc').where({
            childid: childid
        }).get()
        return result
    }
    if (event.method == 'getManageList') {
        
        const beginTime=event.beginTime
        const endTime=event.endTime
        const searchWord=event.searchWord
        const page=event.page
        if(beginTime==''&&searchWord!=''){
            const results=await db.collection('parentList').where(_.or([{
                phoneNumber:searchWord
            },{
                _openid:searchWord
            },{
                curchildName:searchWord
            },{
                nickName:searchWord
            }
        ])).orderBy('curtestTime','desc').skip(page).get()
        return results
        }else if(beginTime!=''&&searchWord==''){
            const results=await db.collection('parentList').where( {
                curtestTime: _.and(_.gte(beginTime), _.lte(endTime))
              }).orderBy('curtestTime','desc').skip(page).get()
            return results
        }else if(beginTime!=''&&searchWord!=''){
            const results=await db.collection('parentList').where(_.and([
                {
                  curtestTime: _.and(_.gte(beginTime), _.lte(endTime))
                },
                _.or([
                  {
                      phoneNumber:searchWord
                  },{
                      _openid:searchWord
                  },{
                      nickName:searchWord
                  }
                ])
          ])).orderBy('curtestTime','desc').skip(page).get()
          return results
        }else{
            const results=await db.collection('parentList').orderBy('curtestTime','desc').skip(page).get()
            return results
        }

       
    }
    if(event.method=='getCartListData'){
        const parentdocid=event.parentdocid
        const data = await db.collection('parentList').doc(parentdocid).get()
        const parentInfo=data.data
        const curChildid=parentInfo.curChildid
        const childInfo=await db.collection('childList').doc(curChildid).get()
        const testList=await db.collection('testList').where({childid:curChildid}).orderBy('testTime','asc').get()

        return {
            parentInfo,
            childInfo:childInfo.data,
            testList:testList.data
        }
    }
    if(event.method=='updateChildAvator'){
        const childid=event.childid
        const avatorUrl=event.avatorUrl
        const childInfo=await db.collection('childList').doc(childid).update({
          data:{
            avatorUrl
          }
        })
        return childInfo
    }
    if(event.method=='getUser'){
        const popenid=event.popenid
      const results = await db.collection('parentList').where({
            _openid: popenid
        }).get()
        return results
    }
    if(event.method=='updateShareNumber'){
      
      const results = await db.collection('parentList').where({
            _openid: openid
        }).update({
            shareTimes:_.inc(1)
        })
        return results
    }
    if(event.method=='updateShareReportNumber'){
      
        const results = await db.collection('parentList').where({
              _openid: openid
          }).update({
           data:{
            reportShare:_.inc(1)
           }
          })
          return results
      }
}