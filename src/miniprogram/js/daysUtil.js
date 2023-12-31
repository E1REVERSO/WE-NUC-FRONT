/* 计算目标日与当前日期的天数差值（目标日在当前日期之前，返回值为负数），例如（当前日期：2019-11-29 ）：
targetDate：2019-10-12 --> -48 */
function daysBetween(targetDate) {
  var currentDate = formatDate(new Date())
  var currentTimestamp = new Date(currentDate).getTime();
  var targetTimestamp = new Date(targetDate).getTime();
  var currentDay = currentTimestamp / 1000 / 60 / 60 / 24;
  var targetDay = targetTimestamp / 1000 / 60 / 60 / 24;
  return Math.ceil(targetDay - currentDay)
}

// 获取某一天的星期，2019-09-12 --> 星期四
function getWeekStr(date) {
  var weeks = ["日", "一", "二", "三", "四", "五", "六"]
  var week = new Date(date).getDay()
  return "星期" + weeks[week]
}

// 实现事件置顶，返回新数组
function setTopCard(originIterms) {
  var tempCards = originIterms;
  var topCards = [];
  var normalCards = [];
  var cards = [];
  for (let item of tempCards) {
    // 置顶实现
    if (item.top === true) {
      topCards.push(item)
    } else {
      normalCards.push(item)
    }
  }
  cards = topCards.reverse().concat(normalCards);
  return cards
}


// 针对重复的倒数日时间，计算最新的目标日
// 重复间隔时间：['不重复', '每天重复', '每周重复', '每月重复', '每年重复']
function resetTargetDate(targetDate, repeat) {
  var year = parseInt(targetDate.slice(0, 4)),
    month = parseInt(targetDate.slice(5, 7)),
    day = parseInt(targetDate.slice(8, 10))
  var currentDate = new Date()
  var cYear = currentDate.getFullYear(),
    cMonth = currentDate.getMonth() + 1,
    cDay = currentDate.getDate()
  var newTargetDate = targetDate
  var betweenDays = daysBetween(targetDate)
  if (repeat != 0 && betweenDays < 0) {
    if (repeat === 1) { // 每天重复
      newTargetDate = formatDate(currentDate)
    } else if (repeat === 2) { // 每周重复
      let tempTargetDate = currentDate
      let betweenWeek = new Date(targetDate).getDay() - currentDate.getDay()
      if (betweenWeek < 0) {
        tempTargetDate.setDate(tempTargetDate.getDate() + 7 + betweenWeek)
      } else if (betweenWeek > 0) {
        tempTargetDate.setDate(tempTargetDate.getDate() + betweenWeek)
      }
      newTargetDate = formatDate(tempTargetDate)
    } else if (repeat === 3) { // 每月重复
      let tempTargetDate = currentDate
      if (cDay <= day) {
        tempTargetDate.setDate(tempTargetDate.getDate() + day - cDay)
      } else {
        tempTargetDate.setDate(day)
        tempTargetDate.setMonth(tempTargetDate.getMonth() + 1)
      }
      newTargetDate = formatDate(tempTargetDate)
    } else if (repeat === 4) { // 每年重复
      let tempTargetDate = new Date(targetDate)
      tempTargetDate.setFullYear(cYear)
      if (daysBetween(formatDate(tempTargetDate)) < 0) {
        tempTargetDate.setFullYear(cYear + 1)
      }
      newTargetDate = formatDate(tempTargetDate)
    }
  }
  return newTargetDate
}


// 输入：Wed Nov 27 2019 22:59:11 GMT+0800 (中国标准时间)
// 输出：2019-12-04
function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return (year + "-" + month + "-" + day)
}

// 输入：2019 3 5
// 输出：2019-03-05
function formatDateTemp(year, month, day) {
  month = month.toString().length === 1 ? '0' + month : month
  day = day.toString().length === 1 ? '0' + day : day
  return (year + '-' + month + '-' + day)
}


module.exports = {
  daysBetween: daysBetween,
  getWeekStr: getWeekStr,
  setTopCard: setTopCard,
  // getNumberFont: getNumberFont,
  // getBetweenDaysArray: getBetweenDaysArray,
  formatDate: formatDate,
  resetTargetDate: resetTargetDate,
  formatDateTemp: formatDateTemp,
}