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
  let apiurl = con.api + con.version + '/getScore'
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
    let data = []

    let xns = Object.keys(res.data[0])

    for (let i = 0; i < xns.length; i++) {
      let xn = xns[i]

      let xqs = Object.keys(res.data[0][xn])
      for (let j = 0; j < xqs.length; j++) {
        let xq = Object.keys(res.data[0][xn])[j]
        let sets = res.data[0][xn][xq]
        data = data.concat(sets)
      }
    }

    await db.collection('wenuc_scores').where({
      xh: event.username
    }).remove()
    console.log(data)
    await db.collection('wenuc_scores').add({
      data
    }).catch(e=>{

    })
  }
}