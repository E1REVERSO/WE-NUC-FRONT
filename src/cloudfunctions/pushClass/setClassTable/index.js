const cloud = require('wx-server-sdk')
const ctUtils = require("./classTable")

const getFmtDate = function (str) {
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

  return new Date().Format(str)
}

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  openid = event.openid
  let info = await getInfo(openid)
  if (!info.data.length) {
    return false
  }
  info = info.data[0]
  let classTable = await getClassTable(openid)
  classTable = classSeparater(classTable, info.before)
  storagePush(openid, classTable, info.before)
  return true
}
async function getInfo(_openid) {
  return await db.collection('pushAuth').where({
    _openid
  }).get()
}

async function getClassTable(_openid) {
  let base = db.collection('wenuc_classTable').where({
    _openid
  })
  let total = await base.count()
  total = total.total
  const step = 1000
  const times = Math.ceil(total / step)

  let data = []
  let task = []
  for (let i = 0; i < times; i++) {
    task.push(db.collection('wenuc_classTable').where({
      _openid
    }).skip(step * i).limit(step).get())
  }

  await Promise.all(task).then(res => {
    for (let i = 0; i < res.length; i++) {
      data = data.concat(res[i].data)
    }
  })
  return data
}

function classSeparater(classTable, before = 20) {
  let newList = []
  for (let i = 0; i < classTable.length; i++) {
    let weeks = ctUtils.getWeeks(classTable[i].zcd)
    delete classTable[i]._id
    classTable[i].before = before
    for (let j = 0; j < weeks.length; j++) {
      let tmp = {
        ...classTable[i],
        pushTime: null
      }
      tmp.week = weeks[j]
      newList.push(tmp)
    }
  }
  return newList
}

function storagePush(_openid, classTable, before) {
  db.collection('pushClassList').where({
      _openid,
      result: _.neq(true)
    }).remove().then(() => {
      db.collection('pushClassList').add({
        data: classTable
      })
    })
    .then(() => {
      remark = `\n您本学期一共有${classTable.length}节课\n\n您将会在每节课上课前${before}分钟内收到提醒\n\n本功能仅供参考，实际上课情况请以教学计划为准，我们不承担由本功能失误造成的迟到等后果`
      cloud.openapi.uniformMessage.send({
        touser: _openid,
        mpTemplateMsg: {
          appid: 'wxcc20513541db4f0a',
          miniprogram: {
            appid: 'wx51afe011144c397f',
            pagepath: 'pages/classTable/classTable'
          },
          data: {
            first: {
              value: `您的课程已经成功添加/刷新`,
              color: '#173177'
            },
            keyword1: {
              value: _openid.slice(0, 4) + "****" + _openid.slice(24),
              color: '#173177'
            },
            keyword2: {
              value: getFmtDate('yyyy年MM月dd日 hh:mm:ss'),
              color: '#173177'
            },
            remark: {
              value: remark,
              color: '#173177'
            }
          },
          templateId: 'Eu4zXuChdaC7JEyQULYqTiH3U-_3RMlDj5c_N6bciXc'
        }
      })
    })
}