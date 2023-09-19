// pages/canteenIndex/canteenIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canteenIndex: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.database().collection('diners').orderBy('time', 'desc').limit(1).get().then(res => {
      res = res.data[0]
      this.setData({
        res: res.data,
        time: new Date(res.time).Format('yyyy-MM-dd hh:mm:ss')
      })
      wx.hideLoading()
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
    this.onLoad()

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