// miniprogram/pages/pointCalc/pointCalc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: Object,
    ticket: {
      top: -2445
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // return
    let login = wx.getStorageSync('login');
    if (!login) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    wx.showLoading({
      title: '查询中',
    })
    this.getPoints(login).then(res => {
      console.log(res);
      if (!res.length) {
        wx.showToast({
          title: '查询失败',
          icon: 'error'
        })
        return;
      }
      this.setData({
        points: res,
        userinfo: wx.getStorageSync("userInfo"),
        time: new Date().Format('yyyy年MM月dd日 hh:mm:ss')
      }, () => {
        const query = wx.createSelectorQuery()
        query.select('.content').boundingClientRect((rect) => {
          this.setData({
            height: rect.height
          }, () => {
            setTimeout(() => {
              this.setData({
                heightF: 1
              })
            }, 250)

          })
        }).exec()
        query.select('.ticket-top').boundingClientRect(rect => {
          this.setData({
            ticket: rect
          })
        }).exec()
        this.setData({
          show: true,
          pulltop: 1
        })
      })



      wx.hideLoading({
        success: (res) => {},
      })
    })
  },
  onClickTicket: function () {
    if (this.data.show) return;

    // ['ticket.top']: this.data.ticket.top + this.data.height + 14 + 24

  },
  getPoints: async function (login) {

    let points = await wx.cloud.callFunction({
      name: "getJwxt",
      data: {
        type: "points",
        ...login
      }
    }).catch(e => {

    })

    wx.hideLoading()

    let res = points.result

    switch (res.code) {
      case 1:
        wx.setStorageSync('points', res.data)
        return res.data
      case -1:
        wx.removeStorageSync('login')
      default:
        return {}
    }
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