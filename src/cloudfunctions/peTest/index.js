// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
var crypto = require('crypto');
cloud.init()
const calculator = require('./calculator');



// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'calc':
      return getAll(event)
    case 'query':
      return await getReal(event)
    default:
      rp({
        uri: encodeURI(`https://tygl-1094259-1306502030.ap-shanghai.run.tcloudbase.com/`)
      })
  }
}
async function getReal(event) {
  let t = Date.now()
  let account = [...event.account].reverse().join('')

  var h = crypto.createHash('md5');

  h.update(t + account + event.password)
  var ret = h.digest('hex')
  let data = await rp({
    uri: `https://tygl-1094259-1306502030.ap-shanghai.run.tcloudbase.com/get?t=${t}&account=${event.account}&password=${event.password}&key=${ret}`
  })
  return JSON.parse(data)
}

function getAll(event) {
  console.log(event)
  let {
    name,
    gender,
    height,
    weight,
    lung,
    zwtqq,
    jump,
    run50,
    run00,
    ytxs,
    grade
  } = event

  height = height ? height : 0
  weight = weight ? weight : 0
  lung = lung ? lung : 0
  zwtqq = zwtqq ? zwtqq : 0
  jump = jump ? jump : 0
  run50 = run50 ? run50 : 0
  run00 = run00 ? run00 : 0
  ytxs = ytxs ? ytxs : 0

  gender = gender == '男' ? 'male' : 'female'
  console.log(gender, (() => {
    switch (grade) {
      case '大一':
        return 'freshman'
      case '大二':
        return 'sophomore'
      case '大三':
        return 'junior'
      case '大四':
        return 'senior'
    }
  })(), {
    weight,
    height,
    vitalCapacity: lung,
    sitAndReach: zwtqq,
    standingLongJump: jump,
    race50m: run50,
    pullUp: ytxs,
    race1000m: Math.floor(run00) * 60 + (run00 - Math.floor(run00)) * 100,
    sitUp: ytxs,
    race800m: run00
  });
  return calculator(gender, (() => {
    switch (grade) {
      case '大一':
        return 'freshman'
      case '大二':
        return 'sophomore'
      case '大三':
        return 'junior'
      case '大四':
        return 'senior'
    }
  })(), {
    weight,
    height,
    vital_capacity: lung,
    sit_and_reach: zwtqq,
    standing_long_jump: jump,
    race_50m: run50,
    pull_up: ytxs,
    race_1000m: Math.floor(run00) * 60 + (run00 - Math.floor(run00)) * 100,
    sit_up: ytxs,
    race_800m: run00
  });
  console.log(result)
  console.log("50", getRun50(gender, grade, run50), getRun50(gender, grade, run50) * 0.2);
  console.log("1000", getRun(gender, grade, run00), getRun(gender, grade, run00) * 0.2);
  console.log("jump", getJump(gender, grade, jump), getJump(gender, grade, jump) * 0.1);
  console.log("zwtqq", getSit(gender, grade, zwtqq), getSit(gender, grade, zwtqq) * 0.1);
  console.log("lung", getLung(gender, grade, lung), getLung(gender, grade, lung) * 0.15);
  console.log("bmi", getBMI(gender, height, weight), getBMI(gender, height, weight) * 0.15);





  console.log((gender == "男" ? getPull(gender, grade, ytxs).toFixed(2) * 0.1 : getabdominal(gender, grade, ytxs).toFixed(2) * 0.1));
  // let result = getBMI(gender, height, weight) * 0.15 + getLung(gender, grade, lung) * 0.15 + getSit(gender, grade, zwtqq) * 0.1 + getJump(gender, grade, jump) * 0.1 + getRun50(gender, grade, run50) * 0.2 + getRun(gender, grade, run00) * 0.2 + (gender == "男" ? getPull(gender, grade, ytxs).toFixed(2) * 0.1 : getabdominal(gender, grade, ytxs).toFixed(2) * 0.1)
  // let xs = result - Math.floor(result)
  // if(xs < 0.5)return Math.floor(result)
  // else return Math.ceil(result)
  return Math.floor()
}


