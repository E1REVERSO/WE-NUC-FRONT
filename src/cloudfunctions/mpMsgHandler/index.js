const subscribe = require('./subscribe/index')

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  switch (event.Event) {
    case 'subscribe':
      return await subscribe.main(event, context)
    case 'unsubscribe':
      return await subscribe.main(event, context)
  }
}