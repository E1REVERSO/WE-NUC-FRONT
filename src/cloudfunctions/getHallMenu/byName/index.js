const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {

  const {
    name
  } = event

  return await db.collection(name).orderBy("order", "asc").get().then(res => {
    return res.data
  })
}