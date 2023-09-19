// components/ownClassTable/ownClassTable.js
const app = getApp()
const db = wx.cloud.database()
let login = null
let classTable = null
let that
let cal
let extraTable = {}
let getFmtDate
// let extraGetting = false
// let getting = false
let normalTable = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
]
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

Component({
  // pageLifetimes: {
  //   show: function () {
  //     console.log("show")
  //     // this.show()
  //     // this.onLoad()
  //   },
  // },
  /**
   * 组件的属性列表
   */
  properties: {
    showWeekEnd: {
      type: Boolean,
      value: false,
      // observer: function (newVal, oldVal) {
      //   this.onLoad()
      // }
    },
    showNotThis: {
      type: Boolean,
      value: true,
      // observer: function (newVal, oldVal) {
      //   this.onLoad()
      // }
    },
    choosed: {
      type: Number,
      value: -1,
      // observer: function (newVal, oldVal) {
      //   this.onLoad()
      // }
    },
    extra: {
      type: Array,
      value: [],
      // observer: function (newVal, oldVal) {
      //   this.onLoad()
      // }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    no_class: false,
    show: false,
    info_data: {},
    switchActive: 0,
    columns: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
    ],
    showTable: [
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ],
    switchShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: async function () {
      extraGetting = false
      getting = false

      that = this
      if (!app.globalData.init) {
        await app.setData()
      }
      let showNotThis = this.data.showNotThis
      getFmtDate = app.globalData.getFmtDate
      console.log(showNotThis)
      cal = app.globalData.calendar
      console.log(cal);
      this.setData({
        day: cal.nWeek
      })
      login = wx.getStorageSync('login')
      if (!login) {
        wx.showToast({
          title: '请登陆后使用',
        })
        return
      }
      this.setData({
        realDate: {
          month: new Date().Format("MM") + "月",
          day: new Date().Format("dd") + "日"
        }
      })
      if (this.data.realDate.month.startsWith("0")) {
        this.setData({
          ['realDate.month']: new Date().Format("MM").replace("0", "") + "月"
        })
      }

      if (this.data.realDate.day.startsWith("0")) {
        this.setData({
          ['realDate.day']: new Date().Format("dd").replace("0", "") + "月"
        })
      }
      console.log(this.data.realDate)
      classTable = wx.getStorageSync('classTable')
      console.log(classTable)
      if (!classTable) classTable = await this.getClassTable()

      extraTable = {
        ...{
          minor: [],
          main: []
        }
      }
      console.log(extraTable)
      for (let i = 0; i < this.data.extra.length; i++) {
        let item = wx.getStorageSync(`extraTable_${this.data.extra[i]}`)
        if (!item) item = await this.getExtraClassTable(this.data.extra[i])
        console.log(i, item);
        extraTable.minor = extraTable.minor.concat(item.minor)
        extraTable.main = extraTable.main.concat(item.main)
      }

      this.showCT(this.data.choosed, this.data.showNotThis)
    },
    onClickItem: function (e) {
      this.setData({
        closeMaskT: false
      })
      let that = this

      that.setData({
        info_data: e.currentTarget.dataset.data,
        show: true
      })
    },
    showCT: async function (weeks = -1) {
      let table = classTable.main.concat(extraTable.main)

      try {
        let otherSchedules = await this.getOthers()
        console.log(otherSchedules);
        table = table.concat(otherSchedules)
      } catch (error) {
        console.log(error);
      }

      if (weeks == -1) {
        weeks = 1
      }


    },
    getOthers: async function () {
      return await db.collection('otherSchedules').count().then(res => {
        let total = res.total
        let batch = Math.ceil(total / 20)
        return batch
      }).then(async res => {
        if (!res) return []
        let data = []
        for (let i = 0; i < res; i++) {
          await db.collection('otherSchedules').limit(20).skip(i * 20).get()
            .then(res => {
              data = data.concat(res.data)
            })
        }
        return data
      })
    },
    getClassTable: async () => {
      if (getting) return {}
      getting = true
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      let data = await wx.cloud.callFunction({
        name: "getJwxt",
        data: {
          type: "classTable",
          ...login
        }
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: '出错了请重试',
          icon: 'error'
        })
      })

      wx.hideLoading()

      let res = data.result
      switch (res.code) {
        case 1:
          wx.setStorageSync('classTable', res.data)
          wx.showToast({
            title: '加载成功',
            icon: "success"
          })
          return res.data
          break
        case -1:
          wx.removeStorageSync('login')
        default:
          wx.showToast({
            duration: 1500,
            icon: 'none',
            title: res.msg
          })
          return {}
      }
      getting = false
    },
    getExtraClassTable: async function (username) {
      if (extraGetting) return {
        minor: [],
        main: []
      }
      extraGetting = true
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      let accounts = wx.getStorageSync('extraAccounts')
      let account = {}
      for (let i = 0; i < accounts.length; i++) {
        console.log(accounts[i].data.username, username);
        if (accounts[i].data.username == username) {
          account = {
            username: accounts[i].username,
            password: accounts[i].password
          }
        }
      }
      console.log(account);
      let data = await wx.cloud.callFunction({
        name: "getJwxt",
        data: {
          type: "classTable",
          ...account
        }
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: '出错了请重试',
          icon: 'error'
        })
      })

      wx.hideLoading()
      extraGetting = false
      let res = data.result
      switch (res.code) {
        case 1:
          wx.setStorageSync(`extraTable_${username}`, res.data)
          wx.showToast({
            title: '加载成功',
            icon: "success"
          })
          return res.data
          break
        case -1:
          wx.showModal({
            title: '温馨提示',
            content: `额外账户「${username}」密码错误，请重新登陆`
          })
          return {
            minor: [], main: []
          }
          break;
        default:
          wx.showModal({
            title: `额外账户「${username}」`,
            content: res.msg,
            confirmText: '重试'
          }).then(res => {
            if (res.confirm) this.onLoad()
          })
          return {
            minor: [], main: []
          }
      }
    },
    chooseWeek: function (event) {
      let weeks = event.currentTarget.dataset.weeks
      this.showCT(weeks)
    },
    switchShow: function () {
      this.setData({
        switchShow: true
      })
    },
    onClose: function () {
      this.setData({
        switchShow: false
      })
    },
    closeMask: function () {
      this.setData({
        closeMaskT: true
      })
      setTimeout(() => {
        this.setData({
          show: false
        })
      }, 240)
    },
    delCoures: function (e) {
      console.log(e.currentTarget.dataset.doc);
      db.collection('otherSchedules').doc(e.currentTarget.dataset.doc).remove().then(res => {
        console.log(res);
        this.setData({
          show: false
        })
        this.onLoad()
      })
    }
  }
})