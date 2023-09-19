const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(wxContext);
  sopenid = wxContext.FROM_OPENID
  unionid = wxContext.FROM_UNIONID

  let count = await db.collection('users').where(_.or([{
    _unionid: unionid
  }, {
    _sopenid: sopenid
  }])).count()

  count = count.total

  let data = {
    _sopenid: sopenid,
    mpsubscribe: event.Event == 'subscribe' ? true : false
  }

  unionid ? data['_unionid'] = unionid : undefined

  if (count) {
    await db.collection('users').where(_.or([{
      _unionid: unionid
    }, {
      _sopenid: sopenid
    }])).update({
      data
    })
  } else {
    await db.collection('users').add({
      data
    })
  }
}