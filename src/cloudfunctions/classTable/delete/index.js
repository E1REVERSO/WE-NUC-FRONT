const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID
  let username = event.username

  db.collection('wenuc_classTable').where({
    _openid: openid,
    username
  }).remove()
}