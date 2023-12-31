// cloudfunctions/saveUserInfo/index.js

// 引入云函数SDK
const cloud = require('wx-server-sdk')

// 初始化
cloud.init({})

// 数据库链接
let db = cloud.database()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 云函数入口函数
exports.main = async (event, context) => {
  // 全局的工具类，在云函数中获取微信的调用上下文
  const wxContext = cloud.getWXContext()
  // 云数据库操作
  try {
    // 实际注册功能时，应先检测该用户是否已经注册

    // 此处操作集合时，请预先在数据库中创建该集合users

    let c = await db.collection('users').where({
      _openid: wxContext.OPENID
    }).get()
    if (!c.data.length) {
      let d = await db.collection('users').where({
        _unionid: wxContext.UNIONID
      }).get()
      if (d.data.length) {
        return await db.collection('users').where({
          _unionid: wxContext.UNIONID
        }).update({
          data: {
            created: formatTime(new Date(Date.now() + (8 * 60 * 60 * 1000))),
            userInfo: event.userInfo,
            _openid: wxContext.OPENID,
            nick: event.nick,
            jifen: 0,
            avatar: event.avatar,
            city: event.city,
            province: event.province,
            gender: event.gender,
            userType: 'user'
          }
        })
      } else {
        return await db.collection('users').add({
          data: {
            created: formatTime(new Date(Date.now() + (8 * 60 * 60 * 1000))),
            userInfo: event.userInfo,
            _openid: wxContext.OPENID,
            nick: event.nick,
            jifen: 0,
            avatar: event.avatar,
            city: event.city,
            province: event.province,
            gender: event.gender,
            userType: 'user'
          }
        })
      }

    } else {

      if (!c.data[0].nick) {
        return await db.collection('users').where({
          _openid: wxContext.OPENID
        }).update({
          data: {
            created: formatTime(new Date(Date.now() + (8 * 60 * 60 * 1000))),
            userInfo: event.userInfo,
            _openid: wxContext.OPENID,
            nick: event.nick,
            jifen: 0,
            avatar: event.avatar,
            city: event.city,
            province: event.province,
            gender: event.gender,
            userType: 'user'
          }

        })
      }
    }

  } catch (e) {
    console.error(e)
  }
}