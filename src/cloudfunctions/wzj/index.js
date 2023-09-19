// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

let openid = '427d9999d4ebcaa76cf0b033961d33ec'
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  getList()
  sign()
}

async function getList() {
  const opt = {
    url: `https://v18.teachermate.cn/wechat-api/v1/students/courses?openid=${openid}`
  }

  console.log(await rp(opt));
}

async function sign() {
  const opt = {
    url: 'https://v18.teachermate.cn/wechat-api/v1/class-attendance/student-sign-in?courseId=1209320&lon=112.447763&lat=38.015111',
    method: "GET",
    headers: {
      openId: openid
    },
    // body: JSON.stringify({
    //   openid: 'd1ec3fe1bacf9a7587cd6126477ecb68',
    //   courseId: '1209320',
    //   lon: '112.447763',
    //   lat: '38.015111'
    // })
  }
  console.log(1, await rp(opt));
  console.log(2, await rp({
    url: 'https://v18.teachermate.cn/wechat-api/v1/class-attendance/student-sign-in?lon=112.447763&lat=38.015111',
    method: "GET",
    headers: {
      openId: openid
    },
  }));
}
// https://v18.teachermate.cn/wechat-pro-ssr/?openid=d1ec3fe1bacf9a7587cd6126477ecb68&from=wzj
// "id": 1209320,
// "name": "18级包装机械",
// "cover": "https://app.teachermate.com.cn/covers/other2.png",
// "teacherName": "梁晶晶",
// "avatar": "https://app.teachermate.com.cn/d78ace26/1538370072_oq9PYwssD7agWBGdgt2n_aFMRyzg",
// "college": "中北大学",
// "code": "HH772",
// "orgId": null,
// "department": "机械工程学院"