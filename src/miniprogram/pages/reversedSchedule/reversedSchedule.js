// miniprogram/pages/reversedSchedule/reversedSchedule.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    let date = new Date()
    const getFmtDate = app.globalData.getFmtDate
    this.setData({
      time: (parseInt(getFmtDate("MMdd", date)) >= 1001 || parseInt(getFmtDate("MMdd", date)) < 501) ? app.globalData.winterTime : app.globalData.summerTime

    })

    let classTable = wx.getStorageSync('classTable')
    this.setData({
      username: wx.getStorageSync('login').username
    })

    if (!classTable) {
      return
    }
    classTable = classTable.main
    this.reversedHandler(classTable)

  },
  reversedHandler: function (classTable) {
    let sections = [
      [{
        section: 1
      }, {
        section: 2
      }],
      [{
        section: 3
      }, {
        section: 4
      }],
      [{
        section: 5
      }, {
        section: 6
      }],
      [{
        section: 7
      }, {
        section: 8
      }],
      [{
        section: 9
      }, {
        section: 10
      }, {
        section: 11
      }]
    ]
    let jcPrefix = ['1', '3', '5', '7', '9']
    let reverseTable = [
      [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
      ],
      [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
      ],
      [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
      ],
      [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
      ],
      [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20],
      ]
    ]

    Array.prototype.remove = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };

    function getRanges(array) {
      var ranges = [],
        rstart, rend;
      for (var i = 0; i < array.length; i++) {
        rstart = array[i];
        rend = rstart;
        while (array[i + 1] - array[i] == 1) {
          rend = array[i + 1]; // increment the index if the numbers sequential
          i++;
        }
        ranges.push(rstart == rend ? rstart + '' : rstart + '-' + rend);
      }
      return ranges;
    }

    function getRangesParity(array) {
      var ranges = [],
        rstart, rend;
      for (var i = 0; i < array.length; i++) {
        rstart = array[i];
        rend = rstart;
        while (array[i + 1] - array[i] == 2) {
          rend = array[i + 1]; // increment the index if the numbers sequential
          i++;
        }
        ranges.push(rstart == rend ? rstart + '' : rstart + '-' + rend + (rstart % 2 == 0 ? "双" : "单"));
      }
      return ranges;
    }

    for (let i = 0; i < classTable.length; i++) {
      let item = classTable[i]
      let {
        weeks,
        xqj,
        jcs
      } = item

      let sectionIndex = jcPrefix.indexOf(jcs.split('-')[0])
      if (sectionIndex == -1) {
        sectionIndex = jcPrefix.indexOf(jcs.split('-')[1])
      }
      // let section = sections[sectionIndex]

      if (xqj > 5) continue

      for (let j = 0; j < weeks.length; j++) {
        reverseTable[xqj - 1][sectionIndex].remove(weeks[j])
      }
    }

    console.log(reverseTable);

    for (let i = 0; i < reverseTable.length; i++) {
      for (let j = 0; j < reverseTable[i].length; j++) {
        let item = reverseTable[i][j]
        // console.log(item);
        reverseTable[i][j] = getRangesParity(getRanges(item))
      }
    }

    this.setData({
      reverseTable: reverseTable
    })

  },

})