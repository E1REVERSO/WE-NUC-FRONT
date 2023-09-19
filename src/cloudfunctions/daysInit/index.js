// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  db.collection('daysInit').add({
    data: {
      _openid: wxContext.OPENID,
      _createTime: new Date().getTime()
    }
  })

  let initEvents = await db.collection('cloudDays').where({
    init: true
  }).get()

  initEvents = initEvents.data

  for (let i = 0; i < initEvents.length; i++) {
    initEvents[i]._openid = wxContext.OPENID
    delete initEvents[i]._id
  }

  return await db.collection('userDays').add({
    data: initEvents
  })
}