const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database()

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

const dateObj = new Date()
const file = dateObj.Format('yyyy/MMdd')
const timeStamp = dateObj.getTime()

exports.main = async (event, context) => {
  let brunchs = []
  try {
    const result = await cloud.openapi.ocr.printedText({
      "imgUrl": `https://img.owspace.com/Public/uploads/Download/${file}.jpg?ver=375`
    })
    console.log(result);
    brunchs = result.items

  } catch (err) {
    return err
  }

  let works_bottomY = 691

  let who_bottomY = 868
  let should_bottomY = 491
  let say_topY = 531

  let works, who, should, say = ''

  for (let i = 0; i < brunchs.length; i++) {
    let item = brunchs[i]
    if (Math.abs(item.pos.leftBottom.y - should_bottomY) < 20) {
      should = item.text
      should_bottomY = item.pos.leftBottom.y
    }

    // if (item.pos.leftBottom.y > should_bottomY && item.pos.leftBottom.x >= 200 && item.pos.leftBottom.y < 900) {
    //   say += item.text.trim()
    // }

    if (Math.abs(item.pos.leftTop.y - item.pos.leftBottom.y) < 36 && Math.abs(item.pos.leftTop.y - item.pos.leftBottom.y) > 28) {
      say += item.text.trim()
    }

    if (Math.abs(item.pos.leftBottom.y - who_bottomY) < 5) {
      who = item.text
    }

    if (item.pos.leftBottom.x < 60 && Math.abs(item.pos.leftBottom.y - item.pos.leftTop.y) < 28 && Math.abs(item.pos.leftBottom.y - item.pos.leftTop.y) > 20) {
      works = item.text
    }
  }

  console.log(works, who, should, say);
  console.log('宜忌', should);
  console.log('一言', say);
  console.log('作品', works);
  console.log('作者', who);

  db.collection('owsData').add({
    data: {
      should,
      say,
      works,
      who,
      time: timeStamp,
      file,
      origin: brunchs
    }
  })
}