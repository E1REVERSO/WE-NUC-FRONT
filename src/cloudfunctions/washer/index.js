// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init()

async function getDeviceInfo(json) {
  let headers = {
    Accept: "application/json, text/plain, */*",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTM3NjY1OCwibmFtZSI6IjEzNDI1MTYwODIxIiwiYXBwVXNlcklkIjoiMjA4ODQyMjg2MzYzMjc5MiIsImlhdCI6MTYzMzc5NjExMywiZXhwIjoxNjQxODMxMzEzfQ.I9VAQy99U3oIBuQZntvqIWhTcWq1DZ2n_cEAL2RxgE8",
    "Accept-Language": "zh-CN,en-US;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/json; charset=utf-8",
    "x-app-code": "BCI",
    "Origin": "https://wx.zhinengxiyifang.cn",
    "User-Agent": " Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19A348 Ariver/1.1.0 AliApp(AP/10.2.33.6200) Nebula WK RVKType(1) AlipayDefined(nt:WIFI,ws:414|832|2.0) AlipayClient/10.2.33.6200 Alipay Language/zh-Hans Region/CN NebulaX/1.0.0",
    Referer: "https://wx.zhinengxiyifang.cn/",
    Connection: "keep-alive",
    Cookie: "acw_tc=76b20ffc16337948710108647e02c718691d2d98256728fdff89e12e7c4644"

  }
  console.log(json);
  return await rp({
    headers,
    method: "POST",
    uri: "https://phoenix.ujing.online/api/v1/alipay/devices/scanWasherCode",
    body: json,
    'json': true
  })
  console.log(device)
}

async function autoUpdate() {
  let counts = await cloud.database().collection('washers').count()
  let task = []
  let pages = Math.ceil(counts.total / 100)
  for (let i = 0; i < pages; i++) {
    let washerInDb = await cloud.database().collection('washers').skip(100 * i).get()
    console.log(washerInDb)
    washerInDb = washerInDb.data
    // let washers = []
    let headers = {
      'Cookie': 'acw_tc=76b20ff715993060846466116e14782fa585083a945fc033a1ef0a25c4e708',
      'Host': 'u.zhinengxiyifang.cn',
      'Origin': 'http://wx.zhinengxiyifang.cn',
      'Connection': 'keep-alive',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/18A5357e Ariver/1.0.15 AliApp(AP/10.2.0.6020) Nebula WK RVKType(1) AlipayDefined(nt:4G,ws:414|832|2.0) AlipayClient/10.2.0.6020 Language/zh-Hans Region/CN NebulaX/1.0.0',
      'Authorization': 'aE2mNBAj9oxIeGAWPKO46KpzuHCfnyYTIihL9yS6OxMO9l5kKrhok8jfGgREVprA',
      'Accept-Language': 'zh-CN,en-US;q=0.8',
    };
    for (let i = 0; i < washerInDb.length; i++) {
      console.log(washerInDb[i])
      task.push(new Promise((resolve, reject) => {
        rp({
          url: 'https://u.zhinengxiyifang.cn/api/Devices?filter=' + encodeURIComponent(`{"where":{"qrCode":"${washerInDb[i].qrCode}","isRemoved":false},"scope":{"fields":["virtualId","scanSelfClean","hasAutoLaunchDevice","autoLaunchDeviceOutOfStock","isSlotMachine","deviceTypeId","online","status","moduleType","boxTypeId","macAddress","deviceId2G"]},"include":[{"relation":"store","scope":{"fields":["isRemoved","enable"]}}]}`),
          method: 'GET',
          json: true,
          headers: headers,
        }).then(async res => {
          res = res[0]
          // console.log(res);
          let no = res.no
          let order = res.orderId
          let online = res.online
          console.log(no, order, online);
          await cloud.database().collection('washers_data').where({
            lh: washerInDb[i].lh,
            no: res.no
          }).remove()

          cloud.database().collection('washers_data').add({
            data: {
              ...res,
              _createTime: Date.now(),
              lh: washerInDb[i].lh
            }
          })
        })
      }))


      // let c = await getDeviceInfo(washerInDb[i].json)
      // console.log(c)
      // if (c.code == 0) {
      //   washerInDb[i].washerData = c.data.result
      //   let _id = washerInDb[i]._id

      //   let a = await rp({
      //     url: 'https://phoenix.ujing.online:443/api/v1/alipay/devices/' + washerInDb[i].washerData.deviceId + '?id=' + washerInDb[i].washerData.deviceId,
      //     headers: headers2
      //   })
      //   a = JSON.parse(a)

      //   let washer_data = await cloud.database().collection('washers_data').where({
      //     washers_id: _id
      //   }).get()
      //   washer_data = washer_data.data
      //   console.log(washer_data)
      //   console.log(a)




      // console.log(a)
    }
    await Promise.all(task)
  }
  // console.log(washerInDb)


}


// }
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case "search":

      break
    default:
      autoUpdate()
  }


}