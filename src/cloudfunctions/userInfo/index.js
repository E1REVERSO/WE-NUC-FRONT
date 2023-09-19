// 云函数入口文件

const record = require('./record/index')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'record':
      return await record.main(event, context)
  }
}
