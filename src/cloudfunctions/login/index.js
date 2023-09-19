// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let openid = wxContext.OPENID
  let unionid = wxContext.UNIONID

  let count = await db.collection('users').where(_.or([{
    _unionid: unionid
  }, {
    _openid: openid
  }])).count()

  count = count.total

  let data = {
    _openid: openid,
    _unionid: unionid
  }

  if (count) {
    await db.collection('users').where(_.or([{
      _unionid: unionid
    }, {
      _openid: openid,
    }])).update({
      data
    })
  } else {
    await db.collection('users').add({
      data
    })
  }

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}