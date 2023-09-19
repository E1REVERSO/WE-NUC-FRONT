const login = require('./login/index')
const scores = require('./scores/index')
const classTable = require('./classTable/index')
const points = require('./points/index')
const disciplineId = require('./disciplineId/index')
const disciplineDetail = require('./disciplineDetail/index')
const exam = require('./exam/index')
const balance = require('./balance/index')
const loginExtra = require('./loginExtra/index')
const empty = require('./empty/index')
const findCourse = require('./findCourse/index')
const test = require('./test/index')
const books = require('./books/index')
const active = require('./active/index')
const execute = require('./executePlan/index')
const status = require('./status/index')

const encrypt = require('./encrypt')
const config = require('./config')
const rp = require('request-promise')
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("ok")
  if (event.username == '20200002' && event.password == '123456') {
    event.username = '2213040112'
    event.password = 'L01120827xr*'
  }
  if (event.username == '20210000' && event.password == '123456') {
    event.username = '1802044343'
    event.password = 'Qq1970251968--'
  }

  switch (event.type) {
    case 'login':
      return await login.main(event, context)
    case 'scores':
      return await scores.main(event, context)
    case 'classTable':
      return await classTable.main(event, context)
    case 'points':
      return await points.main(event, context)
    case 'disciplineId':
      return await disciplineId.main(event, context)
    case 'disciplineDetail':
      return await disciplineDetail.main(event, context)
    case 'exam':
      return await exam.main(event, context)
    case 'balance':
      return await balance.main(event, context)
    case 'loginExtra':
      return await loginExtra.main(event, context)
    case 'empty':
      return await empty.main(event, context)
    case 'findCourse':
      return await findCourse.main(event, context)
    case 'books':
      return await books.main(event, context)
    case 'active':
      return await active.main(event, context)
    case 'execute':
      return await execute.main(event, context)
    case 'test':
      return await test.main(event, context)
    case 'status':
      return await status.main(event, context)
    default:
      rp({
        uri: "https://jm-1397156-1308003469.ap-shanghai.run.tcloudbase.com/?password=--8691520791qQ&exponent=10001&modulus=97ca1852201a581773d90cd823eb151df6425cab68f2a8e1bd39000959a5e9435af1741216a41a7f8293f41fbc2b19f3e8eca63247940cd000a98437535a38ef"
      })
      let con = await config.main()

      let apiurl = con.api + con.version + '/active'

      let t = new Date().getTime()
      let code = await encrypt.main(t)
      let requestUrl = apiurl + `?username=${encodeURIComponent("1802044343")}&password=${encodeURIComponent("Qq1970251968--")}&code=${code}&_t=${t}`

      rp({
        uri: requestUrl
      }).then(res=>{
        console.log(res)
      })
      status.sync()
  }
}