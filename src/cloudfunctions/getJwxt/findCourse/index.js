const cloud = require('wx-server-sdk')
cloud.init()
const term = require('../term.json')
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

exports.main = async (event, context) => {
    let {
        xnm,
        xqm
    } = term
    let {
        keyword,
        current,
        pageSize
    } = event

    let promiseArr = [new Promise((resolve, reject) => {
        db.collection('wenuc_classTable').aggregate().match({
                xnm,
                xqm
            })
            .group({
                _id: {
                    kcmc: '$kcmc',
                    cdmc: '$cdmc',
                    xm: '$xm',
                    xqj: '$xqj',
                    jcs: '$jcs',
                    zcd: '$zcd',
                    zcmc: '$zcmc',
                    kcxz: '$kcxz',
                    xf: '$xf',
                    xqjmc: '$xqjmc',
                    weeks: '$weeks',
                    zxs: '$zxs',
                    sections: '$sections'
                },

            }).match(_.or({
                '_id.kcmc': db.RegExp({
                    regexp: '.*' + keyword + '.*',
                    options: 'i'
                })
            }, {
                '_id.xm': db.RegExp({
                    regexp: '.*' + keyword + '.*',
                    options: 'i'
                })
            })).project({
                _id: null,
                kcmc: '$_id.kcmc',
                cdmc: '$_id.cdmc',
                xm: '$_id.xm',
                xqj: '$_id.xqj',
                jcs: '$_id.jcs',
                zcd: '$_id.zcd',
                zcmc: '$_id.zcmc',
                kcxz: '$_id.kcxz',
                xf: '$_id.xf',
                xqjmc: '$_id.xqjmc',
                weeks: '$_id.weeks',
                zxs: '$_id.zxs',
                sections: '$_id.sections'
            }).count('c').end().then(res => {
                console.log(res)
                resolve(res.list.length ? res.list[0].c : 0)
            })
    }), new Promise((resolve, reject) => {
        db.collection('wenuc_classTable').aggregate().match({
                xnm,
                xqm
            })
            .group({
                _id: {
                    kcmc: '$kcmc',
                    cdmc: '$cdmc',
                    xm: '$xm',
                    xqj: '$xqj',
                    jcs: '$jcs',
                    zcd: '$zcd',
                    zcmc: '$zcmc',
                    kcxz: '$kcxz',
                    xf: '$xf',
                    xqjmc: '$xqjmc',
                    weeks: '$weeks',
                    zxs: '$zxs',
                    sections: '$sections'
                },
            }).match(_.or({
                '_id.kcmc': db.RegExp({
                    regexp: '.*' + keyword + '.*',
                    options: 'i'
                })
            }, {
                '_id.xm': db.RegExp({
                    regexp: '.*' + keyword + '.*',
                    options: 'i'
                })
            })).project({
                _id: null,
                kcmc: '$_id.kcmc',
                cdmc: '$_id.cdmc',
                xm: '$_id.xm',
                xqj: '$_id.xqj',
                jcs: '$_id.jcs',
                zcd: '$_id.zcd',
                zcmc: '$_id.zcmc',
                kcxz: '$_id.kcxz',
                xf: '$_id.xf',
                xqjmc: '$_id.xqjmc',
                weeks: '$_id.weeks',
                zxs: '$_id.zxs',
                sections: '$_id.sections'
            }).sort({
                kcmc: -1,
                xm: -1
            }).skip(current * pageSize).limit(pageSize)
            .end().then(res => {
                resolve(res.list)
            })
    })]

    let [count, list] = await Promise.all(promiseArr)
    return {
        code: 0,
        data: {
            list,
            count,
            current
        }
    }
}