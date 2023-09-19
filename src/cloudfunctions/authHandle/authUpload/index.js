// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数 需要传入 username authIdentity prove authGroup
exports.main = async (event, context) => {
  let user_id = await db.collection("userinfo").where({
    username: event.username
  }).get()

  let _id = user_id.data[0]._id

  return db.collection("indiAuth").add({
    data: {
      authMan: _id,
      authIdentity: event.authIdentity,
      prove: event.prove,
      authGroup: event.authGroup,
      status: "passing",
      _createTime: Date.parse(new Date())
    }

  }).then(res => {
    console.log(res)
  })
}