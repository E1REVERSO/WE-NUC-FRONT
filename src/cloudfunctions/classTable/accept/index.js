const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID
  console.log(openid);
  let {
    doc
  } = event

  let date = new Date().getTime()

  let res = await db.collection('authClassTable').doc(doc).update({
    data: {
      acceptTime: date,
      endTime: 2840112000000
    }
  })

  return res
}