function getBMI(sex, height, weight) {
  if (!height || !weight) return 0
  value = weight / Math.pow((height / 100), 2)
  if (sex == "男") {
    if (value > 17.9 && value < 23.9)
      return 100;
    if (value <= 17.9 && value > 24.0 && value < 27.9)
      return 80;
    else
      return 60;
  }
  if (sex == "女") {
    if (value > 17.2 && value < 23.9)
      return 100;
    if (value <= 17.1 && value > 24.0 && value < 27.9)
      return 80;
    else
      return 60;
  }

}

function getLung(sex, grade, value) {
  if (!value) return 0
  if (sex == "男" && (grade == "大一" || grade == "大二")) {
    if (value < 2300) return 0;
    if (value < 3220) return 10 + 10 * Math.floor((value - 2300) / 160);
    if (value < 4550) return 60 + 2 * Math.floor((value - 3100) / 120);
    if (value < 4920) return 80 + 5 * Math.floor((value - 4300) / 250);
    if (value >= 4920 && value < 5040)
      return 95;
    if (value >= 5040)
      return 100;
  }
  if (sex == "男" && (grade == "大三" || grade == "大四")) {
    if (value < 2350) return 0;
    if (value < 3320) return 10 + 10 * Math.floor((value - 2350) / 170);
    if (value < 4650) return 60 + 2 * Math.floor((value - 3200) / 120);
    if (value < 5020) return 80 + 5 * Math.floor((value - 4400) / 250);
    if (value >= 5020 && value < 5140)
      return 95;
    if (value >= 5140)
      return 100;
  }
  if (sex == "女" && (grade == "大一" || grade == "大二")) {
    if (value < 1800) return 0;
    if (value < 2100) return 10 + 10 * Math.floor((value - 1800) / 40);
    if (value < 3150) return 60 + 2 * Math.floor((value - 2000) / 100);
    if (value < 3350) return 80 + 5 * Math.floor((value - 3000) / 150);
    if (value >= 3350 && value < 3400)
      return 95;
    if (value >= 3400)
      return 100;
  }
  if (sex == "女" && (grade == "大三" || grade == "大四")) {
    if (value < 1850) return 0;
    if (value < 2150) return 10 + 10 * Math.floor((value - 1850) / 40);
    if (value < 3200) return 60 + 2 * Math.floor((value - 2050) / 100);
    if (value < 3400) return 80 + 5 * Math.floor((value - 3050) / 150);
    if (value >= 3400 && value < 3450)
      return 95;
    if (value >= 3450)
      return 100;
  }
}

