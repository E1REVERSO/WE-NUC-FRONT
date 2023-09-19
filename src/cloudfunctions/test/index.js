// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("开始统计...")
  let allcounts = await db.collection('userinfo').count()
  console.log(`登录过总共用户数：${allcounts.total}人`)
  let validcounts = await db.collection('userinfo').aggregate().project({
    phone: 1,
    username: 1,
    name: 1,
    academy: 1,
    grade: 1,
    class: 1,
    high_school: 1
  }).match(_.or({
    high_school: _.exists(true)
  }, {
    phone: _.exists(true)
  })).count('total').end()
  console.log(validcounts)
  console.log(`其中有效用户数：${validcounts.list[0].total}人`)
  let grade_groups = await db.collection('userinfo').aggregate().project({
      phone: 1,
      username: 1,
      name: 1,
      academy: 1,
      grade: 1,
      class: 1,
      high_school: 1
    }).match(_.or({
      high_school: _.exists(true)
    }, {
      phone: _.exists(true)
    }))
    .group({
      "_id": "$grade",
      sum: $.sum(1)
    })
    .end()
    grade_groups.list[3].sum -= 500;
    grade_groups.list[4].sum += 500
  console.log(grade_groups)
  let academy_group = await db.collection('userinfo').aggregate().project({
      phone: 1,
      username: 1,
      name: 1,
      academy: 1,
      grade: 1,
      class: 1,
      high_school: 1
    }).match(_.or({
      high_school: _.exists(true)
    }, {
      phone: _.exists(true)
    }))
    .group({
      "_id": "$academy",
      sum: $.sum(1)
    })
    .end()
    const num1 = academy_group.list[11].sum
    delete academy_group.list[11]
    const num2 = academy_group.list[17].sum
    delete academy_group.list[17]
    academy_group.list[16].sum += num1+num2
  console.log(academy_group.list)
  // .project({
  //   grade: $.substr(["$userid", 0, 2])
  // }).end().then(res => {
  //   console.log(res)
  // })


}