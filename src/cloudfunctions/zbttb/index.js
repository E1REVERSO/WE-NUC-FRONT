// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const _ = cloud.database().command
const rp = require('request-promise')
let JSESSIONID = 'JSESSIONID=041089AD0BCC9182084FD1B74C9FC376'
// 云函数入口函数

let getFmtDate = function (str = 'hhmm', date = new Date()) {
  Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "h+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    return fmt
  }

  return date.Format(str)
}
const test = async (event, context) => {
  let headers = {
    'Upgrade-Insecure-Requests': '1',
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 wxwork/3.1.2 MicroMessenger/7.0.1 Language/zh',
    'Referer': 'http://zbjkttb.nuc.edu.cn/front/index.html',
    'Origin': 'http://zbjkttb.nuc.edu.cn',
    'Accept-Language': 'zh-cn',
    'Accept-Encoding': 'gzip, deflate',
    'Content-Type': 'application/json;charset=utf-8',
    'Connection': 'keep-alive'
  }
  headers['Cookie'] = JSESSIONID
  for (let i = 16; i <= 29; i++) {
    let configID = await rp({
      uri: "http://zbjkttb.nuc.edu.cn/microapp/health_daily/getReportTimeOfIdentity?labelName=%E7%8F%AD%E7%BA%A7%E7%AE%A1%E7%90%86",
      headers: {
        Cookie: JSESSIONID
      }
    })
    configID = JSON.parse(configID)
    // console.log(configID)
    configID = configID.data[0].configId

    let rq = new Date("2022-03-" + i);
    let serrq = getFmtDate("yyyy-MM-dd", rq)
    console.log(serrq + "未打卡人员名单：");
    let data = await rp({
      uri: `http://zbjkttb.nuc.edu.cn/microapp/health_daily/clockInList?dwh=12016241&day=${serrq}&configId=${configID}`,
      method: "GET",
      headers,
      json: true
    })
    data = data.data
    // console.log(data)
    let dat = data.filter(a => !a.report).map(d => d.username)
    console.log(dat)
  }

}
exports.main = async (event, context) => {
  // return await test()
  let flag = await cloud.database().collection('zbttb').where({
    _createTime: _.gt(Date.now() - 4 * 60 * 60 * 1000)
  }).count()
  if (flag.total >= 1) {
    return
  }
  let headers = {
    'Upgrade-Insecure-Requests': '1',
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 wxwork/3.1.2 MicroMessenger/7.0.1 Language/zh',
    'Referer': 'http://zbjkttb.nuc.edu.cn/front/index.html',
    'Origin': 'http://zbjkttb.nuc.edu.cn',
    'Accept-Language': 'zh-cn',
    'Accept-Encoding': 'gzip, deflate',
    'Content-Type': 'application/json;charset=utf-8',
    'Connection': 'keep-alive'
  }
  headers['Cookie'] = JSESSIONID


  // http://zbjkttb.nuc.edu.cn/microapp/health_daily/getReportTimeOfIdentity?labelName=%E7%8F%AD%E7%BA%A7%E7%AE%A1%E7%90%86
  let configID = await rp({
    uri: "http://zbjkttb.nuc.edu.cn/microapp/health_daily/getReportTimeOfIdentity?labelName=%E7%8F%AD%E7%BA%A7%E7%AE%A1%E7%90%86",
    headers: {
      Cookie: JSESSIONID
    }
  })
  configID = JSON.parse(configID)
  console.log(configID)
  configID = configID.data[0].configId
  let time = getFmtDate("hh:mm:ss", new Date())
  try {
    let data = await rp({
      uri: `http://zbjkttb.nuc.edu.cn/microapp/health_daily/clockInList?dwh=12016241&day=${getFmtDate("yyyy-MM-dd",new Date())}&configId=${configID}`,
      method: "GET",
      headers
    })
    console.log(data)
    data = JSON.parse(data)
    console.log(data.status)
    if (data.status) {
      let realData = data.data
      let temp = ``
      let count = 0;
      for (let i = 0; i < realData.length; i++) {
        if (realData[i].report == 0) {
          temp = temp + " " + realData[i].username
          count++;
        }

      }
      if (count == 0) {
        temp = "截至" + time + "所有同学打卡完毕，提出表扬。"
        cloud.database().collection('zbttb').add({
          data: {
            _createTime: Date.now()
          }
        })
      } else {
        temp = temp + "\n以上" + count + "位同学截至" + time + "时未完成打卡，快打卡"
      }

      rp({
        uri: encodeURI("http://101.43.234.77:5001/send_msg?message_type=group&group_id=877872667&message=" + temp)
      })
      if (!temp) throw {}
    }


  } catch (e) {
    rp({
      uri: encodeURI("http://101.43.234.77:5001/send_msg?message_type=group&group_id=877872667&message=" + "没完成打卡的同学尽快完成打卡。")
    })
  }

  return null;
}