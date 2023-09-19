// 云函数入口文件
const cloud = require('wx-server-sdk')
const top = require('./getTops/index')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case 'top':
            return await top.main(event, context);
    }
}