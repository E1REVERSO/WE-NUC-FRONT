const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID
  console.log(openid);

  setOn(openid)
  cloud.callFunction({
    name: 'pushClass',
    data: {
      type: 'setClassTable',
      openid
    }
  }).then(res => {
    console.log(res);
  })

  return true
}

function setOn(_openid) {
  db.collection('pushAuth').add({
    data: {
      _openid,
      before: 20
    }
  })
}