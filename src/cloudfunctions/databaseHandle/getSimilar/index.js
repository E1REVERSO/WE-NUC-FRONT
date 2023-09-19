const cloud = require('wx-server-sdk')
const getSimilar = require('../getParamSet/index')
cloud.init()
const $ = cloud.database().command.aggregate
exports.main = async (event, context) => {
    const {
        bind_database,
        bind_param,
        search_text,
        count
    } = event
    let g = await getSimilar.main(event, context)
    let result = [...g]
    for (let i = 0; i < result.length; i++) {
        let temp = await similar(result[i]._id, search_text)
        result[i].similar = temp
    }
    result.sort(function (o1, o2) {
        if (o1.similar > o2.similar) return -1
        else return 1
    })
    result.splice(count, result.length - count)
    // console.log(c.count())
    // console.log(c.end())
    return result
}


async function similar(s, t, f) {
    if (!s || !t) {
        return 0
    }
    var l = s.length > t.length ? s.length : t.length
    var n = s.length
    var m = t.length
    var d = []
    f = f || 3
    var min = function (a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c)
    }
    var i, j, si, tj, cost
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
        d[i] = []
        d[i][0] = i
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j
    }
    for (i = 1; i <= n; i++) {
        si = s.charAt(i - 1)
        for (j = 1; j <= m; j++) {
            tj = t.charAt(j - 1)
            if (si === tj) {
                cost = 0
            } else {
                cost = 1
            }
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
        }
    }
    let res = (1 - d[n][m] / l)
    return res.toFixed(f)
}