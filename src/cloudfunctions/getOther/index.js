// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const phone = require('./phone/index')
// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case 'phone':
            return await phone.main(event, context)
    }
}