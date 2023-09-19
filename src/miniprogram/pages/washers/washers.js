// pages/washers/washers.js
const db = wx.cloud.database()
const $ = db.command.aggregate

let videoAd = null
let qr = ''
let current = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    selectorShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
    this.data.dormitory = wx.getStorageSync('dormitory')
    this.data.dormitory ? {} : this.data.dormitory = '怡丁苑男生'
    this.setData({
      dormitory: this.data.dormitory
    })
    this.getDormintories()
    this.getWahsersInfo(this.data.dormitory)

    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-f675c26d30fee0f2'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          //encodeURIComponent(e.currentTarget.dataset.qrcode)
          wx.previewImage({
            urls: ['http://api.yum6.cn/qrcode.php?url=' + qr],
            current: 'http://api.yum6.cn/qrcode.php?url=' + qr
          })
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '观看广告后可查看',
            icon: 'none'
          })
        }
      })
    }

  },
  showQrCode: function (e) {
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            wx.showToast({
              title: '加载失败',
              icon: 'error'
            })
          })
      })

      qr = encodeURIComponent(e.currentTarget.dataset.qrcode)

      // videoAd.onClose(res => {

      // })

    }
  },
  getWahsersInfo: function () {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('washers_data').where({
      lh: this.data.dormitory
    }).orderBy('no', 'asc').get().then(res => {
      this.setData({
        data: res.data
      })
      wx.hideLoading()
    })
  },
  getDormintories: function () {
    wx.showLoading({
      title: '加载中',
    })
    db
      .collection('washers_data')
      .aggregate()
      .group({
        _id: 1,
        categories: $.addToSet('$lh')
      })
      .end()
      .then(res => {
        wx.hideLoading()
        this.setData({
          categories: res.list[0].categories,
          value: [res.list[0].categories.indexOf(this.data.dormitory)],
        })
      })
  },
  comfirm: function (e) {
    this.setData({
      dormitory: current,
      selectorShow: !this.data.selectorShow
    })
    wx.setStorageSync('dormitory', this.data.dormitory)
    this.getWahsersInfo()
  },
  bindChange: function (e) {
    current = this.data.categories[e.detail.value[0]]
  },
  showSelector: function () {
    this.setData({
      selectorShow: !this.data.selectorShow
    })
  },
  onClose: function () {
    this.setData({
      selectorShow: !this.data.selectorShow
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