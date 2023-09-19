const cloud = require('wx-server-sdk')
const rp = require('request-promise');
const utils = require('./utils')

const encrypt = require('../encrypt')
const config = require('../config')

let openid = ''

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  let con = await config.main()
  let apiurl = con.api + con.version + '/classTable'
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
  await record(event, res, context)

  return res
}

async function record(event, res, context) {
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
    let data = []

    for (let i = 0; i < res.data.main.length; i++) {
      data[i] = res.data.main[i]
      data[i]._openid = openid
      data[i].username = event.username
      data[i].weeks = utils.getWeeks(data[i].zcd)
      data[i].sections = utils.getSections(data[i].jcs)
    }

    for (let i = 0; i < res.data.minor.length; i++) {
      res.data.minor[i].username = event.username
    }

    db.collection('wenuc_classTable').where({
      _openid: openid,
      username: event.username
    }).remove().then(() => {
      db.collection('wenuc_classTable').add({
        data
      })
    }).then(async () => {
      return await db.collection('pushAuth').where({
        _openid: openid
      }).count()
    }).then(res => {
      if (res.total) {
        cloud.callFunction({
          name: 'pushClass',
          data: {
            type: 'setClassTable',
            openid
          }
        }).then(res => {
          console.log(res);
        })
      }
    })
  }
}