function getSit(sex, grade, value) {
  if (!value) return 0
  if (sex == "男" && (grade == "大一" || grade == "大二")) {
    if (value < -1.3) return 0;
    if (value >= -1.3 && value < -0.3)
      return 10;
    if (value >= -0.3 && value < 0.7)
      return 20;
    if (value < 5.1) return 30 + 10 * Math.floor((value - 0.7).toFixed(2) / 1);
    if (value < 19.5) return 60 + 2 * Math.floor((value - 3.7).toFixed(2) / 1.4);
    if (value < 23.1) return 80 + 5 * Math.floor((value - 17.7).toFixed(2) / 1.8);
    if (value >= 23.1 && value < 24.9)
      return 95;
    if (value >= 24.9)
      return 100;
  }
  if (sex == "男" && (grade == "大三" || grade == "大四")) {
    if (value < -0.8) return 0;
    if (value >= -0.8 && value < 0.2)
      return 10;
    if (value < 5.6) return 20 + 10 * Math.floor((value - 0.2).toFixed(2) / 0.6);
    if (value < 19.9) return 60 + 2 * Math.floor((value - 4.2).toFixed(2) / 1.4);
    if (value < 23.3) return 80 + 5 * Math.floor((value - 18.2).toFixed(2) / 1.6);
    if (value >= 23.3 && value < 25.1)
      return 95;
    if (value >= 25.1)
      return 100;
  }
  if (sex == "女" && (grade == "大一" || grade == "大二")) {
    if (value < 2.0) return 0;
    if (value < 7.3) return 10 + 10 * Math.floor((value - 2.0).toFixed(2) / 0.8);
    if (value < 20.6) return 60 + 2 * Math.floor((value - 6.0).toFixed(2) / 1.3);
    if (value < 24.0) return 80 + 5 * Math.floor((value - 19.0).toFixed(2) / 1.6);
    if (value >= 24.0 && value < 25.8)
      return 95;
    if (value >= 25.8)
      return 100;
  }
  if (sex == "女" && (grade == "大三" || grade == "大四")) {
    if (value < 2.5) return 0;
    if (value < 7.8) return 10 + 10 * Math.floor((value - 2.5).toFixed(2) / 0.8);
    if (value < 21.0) return 60 + 2 * Math.floor((value - 6.5).toFixed(2) / 1.3);
    if (value < 24.4) return 80 + 5 * Math.floor((value - 19.5).toFixed(2) / 1.5);
    if (value >= 24.4 && value < 26.3)
      return 95;
    if (value >= 26.3)
      return 100;
  }
}

function getJump(sex, grade, value) {
  if (!value) return 0
  if (sex == "男" && (grade == "大一" || grade == "大二")) {
    if (value < 183) return 0;
    if (value < 212) return 10 + 10 * Math.floor((value - 183).toFixed(2) / 5).toFixed(2);
    if (value < 256) return (60 + 2 * Math.floor((value - 208).toFixed(2) / 4).toFixed(2)) >= 80 ? 80 : (60 + 2 * Math.floor((value - 208).toFixed(2) / 4).toFixed(2));
    if (value < 268) return 80 + 5 * Math.floor((value - 248).toFixed(2) / 7).toFixed(2);
    if (value >= 268 && value < 273)
      return 95;
    if (value >= 273)
      return 100;
  }
  if (sex == "男" && (grade == "大三" || grade == "大四")) {
    if (value < 185) return 0;
    if (value < 214) return 10 + 10 * Math.floor((value - 185).toFixed(2) / 5).toFixed(2);
    if (value < 258) return 60 + 2 * Math.floor((value - 210).toFixed(2) / 4).toFixed(2);
    if (value >= 258 && value < 265)
      return 85;
    if (value >= 265 && value < 270)
      return 90;
    if (value >= 270 && value < 275)
      return 95;
    if (value >= 275)
      return 100;
  }
  if (sex == "女" && (grade == "大一" || grade == "大二")) {
    if (value < 126) return 0;
    if (value < 154) return 10 + 10 * Math.floor((value - 126).toFixed(2) / 5).toFixed(2);
    if (value < 188) return 60 + 2 * Math.floor((value - 151).toFixed(2) / 3).toFixed(2);
    if (value < 201) return 80 + 5 * Math.floor((value - 181).toFixed(2) / 7).toFixed(2);
    if (value >= 201 && value < 207)
      return 95;
    if (value >= 207)
      return 100;
  }
  if (sex == "女" && (grade == "大三" || grade == "大四")) {
    if (value < 127) return 0;
    if (value < 155) return 10 + 10 * Math.floor((value - 127).toFixed(2) / 5).toFixed(2);
    if (value < 189) return 60 + 2 * Math.floor((value - 152).toFixed(2) / 3).toFixed(2);
    if (value < 202) return 80 + 5 * Math.floor((value - 182).toFixed(2) / 7).toFixed(2);
    if (value >= 202 && value < 208)
      return 95;
    if (value >= 208)
      return 100;
  }
}

