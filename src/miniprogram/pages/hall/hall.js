// pages/hall/hall.js
const app = getApp()
const db = wx.cloud.database()

Page({

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

  firstLoad: function () {

  },
  onShow() {
    this.getAllData()
  },
  onLoad: async function () {


  },
  onShareAppMessage: function () {

  },
  getAllData: async function () {
    this.setData({
      list: wx.getStorageSync('hallClassList'),
      data: wx.getStorageSync('hallMenuData')
    })
    db.collection('hallClassList').orderBy('order', 'asc').get().then(res => {
      wx.setStorageSync('hallClassList', res.data)
      if (app.globalData.version == "trail" || app.globalData.version == 'develop') {
        res.data.push({
          name: "trailFunctions",
          order: 10000,
          title: "测试中未上线/待完善功能（正式版不显示此区域）"
        })
      }
      this.setData({
        list: res.data
      })
      return res.data
    }).then(res => {
      for (let i = 0; i < res.length; i++) {
        this.getItems(res[i].name)
      }
    })
  },
  getItems: function (name) {
    wx.cloud.callFunction({
      name: 'getHallMenu',
      data: {
        type: 'byName',
        name
      }
    }).then(res => {
      console.log(res);
      let hallMenuData = wx.getStorageSync('hallMenuData')
      if (!hallMenuData) hallMenuData = {}
      hallMenuData[name] = res.result
      wx.setStorageSync('hallMenuData', hallMenuData)
      this.setData({
        [`data.${name}`]: res.result
      })
    })
  },
  onHide: function () {

  },

  toContact: function () {
    wx.navigateTo({
      url: '/pages/serviceStaff/serviceStaff',
    })
  }

})