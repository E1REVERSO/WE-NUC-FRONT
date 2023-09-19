const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  // http://yktdsj.nuc.edu.cn:8888/html/theme/showtheme.html?themeid=898eb54e-7b9f-43cb-977d-a630f8f4a223?time=1648983147682
  const options = {
    uri: 'http://chbd61e.glddns.com:20005/permit/data_chart/queryDataChart.do',
    method: 'POST',
    form: 'chartUuid=3d0a97d25d7c4053ba3de4fd42dc3234'
  }
  const t = Date.now()
  const result = await rp(options).then(res => {
    res = JSON.parse(res)
    let data = []
    const names = res.xAxis
    const info = res.data[0]

    for (let i = 0; i < names.length; i++) data[i] = {
      name: names[i],
      info: {
        crowdedness: info[i].split('拥挤度')[1].split(',')[0],
        num: info[i].split('就餐总人数')[1]
      }
    }
    return data
  })
  db.collection('diners').where({
    time: _.lt(t - (24 * 60 * 60 * 1000))
  }).remove()

  db.collection('diners').add({
    data: {
      data: result,
      time: t
    }
  }).then(res => {
    console.log(res);
  })
}