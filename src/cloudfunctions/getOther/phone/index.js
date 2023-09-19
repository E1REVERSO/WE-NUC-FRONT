const cloud = require('wx-server-sdk')


cloud.init()
const db = cloud.database()
const _ = db.command
const $ = _.aggregate
exports.main = async (event, context) => {
    //分组
    let groups = await db.collection('phoneList').aggregate().group({
        _id: '$class'
    }).end().then(res => {
        return res.list.map(a => a._id)
    })
    console.log(groups)
    let promiseArr = []
    for (let group of groups) {
        promiseArr.push(new Promise(async (resolve, reject) => {
            let name = group;
            let children = await db.collection('phoneList').where({
                class: group
            }).limit(1000).orderBy('order', 'desc').get().then(res => res.data)
            resolve({
                name,
                children
            })
        }))
    }
    return {
        errCode: 0,
        data: await Promise.all(promiseArr)
    }

}