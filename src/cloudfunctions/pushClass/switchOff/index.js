const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID
  console.log(openid);

  setOff(openid)
}

function setOff(_openid) {
  db.collection('pushAuth').where({
    _openid
  }).remove()

  db.collection('pushClassList').where({
    _openid,
    result: _.neq(true)
  }).remove()
}