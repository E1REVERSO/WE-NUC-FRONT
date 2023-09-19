// pages/extraLogin/extraLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },
  login: function () {
    if (this.data.password == '' || this.data.username == '') {
      wx.showToast({
        title: '账号或密码不能为空',
      })
      return
    }

    let extraAccounts = wx.getStorageSync('extraAccounts')
    if (extraAccounts > 1) {
      wx.showToast({
        duration: 1500,
        icon: 'none',
        title: '账户过多'
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: "getJwxt",
      data: {
        type: 'loginExtra',
        username: this.data.username,
        password: this.data.password
      }
    }).catch(e => {
      console.log(e);
      wx.hideLoading()
      wx.showToast({
        title: '出错了请重试',
        icon: 'error'
      })
    }).then(res => {
      wx.hideLoading()
      console.log(res);
      res = res.result

      if (res == 'tooMore') {
        wx.showToast({
          duration: 1500,
          icon: 'none',
          title: '账户过多'
        })
      }

      switch (res.code) {
        case 1:
          let extra = wx.getStorageSync('extraAccounts')
          if (!extra) extra = []
          console.log(extra);
          let item = {}
          item.username = this.data.username
          item.password = this.data.password
          item.data = res.data
          item.showTable = true,
            item.showScores = true

          extra.push(item)
          console.log(extra);
          wx.setStorageSync('extraAccounts', extra)

          if (this.back) {
            // wx.navigateToMiniProgram({
            //   appId: 'wxd7985a0410040e3d',
            // })
            wx.navigateBackMiniProgram()
          } else {
            wx.navigateBack()
          }
          break
        default:
          wx.showToast({
            duration: 1500,
            icon: 'none',
            title: res.msg
          })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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