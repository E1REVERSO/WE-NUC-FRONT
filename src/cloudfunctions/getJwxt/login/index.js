const cloud = require('wx-server-sdk')
const rp = require('request-promise');

const encrypt = require('../encrypt')
const config = require('../config')

let openid = ''

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  let con = await config.main()
  console.log(con);
  let apiurl = con.api + 'wenuc_http-7.9' + '/login'
  let t = new Date().getTime()
  let code = await encrypt.main(t)

  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID


  let {
    username,
    password
  } = event

  let requestUrl = apiurl + `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&code=${code}&_t=${t}`
  
  console.log(requestUrl);

  let res = await rp({
    uri: requestUrl
  })

  console.log(res);

  res = JSON.parse(res.trim())
  await record(event, res)

  return res
}

async function record(event, res) {
  console.log(res);
  await db.collection('loginlog').add({
    data: {
      _openid: openid,
      ...event,
      res: res.code,
      msg: res.msg,
      time: new Date().getTime()
    }
  })

  if (res.code == 1) {

    db.collection('users').where({
      _openid: openid
    }).update({
      data: {
        username: event.username
      }
    })

    let data = {
      ...res.data,
      password: event.password
    }

    console.log(data);

    let count = await db.collection('userinfo').where({
      username: event.username
    }).count()

    if (count.total == 0) {
      await db.collection('userinfo').add({
        data
      })
    } else {
      await db.collection('userinfo').where({
        username: event.username
      }).update({
        data
      })
    }
  }
}