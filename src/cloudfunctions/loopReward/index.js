// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
    console.log(await db.collection('activities').get())
    let cl = await db.collection('activities').where({
        _endTime: _.lt(new Date().getTime()),
        reward_data: _.exists(false).or(_.eq(null)).or(_.eq([]))
    }).get()
    cl = cl.data
    console.log(cl)
    if (cl) {
        for (let i = 0; i < cl.length; i++) {
            let activity = cl[i]._id
            let counts = 0
            for (let j = 0; j < cl[i].reward.length; j++) {
                counts += cl[i].reward[j].count
            }

            let attenders = await db.collection('activity_list').aggregate().project({
                    activity: 1,
                    joiner: 1,
                    _openid: 1,
                    size: $.size('$joiner')
                })
                .match({
                    activity,
                    size: _.gte(cl[i].join_count)
                }).sample({
                    size: counts
                }).end()
            console.log(attenders)
            attenders = attenders.list
            console.log(attenders)
            let jsonArray = []

            console.log("233")
            // let index = 0
            for (let k = 0, index = 0; k < cl[i].reward.length; k++) {
                for (let l = 0; l < cl[i].reward[k].count; l++, index++) {
                    // let us = await db.collection('users').where({_openid:attenders[index]})
                    jsonArray.push({
                        ...{
                            attender: attenders[index],
                            reward: cl[i].reward[k]
                        }
                    })
                }

            }


            console.log(jsonArray)
            db.collection('activities').doc(activity).update({
                data: {
                    reward_data: jsonArray
                }
            })


        }
    }
}