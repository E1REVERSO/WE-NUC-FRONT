const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID
  console.log(openid);
  let target = await getPermission(openid, event.doc)
  console.log(target);
  if (target) {
    return await getClassTable(target)
  }
}

async function getPermission(openid, doc) {
  let permission = await db.collection('authClassTable').doc(doc).get()
  permission = permission.data
  if (permission._openid == openid && permission.acceptTime && (new Date().getTime() <= permission.endTime)) {
    return permission._targetOpenid
  } else {
    return null
  }
}

async function getClassTable(openid) {
  let count = await db.collection('wenuc_classTable').where({
    _openid: openid
  }).count()
  count = count.total
  let times = Math.ceil(count / 1000)
  let task = []
  for (let i = 0; i < times; i++) {
    task.push(new Promise((resolve, reject) => {
      db.collection('wenuc_classTable').where({
          _openid: openid
        })
        .skip(i * 1000)
        .limit(1000)
        .get()
        .then(res => {
          resolve(res)
        })
    }))
  }
  let data = []
  await Promise.all(task).then(res => {
    for (let i = 0; i < res.length; i++) {
      data = data.concat(res[i].data)
    }
  })

  return data
}