function getSit(sex, grade, value) {
  if (!value) return 0
  if (sex == "男" && (grade == "大一" || grade == "大二")) {
    if (value < -1.3) return 0;
    if (value >= -1.3 && value < -0.3)
      return 10;
    if (value >= -0.3 && value < 0.7)
      return 20;
    if (value < 5.1) return 30 + 10 * Math.floor((value - 0.7).toFixed(2) / 1);
    if (value < 19.5) return 60 + 2 * Math.floor((value - 3.7).toFixed(2) / 1.4);
    if (value < 23.1) return 80 + 5 * Math.floor((value - 17.7).toFixed(2) / 1.8);
    if (value >= 23.1 && value < 24.9)
      return 95;
    if (value >= 24.9)
      return 100;
  }
  if (sex == "男" && (grade == "大三" || grade == "大四")) {
    if (value < -0.8) return 0;
    if (value >= -0.8 && value < 0.2)
      return 10;
    if (value < 5.6) return 20 + 10 * Math.floor((value - 0.2).toFixed(2) / 0.6);
    if (value < 19.9) return 60 + 2 * Math.floor((value - 4.2).toFixed(2) / 1.4);
    if (value < 23.3) return 80 + 5 * Math.floor((value - 18.2).toFixed(2) / 1.6);
    if (value >= 23.3 && value < 25.1)
      return 95;
    if (value >= 25.1)
      return 100;
  }
  if (sex == "女" && (grade == "大一" || grade == "大二")) {
    if (value < 2.0) return 0;
    if (value < 7.3) return 10 + 10 * Math.floor((value - 2.0).toFixed(2) / 0.8);
    if (value < 20.6) return 60 + 2 * Math.floor((value - 6.0).toFixed(2) / 1.3);
    if (value < 24.0) return 80 + 5 * Math.floor((value - 19.0).toFixed(2) / 1.6);
    if (value >= 24.0 && value < 25.8)
      return 95;
    if (value >= 25.8)
      return 100;
  }
  if (sex == "女" && (grade == "大三" || grade == "大四")) {
    if (value < 2.5) return 0;
    if (value < 7.8) return 10 + 10 * Math.floor((value - 2.5).toFixed(2) / 0.8);
    if (value < 21.0) return 60 + 2 * Math.floor((value - 6.5).toFixed(2) / 1.3);
    if (value < 24.4) return 80 + 5 * Math.floor((value - 19.5).toFixed(2) / 1.5);
    if (value >= 24.4 && value < 26.3)
      return 95;
    if (value >= 26.3)
      return 100;
  }
}

