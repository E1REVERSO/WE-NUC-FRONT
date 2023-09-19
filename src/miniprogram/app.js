//app.js
const calendar = require('js/calendar.js')
let getClassTable
let getScores

const getFmtDate = function (str = 'yyyy-MM-dd hh:mm:ss', date = new Date()) {
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
  return date.Format(str)
}

App({
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })

    }
    getClassTable = require("/js/getClassTable.js");
    getScores = require('/js/getScores.js')
    this.fromJwxt = getClassTable.fromJwxt
    this.getOthers = getClassTable.getOthers
    this.getOtherSchedules = getClassTable.getOtherSchedules
    this.getScoresFromJwxt = getScores.fromJwxt

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启应用',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

    Array.prototype.removeByVal = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };

    Array.prototype.removeByIdx = function (index) {
      this.splice(index, 1);
    };

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

    this.globalData = {
      init: false,
      version: __wxConfig.envVersion
    }
    console.log(this.globalData)
    if (!wx.getStorageSync('openid')) {
      wx.cloud.callFunction({
        name: 'login'
      }).then(res => {
        console.log(res.result.openid);
        // wx.setStorageSync('openid', res.result.openid)
        wx.setStorage({
          key: 'openid',
          data: res.result.openid
        })
      })
    }
    this.getSystemInfo()
  },
  onShow: async function () {
    // 预热
    const lo = wx.getStorageSync('login');
    if (lo) {
      console.log("开始预热了")
      let lastYr = wx.getStorageSync("warmUp")
      if ((!lastYr) || Date.now() - lastYr > 60 * 1000) {
        wx.cloud.callFunction({
          name: "getJwxt",
          data: {
            type: "active",
            ...lo
          }
        }).then(res => {
          wx.setStorage({
            key: "warmUp",
            data: Date.now()
          })
        })
      }
    }
  },
  getSystemInfo: async function () {
    let systemInfo = wx.getStorageSync('systemInfo')
    if (!systemInfo) {
      systemInfo = await wx.getSystemInfo()
      let menuButton = await wx.getMenuButtonBoundingClientRect()

      // 胶囊与状态栏之间距离
      let gap = menuButton.top - systemInfo.statusBarHeight

      // 自定义导航栏高度 = 「胶囊与状态栏之间距离」 + 「胶囊高度」 + 胶囊与状态栏之间距离」
      const navigationBarHeight = menuButton.height + (2 * gap)
      systemInfo.navigationBarHeight = navigationBarHeight

      // 包括状态栏的自定义导航栏 = 自定义导航栏高度 + 状态栏高度
      systemInfo.navigationBarHeightFull = systemInfo.statusBarHeight + navigationBarHeight
      systemInfo.capsule = menuButton

      wx.setStorageSync('systemInfo', systemInfo)
    }
    this.globalData.systemInfo = systemInfo
  },
  setData: async function () {
    const set = await wx.cloud.database().collection('wenuc_data').doc('79550af260eff55426c9c2733de27c46').get()
    const termStart = set.data.termStart
    const _weeks = wx.getStorageSync('weeks')
    const weeks = Math.ceil((new Date().getTime() - termStart) / (60 * 60 * 24 * 7 * 1000))
    let login_info = wx.getStorageSync('login')
    if (login_info && login_info.username) {
      _weeks && _weeks === weeks ? {} : this.fromJwxt(login_info.username, login_info.password, 'toast', login_info.username, "尝试更新课程表")
    }
    wx.setStorageSync('weeks', weeks)
    const summerTime = {
      '1': ['08:00', '08:45'],
      '2': ['08:55', '09:40'],
      '3': ['10:10', '10:55'],
      '4': ['11:05', '11:50'],
      '5': ['14:30', '15:15'],
      '6': ['15:25', '16:10'],
      '7': ['16:40', '17:25'],
      '8': ['17:35', '18:20'],
      '9': ['19:30', '20:15'],
      '10': ['20:25', '21:10'],
      '11': ['21:20', '22:05']
    }

    const winterTime = {
      '1': ['08:00', '08:45'],
      '2': ['08:55', '09:40'],
      '3': ['10:10', '10:55'],
      '4': ['11:05', '11:50'],
      '5': ['14:00', '14:45'],
      '6': ['14:55', '15:40'],
      '7': ['16:10', '16:55'],
      '8': ['17:05', '17:50'],
      '9': ['19:00', '19:45'],
      '10': ['19:55', '20:40'],
      '11': ['20:50', '21:35']
    }

    this.globalData.termStart = termStart
    this.globalData.weeks = weeks
    this.globalData.calendar = calendar.solar2lunar()
    this.globalData.getFmtDate = getFmtDate
    this.globalData.summerTime = summerTime
    this.globalData.winterTime = winterTime

    this.globalData.init = true
  },
})