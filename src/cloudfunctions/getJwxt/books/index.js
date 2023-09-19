const cloud = require('wx-server-sdk')
const rp = require('request-promise');

const config = require('../config')
const encrypt = require('../encrypt')
let openid = ''

cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
    console.log("ok")
    let con = await config.main()
    let apiurl = con.api + con.version + '/books'
    let t = new Date().getTime()
    let code = await encrypt.main(t)
    const wxContext = cloud.getWXContext()
    openid = wxContext.OPENID
    let {
        current,
        pageSize,
        keyword,
        username
    } = event
    let requestUrl = apiurl + `?current=${current+1}&pageSize=${pageSize}&code=${code}&username=${username}&_t=${t}&keyword=${encodeURIComponent(keyword)}`
    let res = await rp({
        uri: requestUrl,
        json: true
    })
    console.log(res);
    if (res.code) {
        return res;
    }
    console.log(event)
    //查询isbn
    let promiseArr = []
    let data = res.data.list

    // for (let item of data) {
    //     if (!item.ISBN) continue;
    //     console.log(item.ISBN)
    //     db.collection('books').where({
    //         ISBN: item.ISBN
    //     }).get().then(res => {
    //         console.log(res)
    //     })
    // }
    // return;
    for (let i = 0; i < data.length; i++) {

        if (data[i].ISBN) {
            promiseArr.push(new Promise(async (resolve, reject) => {
                let item = data[i]
                console.log(item)
                let ISBN = item.ISBN
                let S_ISBN = ISBN.split("-").join("")
                let detail;
                let getf = await db.collection('books').where({
                    ISBN
                }).get().then(res => res.data).catch(e => {
                    reject()
                })
                console.log(getf)
                if (getf.length) {
                    detail = getf[0].detail
                    db.collection('booksTop').where({
                        attachId: getf[0]._id
                    }).update({
                        data: {
                            score: _.inc(1)
                        }
                    })
                } else {
                    await rp({
                        uri: "https://api.binstd.com/isbn/query?appkey=94c031f021479355&isbn=" + S_ISBN,
                        json: true
                    }).then(res => {
                        if (!res.status) {
                            detail = res.result
                            data[i].detail = detail
                            console.log(data[i])
                            db.collection('books').add({
                                data: data[i]
                            }).then(res => res._id).then(id => {
                                console.log("id:", id)
                                db.collection('booksTop').add({
                                    data: {
                                        attachId: id,
                                        score: 1
                                    }
                                })
                            })

                        }
                    })
                }
                data[i].detail = detail
                resolve()
            }))
        }
    }
    await Promise.all(promiseArr)
    return {
        code: 0,
        data: {
            total: res.data.total,
            current: current,
            list: data
        }
    }
}