function getRun50(sex, grade, value) {
  if (!value) return 0
  if (sex == "男" && (grade == "大一" || grade == "大二")) {
    if (value > 10.1) return 0;
    if (value > 8.9) return 60 - 10 * Math.ceil(((value - 9.1).toFixed(2)) / 0.2).toFixed(2);
    if (value > 7.0) return 80 - 2 * Math.ceil(((value - 7.1).toFixed(2)) / 0.2).toFixed(2);
    if (value > 6.8) return 90 - 5 * Math.ceil(((value - 6.9).toFixed(2)) / 0.1).toFixed(2);
    if (value > 6.7 && value <= 6.8)
      return 95;
    if (value <= 6.7)
      return 100;
  }
  if (sex == "男" && (grade == "大三" || grade == "大四")) {
    if (value > 10.0) return 0;
    if (value > 8.8) return 60 - 10 * Math.ceil((value - 9.0).toFixed(2) / 0.2).toFixed(2);
    if (value > 6.9) return 80 - 2 * Math.ceil((value - 7.0).toFixed(2) / 0.2).toFixed(2);
    if (value > 6.7) return 90 - 5 * Math.ceil((value - 6.8).toFixed(2) / 0.1).toFixed(2);
    if (value > 6.6 && value <= 6.7)
      return 95;
    if (value <= 6.6)
      return 100;
  }
  if (sex == "女" && (grade == "大一" || grade == "大二")) {
    if (value > 11.3) return 0;
    if (value > 10.1) return 60 - 10 * Math.ceil((value - 10.3).toFixed(2) / 0.2).toFixed(2);
    if (value > 8.0) return (80 - 2 * Math.ceil((value - 8.3).toFixed(2) / 0.2).toFixed(2)) >= 80 ? 80 : (80 - 2 * Math.ceil((value - 8.3).toFixed(2) / 0.2).toFixed(2));
    if (value > 7.6) return 90 - 5 * Math.ceil((value - 7.7).toFixed(2) / 0.3).toFixed(2);
    if (value > 7.5 && value <= 9.6)
      return 95;
    if (value <= 7.5)
      return 100;
  }
  if (sex == "女" && (grade == "大三" || grade == "大四")) {
    if (value > 11.2) return 0;
    if (value > 10.0) return 60 - 10 * Math.ceil((value - 10.2).toFixed(2) / 0.2).toFixed(2);
    if (value > 7.9) return (80 - 2 * Math.ceil((value - 8.2).toFixed(2) / 0.2).toFixed(2)) > 80 ? 80 : (80 - 2 * Math.ceil((value - 8.2).toFixed(2) / 0.2).toFixed(2));
    if (value > 7.5) return 90 - 5 * Math.ceil((value - 7.6).toFixed(2) / 0.3).toFixed(2);
    if (value > 7.4 && value <= 7.5)
      return 95;
    if (value <= 7.4)
      return 100;
  }
}

function getRun(sex, grade, value) {
  if (!value) return 0
  //value传入分钟 需要换算成秒
  value = Math.floor(value) * 60 + (value - Math.floor(value)).toFixed(2) * 100
  if (sex == "男" && (grade == "大一" || grade == "大二")) {
    if (value > 372) return 0;
    if (value > 267) return 60 - 10 * Math.ceil((value - 272).toFixed(2) / 20).toFixed(2);
    if (value > 214) return (80 - 2 * Math.ceil((value - 222).toFixed(2) / 5).toFixed(2)) > 80 ? 80 : (80 - 2 * Math.ceil((value - 222).toFixed(2) / 5).toFixed(2));
    if (value > 207 && value <= 214)
      return 85;
    if (value > 202 && value <= 207)
      return 90;
    if (value >= 197) return 100 - 5 * Math.ceil((value - 197).toFixed(2) / 5).toFixed(2);
    if (value < 197) return 100 - 1 * Math.ceil((value - 197).toFixed(2) / 4).toFixed(2);
  }
  if (sex == "男" && (grade == "大三" || grade == "大四")) {
    if (value > 370) return 0;
    if (value > 265) return 60 - 10 * Math.ceil((value - 270).toFixed(2) / 20).toFixed(2);
    if (value > 212) return (80 - 2 * Math.ceil((value - 220).toFixed(2) / 5).toFixed(2)) > 80 ? 80 : (80 - 2 * Math.ceil((value - 220).toFixed(2) / 5).toFixed(2));
    if (value > 205 && value <= 212)
      return 85;
    if (value > 200 && value <= 205)
      return 90;
    if (value >= 195) return 100 - 5 * Math.ceil((value - 195).toFixed(2) / 5).toFixed(2);
    if (value < 195) return 100 - 1 * Math.ceil((value - 195).toFixed(2) / 4).toFixed(2);
  }
  if (sex == "女" && (grade == "大一" || grade == "大二")) {
    if (value > 324) return 0;
    if (value > 269) return 60 - 10 * Math.ceil((value - 274).toFixed(2) / 10).toFixed(2);
    if (value > 217) return (80 - 2 * Math.ceil((value - 224).toFixed(2) / 5).toFixed(2)) > 80 ? 80 : (80 - 2 * Math.ceil((value - 224).toFixed(2) / 5).toFixed(2));
    if (value > 204) return 90 - 5 * Math.ceil((value - 210).toFixed(2) / 7).toFixed(2);
    if (value >= 198) return 100 - 5 * Math.ceil((value - 198).toFixed(2) / 6).toFixed(2);
    if (value < 198) return 100 - 1 * Math.ceil((value - 198).toFixed(2) / 5).toFixed(2);
  }
  if (sex == "女" && (grade == "大三" || grade == "大四")) {
    if (value > 322) return 0;
    if (value > 267) return 60 - 10 * Math.ceil((value - 272).toFixed(2) / 10).toFixed(2);
    if (value > 215) return (80 - 2 * Math.ceil((value - 222).toFixed(2) / 5).toFixed(2)) > 80 ? 80 : (80 - 2 * Math.ceil((value - 222).toFixed(2) / 5).toFixed(2));
    if (value > 202) return 90 - 5 * Math.ceil((value - 208).toFixed(2) / 7).toFixed(2);
    if (value >= 196) return 100 - 5 * Math.ceil((value - 196).toFixed(2) / 6).toFixed(2);
    if (value < 198) return 100 - 1 * Math.ceil((value - 196).toFixed(2) / 5).toFixed(2);
  }
}

