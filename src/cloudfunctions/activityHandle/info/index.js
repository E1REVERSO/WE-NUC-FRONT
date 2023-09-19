// 云函数入口文件
const cloud = require('wx-server-sdk')
const resHandle = require('../utils/resHandle')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    console.log(resHandle)
    let {
        id
    } = event
    let indi_activity = await db.collection('activity_list').doc(id).get()
    if (!indi_activity.data) return await resHandle.res("未知错误", {}, "none")
    let activity = await db.collection('activities').doc(indi_activity.data.activity).get();

    activity = activity.data
    if (!activity) {
        return await resHandle.res("活动不存在", {}, "none")
    }

    if (activity._endTime <= new Date().getTime()) {
        if (activity.reward_data) {
            for (let i = 0; i < activity.reward_data.length; i++) {
                let user = await db.collection('users').where({
                    _openid: activity.reward_data[i].attender._openid
                }).get()
                console.log(user)
                if (user.data) {
                    activity.reward_data[i].user = user.data[0]
                }
            }
        }
        return await resHandle.res("活动已过期", {
            activity,
            indi_activity: indi_activity.data
        }, "out_of_date")
    }
    let builder = await db.collection('users').where({
        _openid: indi_activity.data._openid
    }).get()
    builder = builder.data[0]
    indi_activity.data.builder = builder
    for (let i = 0; i < indi_activity.data.joiner.length; i++) {
        let user = await db.collection('users').where({
            _openid: indi_activity.data.joiner[i]
        }).get()
        user = user.data[0]
        indi_activity.data.joiner_detail = indi_activity.data.joiner_detail ? indi_activity.data.joiner_detail.concat([user]) : [user]
    }
    return await resHandle.res("", {
        activity,
        indi_activity: indi_activity.data,
        isMine: indi_activity.data._openid == cloud.getWXContext().OPENID
    }, "normal")

}