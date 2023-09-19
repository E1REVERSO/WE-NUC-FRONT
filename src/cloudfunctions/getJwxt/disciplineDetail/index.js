const cloud = require('wx-server-sdk')
const rp = require('request-promise');

const encrypt = require('../encrypt')
const config = require('../config')
const rf = require("fs");
// const request = require("request")
// const rp = require('request-promise')
let openid = ''

cloud.init()

exports.main = async (event, context) => {
  // let upload = event.upload ? false : true

  let con = await config.main()
  console.log(con);
  let apiurl = con.api + con.version + '/tpd'
  let t = new Date().getTime()
  let code = await encrypt.main(t)

  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID


  let {
    username,
    password
  } = event

  let requestUrl = apiurl + `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&code=${code}&_t=${t}&zyh=${event.zyh}`

  console.log(requestUrl);

  let res = await rp({
    uri: requestUrl
  })

  console.log(res);

  res = JSON.parse(res.trim())
  console.log(res);
  if (event.upload) {
    let data = res.data
    let datai = JSON.stringify(data)
    rf.writeFileSync(`/tmp/${event.zyh}.json`, datai);
    cloud.uploadFile({
      cloudPath: `training_plan/${event.zyh}.json`,
      fileContent: rf.readFileSync(`/tmp/${event.zyh}.json`, 'utf-8')
    })
  }

  // if (upload) {
  //   await wx.cloud.getTempFileURL({
  //     fileList: [`cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/training_plan/${res.data.items[0].jxzxjhxx_id}.json`],
  //     success: res => {
  //       // get temp file URL
  //       console.log(res.fileList)
  //     },
  //     fail: err => {
  //       // handle error
  //       //提交
  //       // console.log(`${zyh}出了大问题！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！`)
  //       let options = {
  //         method: 'get',
  //         uri: requestUrl,
  //         timeout: 200000,
  //         json: true
  //       };

  //       await rp(options).then(res => {

  //       }).catch(err => {
  //         console.log(err)
  //       })
  //     }
  //   })
  // }
  return res.data
}