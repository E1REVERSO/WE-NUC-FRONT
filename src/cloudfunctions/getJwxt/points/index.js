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
  let apiurl = con.api + con.version + '/point'
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

  return res
}