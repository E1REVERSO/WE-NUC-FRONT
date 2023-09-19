// components/otherClassTable/otherClassTable.js
const app = getApp()
// const ctUtils = require('../../js/classTable.js')
let login = null
let classTable = null
let that
let cal
let getFmtDate
let currentValDoc
let init = false
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
  /**
   * 组件的属性列表
   */
  properties: {
    showWeekEnd: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this.onLoad()
      }
    },
    showNotThis: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        console.log(newVal, oldVal);
        this.onLoad()
      }
    },
    type: {
      type: String
    },
    doc: {
      type: String,
      observer: function (newVal, oldVal) {
        if (!currentValDoc) currentValDoc = newVal
        if (currentValDoc && currentValDoc == newVal) return;
        else {
          currentValDoc = newVal
          this.onLoad()
        }
      }
    },
    choosed: {
      type: Number,
      value: -1,
      observer: function (newVal, oldVal) {
        console.log(newVal, oldVal, init);
        // this.onLoad()
        console.log(classTable);
        if (classTable) {
          this.showCT(newVal, this.data.showNotThis)
        } else {
          this.onLoad()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTable:[  [],
    [],
    [],
    [],
    [],
    [],
    [],],
    show: false,
    info_data: {},
    switchActive: 0,
    columns: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
    ],
    switchShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: async function () {
      that = this
      let showNotThis = this.properties.showNotThis
      console.log(showNotThis)
      getFmtDate = app.globalData.getFmtDate
      if (this.data.type == 'important') {
        this.setData({
          doc: wx.getStorageSync('importantClassTable')
        })
      }
      if (!this.data.doc) return

      classTable = await this.getClassTable()
      cal = app.globalData.calendar
      this.setData({
        day: cal.nWeek
      })

      this.showCT(this.data.choosed, this.data.showNotThis)

      // this.setData({
      //   ...this.showCT(app.globalData.weeks)
      // })
      init = true
    },
    showCT: function (weeks = -1, showNotThis) {
      let that = this
      console.log(classTable);
      let table = classTable
      console.log(table)
      let tableWeek = []

      if (weeks == -1) {
        weeks = 1
      }

      function getDate(weeks, xq) {
        return new Date(app.globalData.termStart + (((--weeks * 60 * 60 * 24 * 7) + (--xq * 60 * 60 * 24)) * 1000))
      }

      let calendar = []
      var showTable = []
      let month = ''
      let days = ['一', '二', '三', '四', '五', '六', '日']
      let date

      for (let i = 0; i < 7; i++) {
        showTable[i] = []


        date = getDate(weeks, i + 1)
        calendar[i] = date.getDate() + "日"
        if (i == 0) {
          month = (date.getMonth() + 1).toString() + "月"
        }
      }


      let color = {}
      let colorStep = 0
      let flag = 0

      for (let k = 0; k < table.length; k++) {
        for (let i = 0; i < 7; i++) {
          let item = table[k]
          if (item.xqj - 1 != i) continue

          if (item.weeks.includes(weeks)) {
            if (item.xqj > 5) flag = 1
            color[`${item.kcmc}-${item.zcd}`] = 'bg-color-' + colorStep
            colorStep++
            // for (let l = 0; l < item.sections.length; l++) {
            // showTable[i][item.sections[l].section - 1].push(item)
            item['z-index'] = 30 - item.sections.length
            item.thisWeek = true
            showTable[i].push(item)
            // }
          }

        }
      }

      if (this.data.showNotThis) {
        for (let k = 0; k < table.length; k++) {
          for (let i = 0; i < 7; i++) {
            let item = table[k]
            if (item.xqj - 1 != i) continue

            if (!item.weeks.includes(weeks)) {
              if (item.xqj > 5) flag = 1
              // for (let l = 0; l < item.sections.length; l++) {
              // if (!showTable[i][item.sections[l].section - 1].length) {
              //   color[item.kcmc] = 'bg-color-none'
              //   showTable[i][item.sections[l].section - 1].push(item)
              // }
              item['z-index'] = 20 - item.sections.length
              color[`${item.kcmc}-${item.zcd}`] = 'bg-color-none'
              item.thisWeek = false
              // showTable[i][item.sections[l].section - 1].push(item)
              showTable[i].push(item)
              // }
            }
          }
        }
      }

      console.log(showTable);
      let showWeekEnd = that.data.showWeekEnd
      let time = (parseInt(getFmtDate(getFmtDate("MMdd", date))) >= 1001 || parseInt(getFmtDate(getFmtDate("MMdd", date))) < 201) ? app.globalData.winterTime : app.globalData.summerTime
      let is_no_class = false;
      if (showTable.toString() == normalTable.toString()) is_no_class = true
      that.setData({
        showTable: flag ? showTable : (showWeekEnd ? showTable : showTable.slice(0, 5)),
        color,
        calendar: flag ? calendar : (showWeekEnd ? calendar : calendar.slice(0, 5)),
        month,
        days: flag ? days : (showWeekEnd ? days : days.slice(0, 5)),
        time,
        no_class: is_no_class
      })
    },
    getClassTable: async () => {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      let data = await wx.cloud.callFunction({
        name: "classTable",
        data: {
          type: "getClassTable",
          doc: that.data.doc
        }
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: '出错了请重试',
          icon: 'error'
        })
      })

      wx.hideLoading()

      console.log(data);
      let res = data.result
      console.log(res);
      wx.showToast({
        title: '加载成功',
        icon: "success"
      })
      return res
    },
    chooseWeek: function (event) {
      let weeks = event.currentTarget.dataset.weeks
      this.showCT(weeks, this.data.showNotThis)
    },
    switchShow: function () {
      this.setData({
        switchShow: true
      })
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

    }
  }
})