//仰卧起坐
function getabdominal(sex, grade, value) {
  if (!value) return 0
  if (sex == "女" && (grade == "大一" || grade == "大二")) {
    if (value < 16) return 0;
    if (value < 28) return 10 + 10 * Math.floor((value - 16) / 2).toFixed(2);
    if (value < 49) return 60 + 2 * Math.floor((value - 26) / 2).toFixed(2);
    if (value < 54) return 80 + 5 * Math.floor((value - 46) / 3).toFixed(2);
    if (value <= 56) return 90 + 5 * Math.floor((value - 52) / 2).toFixed(2);
    if (value >= 56) return 100 + 1 * Math.floor((value - 56) / 2).toFixed(2);
  }
  if (sex == "女" && (grade == "大三" || grade == "大四")) {
    if (value < 17) return 0;
    if (value < 29) return 10 + 10 * Math.floor((value - 17) / 2).toFixed(2);
    if (value < 50) return 60 + 2 * Math.floor((value - 27) / 2).toFixed(2);
    if (value < 55) return 80 + 5 * Math.floor((value - 47) / 3).toFixed(2);
    if (value <= 57) return 90 + 5 * Math.floor((value - 53) / 2).toFixed(2);
    if (value >= 57) return 100 + 1 * Math.floor((value - 57) / 2).toFixed(2);
  }
}

// 引体向上
function getPull(sex, grade, value) {
  if (!value) return 0
  if (sex == "男" && (grade == "大一" || grade == "大二")) {
    if (value < 5) return 0;
    if (value < 11) return 10 + 10 * Math.floor(value - 5).toFixed(2);
    if (value < 16) return 60 + 4 * Math.floor(value - 10).toFixed(2);
    if (value < 18) return 80 + 5 * Math.floor(value - 15).toFixed(2);
    if (value <= 19) return 90 + 5 * Math.floor(value - 17).toFixed(2);
    if (value >= 19) return 100 + 1 * Math.floor(value - 19).toFixed(2);
  }
  if (sex == "男" && (grade == "大三" || grade == "大四")) {
    if (value < 6) return 0;
    if (value < 12) return 10 + 10 * Math.floor(value - 6).toFixed(2);
    if (value < 17) return 60 + 4 * Math.floor(value - 11).toFixed(2);
    if (value < 19) return 80 + 5 * Math.floor(value - 16).toFixed(2);
    if (value <= 20) return 90 + 5 * Math.floor(value - 18).toFixed(2);
    if (value >= 20) return 100 + 1 * Math.floor(value - 20).toFixed(2);
  }
}