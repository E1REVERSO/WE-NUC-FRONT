// 云函数入口文件
const byName = require('./byName/index')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'byName':
      return await byName.main(event, context)

  }
}