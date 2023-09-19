// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await rp('http://zb.zzux.net/cas/login')
}