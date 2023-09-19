const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID
  console.log(openid);
  let before = event.before
  setBefore(openid, before).then(() => {
      cloud.callFunction({
        name: 'pushClass',
        data: {
          type: 'setClassTable',
          openid
        }
      })
    })
    .then(res => {
      console.log(res);
    })

  return true
}

async function setBefore(_openid, before) {
  db.collection('pushAuth').where({
    _openid
  }).update({
    data: {
      before: before
    }
  })
}