const cloud = require('wx-server-sdk')

cloud.init()
const $ = cloud.database().command.aggregate
exports.main = async (event, context) => {
    const {
        bind_database,
        bind_param
    } = event
    let count = await cloud.database().collection(bind_database).count()
    console.log(count)
    let c = await cloud.database().collection(bind_database).aggregate().limit(count.total).group({
        _id: `$${bind_param}`,
        num: $.sum(1)
    }).end()
    // console.log(c.count())
    // console.log(c.end())
    return c.list
}