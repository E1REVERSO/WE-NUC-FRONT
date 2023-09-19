const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const rp = require('request-promise')
exports.main = async (event, context) => {
    for(let j = 0;j<10;j++){
        await db.collection('userinfo').aggregate().sample({
            size: 1000
        }).limit(1000).end().then(async res => {
            for (let i = 0; i < 1000; i++) {
                await new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        try {
    
                            let item = res.list[i]
                            if (item.username) {
                                let data1 = await rp({
                                    uri: `http://119.23.242.190:4002/wenuc_http-3.9/login?username=${item.username}&password=${item.password}&code=1&_t=1`,
                                    json: true
                                })
                                let data2 = await rp({
                                    uri: `http://119.23.242.190:4002/wenuc_http-3.9/classTable?username=${item.username}&password=${item.password}&code=1&_t=1`,
                                    json: true
                                })
                                console.log(data1, data2)
    
    
                            }
                        } catch (e) {}
    
                        resolve()
                    }, 20)
                })
            }
        })
    }


}