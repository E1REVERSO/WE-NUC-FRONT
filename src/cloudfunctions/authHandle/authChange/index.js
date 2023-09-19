// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let data = event.data;
  let datai = event.datai;
  for (let i = 0; i < event.data.length; i++) {
    if (event.data[i].show) {
      // current_id = data[i]._id;
      let a = await db.collection("indiAuth").where({
        _id: data[i]._id
      }).update({
        data: {
          show: false
        }
      })
      if (a.stats.updated == 1) data[i].show = false;
      else return null;
    }
  }

  let b = await db.collection("indiAuth").where({
    _id: datai._id
  }).update({
    data: {
      show: true
    }
  })
  if (b.stats.updated == 1) {
    for (let ii = 0; ii < event.data.length; ii++) {
      if (event.data[ii]._id == datai._id) data[ii].show = true;
    }
  } else return null;
  return data
}