const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
let date = null

const summerTime = {
  '1': '08:00 - 08:45',
  '2': '08:55 - 09:40',
  '3': '10:10 - 10:55',
  '4': '11:05 - 11:50',
  '5': '14:30 - 15:15',
  '6': '15:25 - 16:10',
  '7': '16:40 - 17:25',
  '8': '17:35 - 18:20',
  '9': '19:30 - 20:15',
  '10': '20:25 - 21:10',
  '11': '21:20 - 22:05'

}

const winterTime = {
  '1': '08:00 - 08:45',
  '2': '08:55 - 09:40',
  '3': '10:10 - 10:55',
  '4': '11:05 - 11:50',
  '5': '14:00 - 14:45',
  '6': '14:55 - 15:40',
  '7': '16:10 - 16:55',
  '8': '17:05 - 17:50',
  '9': '19:00 - 19:45',
  '10': '19:55 - 20:40',
  '11': '20:50 - 21:35'
}

let cellTime;

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

exports.main = async (event, context) => {
  date = new Date()
  cellTime = parseInt(date.Format('MMdd')) >= 1001 || parseInt(date.Format('MMdd')) < 501 ? winterTime : summerTime

  let now = await getNow()
  let data = await select(now)
  push(data)
  return data
}

async function getNow() {
  let termStart = await db.collection('wenuc_data').doc('79550af260eff55426c9c2733de27c46').get()
  termStart = termStart.data.termStart
  const week = Math.ceil((date.getTime() - termStart) / (60 * 60 * 24 * 7 * 1000))
  // const week = 1
  let nowTime = new Date().Format('hhmm')
  // let nowTime = '0800'
  nowTime = parseInt(nowTime.slice(0, 2)) * 60 + parseInt(nowTime.slice(2))
  const jcs = Object.keys(cellTime)
  let jc = ''
  let gap = 0
  const xq = (date.getDay() ? date.getDay() : 7).toString()
  // const xq = "2"
  for (let i = 0; i < jcs.length; i++) {
    let time = cellTime[jcs[i]].slice(0, 5)
    time = parseInt(parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]))
    gap = time - nowTime
    //小于30分钟，大于0分钟
    if (gap <= 30 && gap >= 0) {
      jc = jcs[i]
      // for (let j = 0, len = beforeArr.length - 1; j < len; j++) {
      //   if (gap <= beforeArr[j] && gap > beforeArr[j + 1]) {
      //     before = beforeArr[j]
      //     break
      //   }
      // }
      break
    }
  }

  let res = {
    week,
    xq,
    jc,
    gap
  }

  console.log(res);

  return res
}

async function select(time) {
  console.log(time);
  const {
    xq,
    jc,
    week,
    gap
  } = time

  let current = db.collection('pushClassList').where({
    week: _.eq(week),
    xqj: _.eq(xq),
    jcs: db.RegExp({
      regexp: '^' + jc + '-',
      options: 'i',
    }),
    before: _.gte(gap),
    result: _.neq(true),
    retry: _.or(_.exists(false), _.lt(3))
  })

  console.log('总量：', await current.count());

  data = (await current.limit(200).get()).data

  return data
}

function push(data) {
  let task = []
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let timeStr = `[${item.jcs}节] ${cellTime[item.jcs.split('-')[0]].split(' - ')[0]}-${cellTime[item.jcs.split('-')[1]].split(' - ')[1]}`

    let remark = '请注意准时上课～'
    let remarkC = '#173177'
    if (item.jcs == '3-4' || item.jcs == '7-8') {
      remark = '点击领取外卖红包~'
      remarkC = '#EF3D2F'
    }
    task.push(new Promise((resolve, reject) => {
      cloud.openapi.uniformMessage.send({
        touser: item._openid,
        mpTemplateMsg: {
          appid: 'wxcc20513541db4f0a',
          miniprogram: {
            appid: 'wx51afe011144c397f',
            pagepath: 'pages/coupons/coupons'
          },
          data: {
            first: {
              value: `您有一门课程在${item.before}分钟内开始`,
              color: '#173177'
            },
            keyword1: {
              value: item.kcmc,
              color: '#173177'
            },
            keyword2: {
              value: timeStr,
              color: '#173177'
            },
            keyword3: {
              value: item.cdmc,
              color: '#173177'
            },
            remark: {
              value: remark,
              color: remarkC
            }
          },
          templateId: 'FFGoDBreHpyZvO1ZBTNYL7EhDQyTaoF18L2bh4GQUeo'
        }
      }).then(() => {
        resolve([0, item._id])
      }).catch(err => {
        if (err.toString().includes('fail require subscribe')) {
          resolve([1, item._openid])
        }

        item.retry == undefined && resolve([2, item._id])

        resolve([3, item._id])
      })
    }))
  }

  Promise.all(task).then(async res => {
    const success = res.filter(e => !e[0]).map(e => e[1])
    console.log('成功', success);
    await db.collection('pushClassList').where({
      _id: _.in(success)
    }).update({
      data: {
        pushTime: Date.now(),
        result: true
      }
    }).then(res => console.log(res))

    const unfollow = res.filter(e => (e[0] == 1)).map(e => e[1])
    console.log('取关', unfollow)
    await db.collection('pushClassList').where({
      _openid: _.in(unfollow),
      result: _.neq(true)
    }).remove()

    const failnoTry = res.filter(e => (e[0] == 2)).map(e => e[1])
    console.log('失败未重试', failnoTry);
    await db.collection('pushClassList').where({
      _id: _.in(failnoTry)
    }).update({
      data: {
        pushTime: new Date().getTime(),
        result: false,
        retry: 0
      }
    })

    const failTry = res.filter(e => (e[0] == 3)).map(e => e[1])
    console.log('失败已重试', failTry);
    await db.collection('pushClassList').where({
      _id: _.in(failTry)
    }).update({
      data: {
        pushTime: new Date().getTime(),
        result: false,
        retry: _.inc(1)
      }
    })

  })
}