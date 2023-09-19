// 云函数入口文件
const cloud = require('wx-server-sdk')
const resHandle = require('../utils/resHandle')
const info = require('../info/index')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    console.log(resHandle)
    let {
        id
    } = event
    let infos = await info.main(event, context)
    console.log(infos)
    // infos = infos.data
    if (infos.status != "normal") return resHandle.res(infos.msg, {}, "none");
    let _openid = cloud.getWXContext().OPENID
    //看看是否有此用户，没有让其授权
    let users = await db.collection('users').where({
        _openid
    }).get()
    users = users.data
    if (!users || !users.length || !users[0].nick) return await resHandle.res("该用户未授权", {}, "unauthorized")
    if (infos.data.indi_activity._openid == _openid) return await resHandle.res("不能为自己助力", {}, "notToMine")
    console.log(infos.data.activity.join_count, infos.data.indi_activity.joiner)

    let haveMine = await db.collection('activity_list').where({
        _openid
    }).get()
    haveMine = haveMine.data
    let mine_id
    if (!haveMine || !haveMine.length) {
        let add = await db.collection('activity_list').add({
            data: {
                activity: infos.data.activity._id,
                _openid,
                joiner: [],
                status: "doing",
                _createTime: new Date().getTime()
            }
        })
        mine_id = add._id
    } else {
        mine_id = haveMine[0]._id
    }
    if (infos.data.activity.join_count <= infos.data.indi_activity.joiner.length) {
        return await resHandle.res("助力值已满，等待开奖", {
            _id: mine_id
        }, "full")
    }

    //如果已授权过了 判断其有无参加资格
    let joined = await db.collection('activity_list').where({
        joiner: _openid
    }).get()
    joined = joined.data
    if (joined) {
        let flag = false
        for (let i = 0; i < joined.length; i++) {
            if (joined[i].activity == infos.data.activity._id) {
                flag = true;
                break;
            }
        }
        if (flag) return await resHandle.res("已为他人助力过一次了", {
            _id: mine_id
        }, "unauthorized")
    }
    let update = await db.collection('activity_list').doc(id).update({
        data: {
            joiner: _.push([_openid])
        }
    })


    return await resHandle.res("", {
        _id: mine_id
    }, "normal")

}