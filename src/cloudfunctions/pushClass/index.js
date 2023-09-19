const push = require('./push/index')
const switchOn = require('./switchOn/index')
const switchOff = require('./switchOff/index')
const setClassTable = require('./setClassTable/index')
const setBefore = require('./setBefore/index')

// 云函数入口函数
exports.main = async (event, context) => {


  switch (event.type) {
    case 'switchOn':
      return await switchOn.main(event, context)
    case 'switchOff':
      return await switchOff.main(event, context)
    case 'setClassTable':
      return await setClassTable.main(event, context)
    case 'setBefore':
      return await setBefore.main(event, context)

    default:
      return await push.main(event, context)
  }
}