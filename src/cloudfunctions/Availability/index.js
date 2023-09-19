// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

const LocalZhzbUrl = 'http://119.23.242.190:4005/'
const RemoteZhzbUrl = 'http://101.43.234.77:5008/'

const LocalJwxtUrl = 'http://119.23.242.190:4006/'
const RemoteJwxtUrl = 'http://101.43.234.77:5009/'

const larkWebHook = 'https://open.feishu.cn/open-apis/bot/v2/hook/5c1985e0-f4ff-416e-af62-da9c8bae9f52'

Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    return fmt
}

let start = 0

// 云函数入口函数
exports.main = async (event, context) => {
    start = Date.now()

    const keys = ['近端Zhzb', '远端Zhzb', '近端Jwxt', '远端Jwxt']
    let tasks = [
        checkByKeyword(LocalZhzbUrl, 'localZhzb', 'nginx'),
        checkByKeyword(RemoteZhzbUrl, 'remoteZhzb', 'nginx'),
        checkByKeyword(LocalJwxtUrl, 'localJwxt', 'nginx'),
        checkByKeyword(RemoteJwxtUrl, 'remoteJwxt', 'nginx'),
    ]

    let res = await Promise.all(tasks).then(res => {
        let data = {}
        res.map(e => (data[e[0]] = {
            ping: e[1],
            availability: e[2]
        }))

        return data
    })

    let vals = Object.values(res)

    const getText = (key) => {
        const idx = keys.findIndex((e) => (e == key))
        const emojis = {
            '可用': '🟢',
            '超时': '🟡',
            '不可用': '🔴'
        }

        return `${emojis[vals[idx].availability]} ${vals[idx].availability}\n🕐 ${vals[idx].ping}ms`
    }

    if (vals.every((e) => (e.availability == '可用'))) return;
    else {
        await rp({
            url: larkWebHook,
            headers: {
                'Content-Type': 'application/json'
            },
            json: {
                "msg_type": "interactive",
                card: {
                    "elements": [{
                            "tag": "markdown",
                            "content": "We中北网络出现异常，以下为自动检测结果，请根据异常情况及时排查问题。"
                        },
                        {
                            "tag": "div",
                            "fields": [{
                                    "is_short": true,
                                    "text": {
                                        "tag": "lark_md",
                                        "content": `**近端Zhzb：**\n${getText('近端Zhzb')}`
                                    }
                                },
                                {
                                    "is_short": true,
                                    "text": {
                                        "tag": "lark_md",
                                        "content": `**远端Zhzb：**\n${getText('远端Zhzb')}`
                                    }
                                }
                            ]
                        },
                        {
                            "tag": "div",
                            "fields": [{
                                    "is_short": true,
                                    "text": {
                                        "tag": "lark_md",
                                        "content": `**近端Jwxt：**\n${getText('近端Jwxt')}`
                                    }
                                },
                                {
                                    "is_short": true,
                                    "text": {
                                        "tag": "lark_md",
                                        "content": `**远端Jwxt：**\n${getText('远端Jwxt')}`
                                    }
                                }
                            ]
                        },
                        {
                            "tag": "hr"
                        },
                        {
                            "tag": "note",
                            "elements": [{
                                "tag": "plain_text",
                                "content": "通知时间：" + new Date().Format('yyyy-MM-dd hh:mm:ss')
                            }]
                        }
                    ],
                    "header": {
                        "template": "red",
                        "title": {
                            "content": "We中北网络异常通知",
                            "tag": "plain_text"
                        }
                    }
                }
            }
        })
    }
}

const checkByKeyword = async (url, mode, keyword) => await rp({
        url,
        timeout: 8000,
    })
    .then(res => res.includes(keyword) ? [mode, Date.now() - start, '可用'] : [mode, Date.now() - start, '不可用'])
    .catch(() => [mode, Date.now() - start, '超时'])