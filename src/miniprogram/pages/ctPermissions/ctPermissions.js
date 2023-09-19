// miniprogram/pages/ctPermissions/ctPermissions.js
const app = getApp()

let getFmtDate

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    getFmtDate = app.globalData.getFmtDate
    wx.showLoading({
      title: '加载中',
    })

    let permission = await wx.cloud.callFunction({
      name: 'classTable',
      data: {
        type: 'getAuth'
      }
    })

    console.log(permission);
    let data = []
    for (let i = 0; i < permission.result.length; i++) {
      data[i] = this.handle(permission.result[i])
    }

    await this.setData({
      data
    })
    wx.hideLoading()

  },
  handle: function (data) {
    if (data.acceptTime && (new Date().getTime() <= data.endTime)) data.valid = true

    data.startTime = !data.startTime ? '0000-00-00 00:00:00' : getFmtDate('yyyy-MM-dd hh:mm:ss', new Date(data.startTime))
    data.acceptTime = !data.acceptTime ? '未接受' : getFmtDate('yyyy-MM-dd hh:mm:ss', new Date(data.acceptTime))
    data.endTime = !data.endTime ? '0000-00-00 00:00:00' : getFmtDate('yyyy-MM-dd hh:mm:ss', new Date(data.endTime))

    return data
  },
  cancel: async function (e) {
    let doc = e.currentTarget.dataset.doc
    wx.showLoading({
      title: '加载中',
    })
    let res = await wx.cloud.callFunction({
      name: 'classTable',
      data: {
        type: 'cancel',
        doc
      }
    })
    console.log(res);
    wx.hideLoading()
    this.onLoad()
  },
  accept: async function (e) {
    let doc = e.currentTarget.dataset.doc
    wx.showLoading({
      title: '加载中',
    })
    await wx.cloud.callFunction({
      name: 'classTable',
      data: {
        type: 'accept',
        doc
      }
    })
    wx.hideLoading()
    this.onLoad()
  }
})