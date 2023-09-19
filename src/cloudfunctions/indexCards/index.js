// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const cardList = require('./cardList/index')
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    switch (event.type) {
        case 'cardList':
            return await cardList.main();
    }

}