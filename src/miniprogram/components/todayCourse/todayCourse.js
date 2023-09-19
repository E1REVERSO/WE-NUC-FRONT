// components/todayCourse/todayCourse.js
let app = getApp()
let calendar
let weeks
let login

Component({
  pageLifetimes: {
    show: function () {
      this.onLoadI()
      console.log("触发了show")
    }
  },
  lifetimes: {
    attached: function () {},
    detached: function () {},
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    firstLoad: function () {

    },
    onLoadI: async function () {
      console.log("触发了login")
      this.setData({
        login: wx.getStorageSync('login') ? true : false
      })
      if (!app.globalData.init) {
        await app.setData()
      }

      calendar = app.globalData.calendar
      weeks = app.globalData.weeks

      login = wx.getStorageSync('login')
      this.courses(weeks, calendar.nWeek)
    },
    onHide: function () {

    },
    courses: async function (weeks, day) {
      console.log("触发了course")
      let that = this
      let l = []

      let color = {}
      let colorStep = 0

      let classTable = wx.getStorageSync('classTable')
      if (!classTable) {
        this.setData({
          info: '今日课程未加载',
          infoShow: true
        })
        if (!login) return
        classTable = await this.getClassTable(1)
        console.log("触发了todaycourse,classTable")
      }
      classTable = classTable.main
      classTable = classTable.concat(await app.getOtherSchedules())

      let date = new Date()
      let time = parseInt(date.Format('MMdd')) >= 1001 || parseInt(date.Format('MMdd')) < 501 ? app.globalData.winterTime : app.globalData.summerTime

      console.log(time);

      for (let i = 0; i < classTable.length; i++) {
        if (classTable[i].weeks.indexOf(weeks) != -1 && classTable[i].xqj == day) {
          if (!color[classTable[i]['kcmc']]) {
            color[classTable[i]['kcmc']] = 'bg-color-' + colorStep
            colorStep++
          }
          classTable[i].time = `${time[classTable[i].sections[0].section][0]}-${time[classTable[i].sections[classTable[i].sections.length - 1].section][1]}`
          l.push(classTable[i])
        }
      }

      if (!l.length) {
        this.setData({
          info: '今天没有课喔～',
          infoShow: true
        })

        return
      }

      l.sort((a, b) => {
        // console.log("temp", a)
        a = a.sections
        b = b.sections
        return (a[0].section - b[0].section) ? (a[0].section - b[0].section) : ((a[a.length - 1].section - b[b.length - 1].section) ? (a[a.length - 1].section - b[b.length - 1].section) : 0)
      })

      this.setData({
        courses: l,
        color,
        infoShow: false
      })
    },
    getClassTable: async function (times) {
      if (times > 1) {
        wx.showToast({
          title: '尝试次数过多',
          icon: 'error'
        })
        return
      }


      // wx.showLoading({
      //   title: '加载中',
      //   mask: true
      // })

      this.setData({
        info: '课程加载中',
        infoShow: true,
        loading: true
      })

      let data = await wx.cloud.callFunction({
        name: "getJwxt",
        data: {
          type: "classTable",
          ...login
        }
      }).catch(e => {
        console.log("触发了todaycourse data")
        // wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.showToast({
          title: '获取课程表失败',
        })
        return;
      })

      this.setData({
        loading: false
      })

      // wx.hideLoading()

      console.log(data);
      let res = data.result
      console.log(res.data);
      switch (res.code) {
        case 1:
          wx.setStorageSync('classTable', res.data)
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
    },
    toLogin: function () {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  }
})