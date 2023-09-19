// components/days/days.js
const util = require('../../js/daysUtil.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: "block"
    },
    days: {
      type: Object,
      observer: function (newVal, oldVal) {
        if (newVal != null) {
          console.log(newVal, oldVal);
          let days = newVal

          for (let i = 0; i < days.length; i++) {
            days[i].realdate = util.resetTargetDate(days[i].date, parseInt(days[i].repeat))
            days[i].days = util.daysBetween(days[i].realdate)
            days[i].week = util.getWeekStr(days[i].realdate)
          }

          days.sort(function (a, b) {
            let right_a = a.days
            let right_b = b.days
            if (a.top || b.top) {
              if (a.top && !b.top) return -1
              else if (!a.top && b.top) return 1
              else if (a.days * b.days > 0) {
                if (a.days < 0) return (a.days - b.days) * (a.days * b.days) < 0 ? (a.days * b.days) : -(a.days * b.days)
                else return (a.days - b.days) * (a.days * b.days) < 0 ? -(a.days * b.days) : (a.days * b.days)

              }

            } else {
              if (a.days * b.days < 0) {
                return (a.days * b.days) * (a.days - b.days) < 0 ? -1 : 1

              } else if (a.days * b.days > 0) {
                if (a.days < 0) return a.days - b.days < 0 ? 1 : -1
                else return a.days - b.days < 0 ? -1 : 1
              } else {
                if (a > b) return (a + b) < 0 ? -1 : 1
                else if (a < b) return (a + b) < 0 ? -1 : 1
                // else return 0
              }
            }

            if (a.days < 0) right_a = 9999 * (-a.days)
            if (b.days < 0) right_b = 9999 * (-b.days)
            if (a.days == 0) right_a = -999
            if (b.days == 0) right_b = -999
            if (a.top) right_a -= 9999
            if (b.top) right_b -= 9999
            console.log(right_a, right_b);

            return right_a - right_b
          })

          this.setData({
            days
          })

        }
      }

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    newDay: {
      "name": "新的事件",
      "date": "",
      "repeat": 0,
      "top": false
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDays: function () {
      wx.navigateTo({
        url: '/pages/days/days',
      })
    },
    toSetDays: function (e) {
      let data = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/daysSet/daysSet?doc=${data.doc}&type=${data.type}`,
      })
    }
  }
})