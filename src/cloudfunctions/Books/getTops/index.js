// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const rp = require('request-promise')
// 云函数入口函数
exports.main = async (event, context) => {
    const {
        current,
        pageSize,
        username
    } = event;
    const count = await db.collection('booksTop').count().then(res => res.total)
    return await db.collection('booksTop').orderBy('score', 'desc').skip(current * pageSize).limit(pageSize).get().then(async res => {
        let promiseArr = []
        for (let item of res.data) {
            promiseArr.push(new Promise((resolve, reject) => {
                db.collection('books').doc(item.attachId).get().then(async ress => {
                    console.log(ress)
                    let status_data = await rp({
                        uri: encodeURI(`http://119.23.242.190:4002/wenuc_http-7.2/bookDetail?username=${username}&id=${ress.data.id}`),
                        // uri: encodeURI(`http://101.43.234.77:5006/wenuc_http_war/bookDetail?username=${username}&id=${ress.data.id}`),
                        json: true
                    })
                    console.log(status_data)
                    if (status_data.code) status_data = {}
                    else status_data = status_data.data
                    resolve({
                        ...ress.data,
                        score: item.score,
                        digit: {
                            sum: ress.data.digit.sum,
                            stock: status_data.length
                        },
                        in_data: status_data
                    })
                })
            }))
        }
        return {
            code: 0,
            data: {
                current: current,
                total: count,
                pageSize: pageSize,
                list: await Promise.all(promiseArr)
            }
        }
    })
}