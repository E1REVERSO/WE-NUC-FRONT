const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(wxContext)

  openid = wxContext.OPENID
  unionid = wxContext.UNIONID

  let {
    avatar,
    nick
  } = event

  let condition = _.or([{
    _unionid: unionid
  }, {
    _openid: openid
  }])
  if (!unionid) {

    condition = {
      _openid: openid
    }
  }
  let exist = await db.collection('users').where(condition).count()
  console.log(exist);
  if (exist.total) {
    await db.collection('users').where(condition).update({
      data: {
        _openid: openid,
        _unionid: unionid,
        avatar,
        nick
      }
    })
  } else {
    await db.collection('users').add({
      data: {
        _openid: openid,
        _unionid: unionid,
        avatar,
        nick
      }
    })
  }

  return openid
}