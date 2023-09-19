const diners = require('./diners/index')
const broadcast = require('./broadcast/index')
// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.type) {
    case 'diners':
      return await diners.main(event, context)
    case 'broadcast':
      return await broadcast.main(event, context)
    default:
      let task = []
      task.push(new Promise(async (resolve, reject) => {
        resolve(await diners.main(event, context))
      }))
      task.push(new Promise(async (resolve, reject) => {
        resolve(await broadcast.main(event, context))
      }))
      await Promise.all(task)
  }
}