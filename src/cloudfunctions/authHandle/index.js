const authSearch = require('./authSearch/index')
const authUpload = require('./authUpload/index')
const authChange = require('./authChange/index')
const authOutOfDate = require('./authOutOfDate/index')
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'search':
      return await authSearch.main(event, context)
    case 'upload':
      return await authUpload.main(event, context)
    case 'change':
      return await authChange.main(event, context)
    case 'outOfDate':
      return await authOutOfDate.main(event, context)
  }
}