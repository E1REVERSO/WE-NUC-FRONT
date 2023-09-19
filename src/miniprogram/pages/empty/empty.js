// pages/empty/empty.js
let login = {}
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: ['一', '二', '三', '四', '五', '六', '日'],
    jxl: [{
        "XQH_ID": "01",
        "JXLDM": "01",
        "JXLMC": "1#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "10",
        "JXLMC": "10#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "11",
        "JXLMC": "11#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "12",
        "JXLMC": "12#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "13",
        "JXLMC": "13#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "14",
        "JXLMC": "14#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "15",
        "JXLMC": "15#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "16",
        "JXLMC": "16#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "04",
        "JXLMC": "4#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "06",
        "JXLMC": "6#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "07",
        "JXLMC": "7#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "08",
        "JXLMC": "8#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "09",
        "JXLMC": "9#教学楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "工程",
        "JXLMC": "工程训练中心"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "J01",
        "JXLMC": "旧1#楼"
      },
      {
        "XQH_ID": "01",
        "JXLDM": "001",
        "JXLMC": "虚拟教室"
      },
      {
        "JXLDM": "wlh",
        "JXLMC": "无楼号"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    login = wx.getStorageSync('login')
    if (!login) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      // wx.showToast({
      //   title: '请登录后使用',
      //   icon: 'none'
      // })
      return
    }
    let empty_type = wx.getStorageSync('empty_type')
    if (!empty_type) {
      empty_type = 'normal'
      wx.setStorageSync('empty_type', 'normal')
      Dialog.alert({
        message: '空教室查询支持大节和小节两个模式，可在上方切换按钮点击切换',
      }).then(() => {
        // on close
      });
    }
    this.setData({
      empty_type
    })
    console.log(app.globalData);
    let jxl = wx.getStorageSync('jxl')
    if (!jxl) jxl = 0
    this.setData({
      info: {
        zcd: app.globalData.weeks,
        xqj: app.globalData.calendar.nWeek,
        lh: this.data.jxl[jxl].JXLDM
      },
      value: [jxl,
        parseInt(app.globalData.weeks) - 1,
        parseInt(app.globalData.calendar.nWeek) - 1
      ]
    })
    this.comfirm()
    console.log(app.globalData)
    this.setData({
      container: () => wx.createSelectorQuery().select(`#sticky`),
      systemInfo: app.globalData.systemInfo
    })
  },
  bindChange: function (e) {
    console.log(e)
    let index = e.detail.value
    console.log(index)
    let lh = this.data.jxl[index[0]].JXLDM
    let zcd = index[1] + 1
    let xqj = index[2] + 1
    this.setData({
      info: {
        lh,
        zcd,
        xqj
      },
      value: index
    })

  },
  exchange: function () {
    if (this.data.empty_type == 'detail') {
      this.setData({
        empty_type: 'normal'
      })
      wx.setStorageSync('empty_type', 'normal')
    } else {
      this.setData({
        empty_type: 'detail'
      })
      wx.setStorageSync('empty_type', 'detail')
    }
  },
  comfirm: async function () {
    let info = this.data.info
    console.log(info);
    wx.setStorageSync('jxl', this.data.value[0])
    wx.showLoading({
      title: '加载中',
    })
    await wx.cloud.callFunction({
      name: "getJwxt",
      data: {
        type: "empty",
        ...info,
        ...login
      }
    }).then(res => {
      this.setData({
        rooms: Object.keys(res.result.data),
        data: res.result.data,

      })
    })
    wx.hideLoading()
    this.setData({
      settingsShow: false
    })
  },
  showSelect: function () {
    this.setData({
      settingsShow: true
    })
  },
  onClose: function () {
    this.setData({
      settingsShow: false
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