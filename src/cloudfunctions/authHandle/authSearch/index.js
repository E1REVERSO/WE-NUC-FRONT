// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let usi = await db.collection("userinfo").where({
    username: event.username
  }).get()
  let _id = usi.data[0]._id
  return db.collection("indiAuth").where({
    authMan: _id
  }).get()
}