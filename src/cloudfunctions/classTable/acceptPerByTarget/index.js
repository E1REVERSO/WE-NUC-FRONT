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

  let data = await db.collection('authClassTable').doc(doc).get()
  console.log(data);
  if (data.data.acceptTime) {
    return false
  }

  return await db.collection('authClassTable').doc(doc).update({
    data: {
      _openid: openid,
      acceptTime: new Date().getTime()
    }
  })
}