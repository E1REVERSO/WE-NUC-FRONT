let weekStr2IntList = function (week) {
  // 将全角逗号替换为半角逗号
  let reg = new RegExp("，", "g");
  week.replace(reg, ',');
  let weeks = [];

  // 以逗号为界分割字符串，遍历分割的字符串
  week.split(",").forEach(w => {
    if (w.search('-') != -1) {
      let range = w.split("-");
      let start = parseInt(range[0]);
      let end = parseInt(range[1]);
      for (let i = start; i <= end; i++) {
        if (!weeks.includes(i)) {
          weeks.push(i);
        }
      }
    } else if (w.length != 0) {
      let v = parseInt(w);
      if (!weeks.includes(v)) {
        weeks.push(v);
      }
    }
  });
  return weeks;
}

let getSections = function (str) {
  let start = parseInt(str.split('-')[0])
  let end = parseInt(str.split('-')[1])
  let sections = []
  for (let i = start; i <= end; i++) {
    sections.push({
      section: i
    })
  }
  return sections
}

function _getWeeks(str) {
  let flag = 0
  if (str.search('单') != -1) {
    flag = 1
    str = str.replace('单', '')
  } else if (str.search('双') != -1) {
    flag = 2
    str = str.replace('双', '')
  }
  let weeks = weekStr2IntList(str)
  weeks = weeks.filter((v) => {
    if (flag === 1) {
      return v % 2 === 1
    } else if (flag === 2) {
      return v % 2 === 0
    }
    return v
  })
  return weeks
}

function getWeeks(str) {
  let list = str.split(',')
  let result = []

  for (let i = 0; i < list.length; i++) {
    let _res = _getWeeks(list[i])
    for (let j = 0; j < _res.length; j++) {
      result.includes(_res[j]) ? {} : result.push(_res[j])
    }
  }
  result.sort((a, b) => a - b)
  return result
}

module.exports = {
  getWeeks,
  getSections
}