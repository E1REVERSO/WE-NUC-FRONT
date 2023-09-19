const cloud = require('wx-server-sdk')

let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID
  console.log(openid);
  return getAlldata(await getList(openid))
}

async function getList(openid) {
  let total = await db.collection('authClassTable').where({
    _targetOpenid: openid,
    _openid: _.neq(null)
  }).count()
  total = total.total
  let times = Math.ceil(total / 100)
  let task = []

  for (let i = 0; i < times; i++) {
    task.push(new Promise((resolve, reject) => {
      db.collection('authClassTable').where({
        _targetOpenid: openid,
        _openid: _.neq(null)
      }).orderBy('acceptTime', 'desc').skip(i * 100).limit(100).get().then(res => {
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

async function getAlldata(list) {
  let task = []
  for (let i = 0; i < list.length; i++) {
    task.push(new Promise((resolve, reject) => {
      getUserInfo(list[i]._openid).then(res => {
        resolve(res)
      })
    }))
  }
  console.log(task);
  await Promise.all(task).then(res => {
    for (let i = 0; i < res.length; i++) {
      list[i].targetInfo = res[i]
    }
  })

  console.log(list);
  return list
}

async function getUserInfo(openid) {
  let res = await db.collection('users').where({
    _openid: openid
  }).get()
  return res.data[0]
}