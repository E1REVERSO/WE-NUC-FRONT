const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID
  console.log(openid);

  return await db.collection('authClassTable').add({
    data: {
      _targetOpenid: openid,
      startTime: new Date().getTime(),
      endTime: 2840112000000
    }
  })
}