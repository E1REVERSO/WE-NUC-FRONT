// pages/extraAccounts/extraAccounts.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    actions: [{
      name: '取消绑定',
      subname: '描述信息'
    }]
  },
  onClick: function (e) {
    console.log(e.detail);
    this.setData({
      show: true,
      ['actions[0].subname']: `取消绑定「${e.detail.username}」`,
      ['actions[0].username']: e.detail.username
    })
  },
  onSelect: function (e) {
    console.log(e.detail.username);
    wx.showLoading({
      title: '加载中',
    })
    wx.removeStorage({
      key: `extraTable_${e.detail.username}`,
    })
    let extra = wx.getStorageSync('extraAccounts')
    for (let i = 0; i < extra.length; i++) {
      if (extra[i].data.username == e.detail.username) {
        extra.removeByIdx(i)
        break
      }
    }
    wx.setStorageSync('extraAccounts', extra)
    // wx.cloud.database().collection('extraAccounts').get().then(res => {
    //   console.log(res);
    // })
    wx.cloud.database().collection('extraAccounts').where({
      username: e.detail.username
    }).remove().then(async res => {
      wx.cloud.callFunction({
        name: 'classTable',
        data: {
          type: 'delete',
          username: e.detail.username
        }
      })
      wx.hideLoading()
      this.onShow()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '出错了',
        icon: 'error'
      })
      this.onShow()
    })
  },
  onClose: function () {
    this.setData({
      show: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  sync: async function (type) {
    switch (type) {
      case 'to':
        wx.showLoading({
          title: '正在同步至云端',
          icon: "none"
        })
        try {
          await wx.cloud.database().collection('extraAccounts').where({
            _openid: null
          }).remove().then(async res => {
            return await wx.cloud.database().collection('extraAccounts').add({
              data: wx.getStorageSync('extraAccounts')
            })
          })
        } catch (e) {}
        break;
      case 'from':
        wx.showLoading({
          title: '正在从云端同步',
          icon: "none"
        })
        break;
    }

    wx.hideLoading()
  },
  onLoad: function (options) {

    // if (!this.data.data && !this.data.data.length) {

    // }

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
    this.setData({
      data: wx.getStorageSync('extraAccounts')
    })
    if (!this.data.data && !this.data.data.length) {
      db.collection('extraAccounts').where({
        _openid: null
      }).remove()
    }
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