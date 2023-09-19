const cloud = require('wx-server-sdk')
const rp = require('request-promise');
const cheerio = require('cheerio')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
    return await rp({
        uri: "http://www.nuc.edu.cn/index/tzgg.htm"
    }).then(async res => {
        const $ = cheerio.load(res)
        let array = []
        let list = $('.list_con_rightlist').find('li')

        let promiseArr = []
        for (let li of list) {
            promiseArr.push(new Promise(async (resolve, reject) => {
                let a = $(li).children('a').text()
                let time = $(li).children('span').text()
                console.log(a)
                let href = "http://www.nuc.edu.cn/" + $(li).children('a').attr('href').slice(3)
                let id = $(li).children('a').attr('href').slice(3).split('/').join('').slice(0, -9)
                console.log(id)
                await rp({
                    uri: href
                }).then(res => {
                    let dol = cheerio.load(res)
                    resolve({
                        id,
                        title: a,
                        content: dol('#vsb_content_2').text(),
                        _createTime: Date.now(),
                        time
                    })

                })
            }))


        }
        await Promise.all(promiseArr).then(res => {
            console.log(res)
            db.collection('wenuc_broadcast').add({
                data: res
            })
        })

    })
}