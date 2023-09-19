// 云函数入口文件
const getPermission = require('./getPermission/index')
const getClassTable = require('./getClassTable/index')
const getAuth = require('./getAuth/index')
const accept = require('./accept/index')
const cancel = require('./cancel/index')
const createByTarget = require('./createByTarget/index')
const acceptPerByTarget = require('./acceptPerByTarget/index')
const del = require('./delete/index')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getPermission':
      return await getPermission.main(event, context)
    case 'getClassTable':
      return await getClassTable.main(event, context)
    case 'getAuth':
      return await getAuth.main(event, context)
    case 'accept':
      return await accept.main(event, context)
    case 'cancel':
      return await cancel.main(event, context)
    case 'createByTarget':
      return await createByTarget.main(event, context)
    case 'acceptPerByTarget':
      return await acceptPerByTarget.main(event, context)
    case 'delete':
      return await del.main(event, context)
  }
}