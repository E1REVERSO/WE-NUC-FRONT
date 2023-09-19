// components/classTable/classTable.js
let table = []
const app = getApp()
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: [],
      observer: function (n, o) {
        table = n
        this.render()
      }
    },
    showWeekEnd: {
      type: Boolean,
      value: false,
      observer: function () {
        this.render()
      }
    },
    choosed: {
      type: Number,
      value: 1
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    realDate: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    render: function () {
      let weeks = this.data.choosed

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
          ['realDate.day']: new Date().Format("dd").replace("0", "") + "日"
        })
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
          } else {
            if (item.xqj > 5) flag = 1
            item['z-index'] = 20 - item.sections.length
            color[`${item.kcmc}-${item.zcd}`] = 'bg-color-none'
            item.thisWeek = false
            showTable[i].push(item)
          }
        }
      }

      const day = new Date().getDay()
      date = getDate(this.data.choosed, day == 0 ? 7 : day)
      let showWeekEnd = this.data.showWeekEnd
      let time = (parseInt(date.Format('MMdd')) >= 1001 || parseInt(date.Format('MMdd')) < 501) ? app.globalData.winterTime : app.globalData.summerTime

      this.setData({
        showTable: flag ? showTable : (showWeekEnd ? showTable : showTable.slice(0, 5)),
        showWeekEnd: flag ? true : this.data.showWeekEnd,
        color,
        calendar: flag ? calendar : (showWeekEnd ? calendar : calendar.slice(0, 5)),
        month,
        days: flag ? days : (showWeekEnd ? days : days.slice(0, 5)),
        time,
        no_class: !table.length
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
    delCoures: async function (e) {
      console.log(e.currentTarget.dataset.doc);
      await db.collection('otherSchedules').doc(e.currentTarget.dataset.doc).remove()
      this.closeMask()
      this.triggerEvent('refresh')
    }
  }
})