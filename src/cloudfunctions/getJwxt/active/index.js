const cloud = require('wx-server-sdk')
const rp = require('request-promise');

const encrypt = require('../encrypt')
const config = require('../config')


cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
    let con = await config.main()
    let apiurl = con.api + con.version + '/active'
    let {
        username,
        password
    } = event
    let requestUrl = apiurl + `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&code=${1}&_t=${Date.now()}`
    const wxContext = cloud.getWXContext();
    let data = await rp({
        uri: requestUrl,
        json: true
    })

    try {
        db.collection('activeMember').where({
            OPENID: wxContext.OPENID
        }).count().then(res => {
            if (res.total && res.total > 0) {
                db.collection('activeMember').where({
                    OPENID: wxContext.OPENID
                }).update({
                    data: {
                        _createTime: Date.now(),
                        ...wxContext,
                        username
                    }
                })
            } else {
                db.collection('activeMember').add({
                    data: {
                        _createTime: Date.now(),
                        ...wxContext,
                        username
                    }
                })
            }
        }).catch(e => {

        })
    } catch (e) {

    }
    return data
}