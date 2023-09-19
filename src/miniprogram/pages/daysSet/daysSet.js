// pages/daysSet/daysSet.js
const app = getApp()
const db = wx.cloud.database()
const util = require('../../js/daysUtil.js');

// let name = ''
// let date = ''
// let top = false
// let repeat = 0

let doc = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    date: '',
    top: false,
    repeat: 0,
    repeatList: [{
      name: "不重复",
      index: 0
    }, {
      name: "每天重复",
      index: 1
    }, {
      name: "每周重复",
      index: 2
    }, {
      name: "每月重复",
      index: 3
    }, {
      name: "每年重复",
      index: 4
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.doc && options.type) {
      doc = options.doc
      this.setDays(options.doc, options.type)
      this.setData({
        type: options.type
      })
    } else {
      let t = new Date()
      this.setData({
        type: 'add',
        t: t.getTime(),
        date: util.formatDate(t)
      })
    }

  },
  setDays: function (doc, type) {
    let database
    if (type == 'cloud') {
      database = db.collection('cloudDays')
    } else if (type == 'user') {
      database = db.collection('userDays')
    }

    database.doc(doc).get()
      .then(res => {
        this.setData({
          ...res.data,
          t: new Date(res.data.date).getTime()
        })
        // name = res.data.name
        // date = res.data.date
        // top = res.data.top
        // repeat = res.data.repeat
      })

  },
  setTop: function () {
    this.setData({
      top: !this.data.top
    })
  },
  setRepeat: function (e) {
    this.setData({
      repeat: e.detail.index
    })
  },
  repeatClose: function () {
    this.setData({
      repeatShow: false
    })
  },
  showRepeat: function () {
    this.setData({
      repeatShow: true
    })
  },
  showDate: function () {
    this.setData({
      calendarShow: true
    })
  },
  setDate: function (e) {
    console.log(e.detail);
    this.setData({
      date: util.formatDate(new Date(e.detail))
    })
    this.calendarClose()
  },
  calendarClose: function () {
    this.setData({
      calendarShow: false
    })
  },
  calendarConfirm: function () {
    this.setData({
      calendarShow: false
    })
  },

  add: function () {
    if (!this.data.name || !this.data.date) {
      wx.showToast({
        title: '输入不完整',
        icon: "error"
      })
      return
    }
    wx.showLoading({
      title: '添加中',
    })
    db.collection('userDays').add({
      data: {
        name: this.data.name,
        date: this.data.date,
        repeat: this.data.repeat,
        top: this.data.top
      }
    }).then(res => {
      wx.hideLoading()
      if (res._id) {
        wx.showToast({
          title: '新增成功',
        })
        wx.navigateBack()
      }
    })
  },
  delete: function () {
    wx.showLoading({
      title: '删除中',
    })
    db.collection('userDays').doc(doc).remove()
      .then(res => {
        wx.hideLoading()
        console.log(res);
        if (res.stats.removed) {
          wx.showToast({
            title: '删除成功',
          })
          wx.navigateBack()
        }
      })
  },
  save: function () {
    if (!this.data.name || !this.data.date) {
      wx.showToast({
        title: '输入不完整',
        icon: "error"
      })
      return
    }
    wx.showLoading({
      title: '保存中',
    })
    db.collection('userDays').doc(doc).update({
      data: {
        name: this.data.name,
        date: this.data.date,
        repeat: this.data.repeat,
        top: this.data.top
      }
    }).then(res => {
      wx.hideLoading()
      console.log(res);
      if (res.stats.updated) {
        wx.showToast({
          title: '修改成功',
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          title: '无修改',
        })
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