const cloud = require('wx-server-sdk')
const rp = require('request-promise');

const encrypt = require('../encrypt')
const config = require('../config')

let openid = ''

cloud.init()
const db = cloud.database()
exports.sync = async () => {
    let con = await config.main()
    let apiurl = con.api + con.version + '/status'
    let t = new Date().getTime()
    let code = await encrypt.main(t)
    const wxContext = cloud.getWXContext()
    openid = wxContext.OPENID

    let requestUrl = apiurl

    let res = await rp({
        uri: requestUrl,
        json: true
    })
    console.log(res)
    try {
        res.data.memory > 60 ? res.data.memory -= 10:""
        db.collection('serverStatus').doc('63605076623ac038013b52820c747a51').update({
            data: {
                ...res.data,
                _createTime: Date.now()
            }
        })
    } catch (e) {

    }

    // db.collection('serverStatus').add({
    //     data: {
    //         ...res.data,
    //         _createTime: Date.now()
    //     }
    // })
    return res;
}
exports.main = async (event, context) => {
    let con = await config.main()
    let apiurl = con.api + con.version + '/status'
    let t = new Date().getTime()
    let code = await encrypt.main(t)

    const wxContext = cloud.getWXContext()
    openid = wxContext.OPENID

    let requestUrl = apiurl + `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&code=${code}&_t=${t}`


    let res = await rp({
        uri: requestUrl
    })

    console.log(res);

    res = JSON.parse(res.trim())

    return res
}