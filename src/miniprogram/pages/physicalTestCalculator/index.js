// pages/extra/physicalTestCalculator/index.js
const calculator = require('./calculator')

Page({
  /**
   * 页面的初始数据
   */
  defaultData: {
    gender: 'male',
    grade: 'freshman',
    _gender: '男生',
    _grade: '大一',
    inputs: [{
      key: 'height',
      name: '身高',
      unit: '厘米',
    }, {
      key: 'weight',
      name: '体重',
      unit: '千克',
    }, {
      key: 'vital_capacity',
      name: '肺活量',
      unit: '毫升',
    }, {
      key: 'sit_and_reach',
      name: '坐位体前屈',
      unit: '厘米',
    }, {
      key: 'standing_long_jump',
      name: '立定跳远',
      unit: '厘米/米',
    }, {
      key: 'race_50m',
      name: '50米跑',
      unit: '秒',
    }, {
      key: 'race_1000m',
      name: '1000米跑',
      unit: '秒',
      gender: 'male'
    }, {
      key: 'race_800m',
      name: '800米跑',
      unit: '秒',
      gender: 'female'
    }, {
      key: 'pull_up',
      name: '引体向上',
      unit: '个',
      gender: 'male'
    }, {
      key: 'sit_up',
      name: '仰卧起坐',
      unit: '个',
      gender: 'female'
    }],
    performances: {
      "weight": null,
      "height": null,
      "vital_capacity": null,
      "sit_and_reach": null,
      "standing_long_jump": null,
      "race_50m": null,
      "pull_up": null,
      "sit_up": null,
      "race_1000m": null,
      "race_800m": null
    }
  },
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(JSON.parse(JSON.stringify(this.defaultData)))
    if (options) {
      this.onChooseGrade({
        detail: [options.grade]
      })
      this.onChooseGender({
        detail: [options.gender]
      })

      let mi00 = options[`1000米`] ? options[`1000米`] : options[`800米`]
      mi00 = parseFloat(mi00)
      mi00 = (Math.trunc(mi00) * 60 + (mi00 - Math.trunc(mi00)) * 100).toFixed()
      try {
        this.setData({
          performances: {
            height: options[`身高/体重`].split('/')[0],
            pull_up: options[`引体向上`],
            race_50m: options[`50米`],
            race_800m: mi00,
            race_1000m: mi00,
            sit_and_reach: options[`坐位体前屈`],
            sit_up: options[`仰卧起坐`],
            standing_long_jump: options[`立定跳远`],
            vital_capacity: options[`肺活量`],
            weight: options[`身高/体重`].split('/')[1],
          }
        })

      } catch (e) {}

    } else {
      this.setData(wx.getStorageSync('physicalTest'))
    }
    this.setData({
      result: calculator(this.data.gender, this.data.grade, this.data.performances)
    })
  },
  onInput: function (e) {
    console.log(e.target.dataset.name, e.detail.value);
    // if (e.target.dataset.name == 'race_1000m' || e.target.dataset.name == 'race_800m') {
    //   e.detail.value
    // }
    if (e.target.dataset.name == 'sit_and_reach' && e.detail.value == '0') e.detail.value = '0.00001'
    this.setData({
      [`performances.${e.target.dataset.name}`]: e.detail.value
    })
    this.setData({
      result: calculator(this.data.gender, this.data.grade, this.data.performances)
    })
  },
  onChooseGender: function (e) {
    console.log(e.detail[0]);
    this.setData({
      _gender: e.detail[0]
    })
    switch (e.detail[0]) {
      case '男生':
        this.setData({
          gender: 'male'
        })
        break
      case '女生':
        this.setData({
          gender: 'female'
        })
        break
    }
    this.setData({
      result: calculator(this.data.gender, this.data.grade, this.data.performances)
    })
  },
  store: function () {
    wx.setStorageSync('physicalTest', {
      gender: this.data.gender,
      grade: this.data.grade,
      _gender: this.data._gender,
      _grade: this.data._grade,
      performances: this.data.performances
    })
    wx.showToast({
      title: '已存储',
    })
  },
  clear: function () {
    wx.removeStorageSync('physicalTest')
    this.setData(JSON.parse(JSON.stringify(this.defaultData)))
    this.setData({
      result: {}
    })
    wx.showToast({
      title: '已清空',
    })
  },
  onChooseGrade: function (e) {
    console.log(e.detail[0]);
    this.setData({
      _grade: e.detail[0]
    })
    switch (e.detail[0]) {
      case '大一':
        this.setData({
          grade: 'freshman'
        })
        break
      case '大二':
        this.setData({
          grade: 'sophomore'
        })
        break
      case '大三':
        this.setData({
          grade: 'junior'
        })
        break
      case '大四':
        this.setData({
          grade: 'senior'
        })
        break
    }
    this.setData({
      result: calculator(this.data.gender, this.data.grade, this.data.performances)
    })
  },
  showDoc: function (e) {
    wx.downloadFile({
      url: e.currentTarget.dataset.file,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (e) {
            console.log(e);
          }
        })
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})