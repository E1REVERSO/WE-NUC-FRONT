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
  // con.version = 'wenuc_http-2.2t'
  let apiurl = con.api + con.version + '/noneClass'
  let t = new Date().getTime()
  let code = await encrypt.main(t)

  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID


  let {
    username,
    password,
    lh,
    zcd,
    xqj
  } = event

  const opt = {
    lh,
    zcd,
    xqj,
    _createTime: _.gte(new Date().getTime() - 6 * 60 * 60 * 1000)
  }

  if (await db.collection('empty').where(opt).count().then(res => {
      return res.total
    })) {

    return {
      code: 1,
      data: await (async () => {
        let data = await db.collection('empty').where(opt).get()
        return data.data[0].data
      })(),
      msg: ''
    }
  }

  let requestUrl = apiurl + `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&code=${code}&_t=${t}&lh=${lh}&zcd=${zcd}&xqj=${xqj}`

  console.log(requestUrl);

  let res = await rp({
    uri: requestUrl
  })

  console.log(res);

  res = JSON.parse(res.trim())
  await record(event, res)
  let res1 = res.data
  let data = {}
  for (let i = 0; i < res1.length; i++) {
    let obj = res1[i].items
    for (let j = 0; j < obj.length; j++) {
      let obji = obj[j]
      if (!data[obji.cdmc]) data[obji.cdmc] = {}
      data[obji.cdmc][i + 1] = obji
    }
  }

  db.collection('empty').add({
    data: {
      lh,
      zcd,
      xqj,
      data,
      _createTime: new Date().getTime()
    }
  })

  res.data = data
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
  }
}