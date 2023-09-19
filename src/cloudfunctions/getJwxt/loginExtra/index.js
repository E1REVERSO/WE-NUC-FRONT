const cloud = require('wx-server-sdk')
const rp = require('request-promise');

const encrypt = require('../encrypt')
const config = require('../config')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let con = await config.main()
  console.log(con);
  let apiurl = con.api + con.version + '/login'
  let t = new Date().getTime()
  let code = await encrypt.main(t)

  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID


  let {
    username,
    password
  } = event

  let c = await check(username, openid)
  console.log(c);
  if (!c.pass) return 'tooMore'

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

    db.collection('extraAccounts').where({
      username: event.username
    }).count().then(res => {
      if (!res.total) {
        db.collection('extraAccounts').add({
          data: {
            _openid: openid,
            username: event.username,
            password: event.password
          }
        })
      }
    })

    let data = {
      ...res.data,
      password: event.password
    }

    console.log(data);

    db.collection('userinfo').where({
      username: event.username
    }).count().then(res => {
      if (res.total == 0) {
        db.collection('userinfo').add({
          data
        })
      } else {
        db.collection('userinfo').where({
          username: event.username
        }).update({
          data
        })
      }
    })
  }
}

async function check(username, _openid) {
  return await db.collection('extraAccounts').where({
    _openid,
    username: _.neq(username)
  }).count().then(res => {
    let pass = false
    if (res.total <= 1) {
      pass = true
    }
    return {
      pass,
      total: res.total
    }
  })
}