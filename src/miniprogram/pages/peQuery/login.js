// pages/peQuery/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: "",
    password: ""
  },
  forgetPwd(){
    
  },
  login() {
    let {
      account,
      password
    } = this.data
    if (!account || !password) {
      wx.showToast({
        title: '账号或密码为空',
        icon: "none"
      })
      return;
    }
    wx.showLoading({
      title: '请稍等',
    })
    wx.cloud.callFunction({
      name: "peTest",
      data: {
        type: "query",
        account,
        password
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.result.code) {
        wx.showToast({
          title: res.result.msg,
          icon: "none"
        })
        return;
      }
      wx.setStorageSync('tygl', {
        account,
        password
      })
      wx.setStorageSync('tygl_grade', res.result.data)
      wx.navigateTo({
        url: './peQuery',
      })
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