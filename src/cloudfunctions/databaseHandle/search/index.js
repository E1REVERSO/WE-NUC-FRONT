const cloud = require('wx-server-sdk')

cloud.init()
exports.main = async (event, context) => {
    console.log("eee")
    let {
        condition,
        database
    } = event
    let g = await cloud.database().collection(database).where(condition).get()
    return g.data
}