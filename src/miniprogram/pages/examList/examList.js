// pages/examList/examList.js
let login
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    login = wx.getStorageSync('login')
    if (!login) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      // wx.showToast({
      //   title: '请登陆后使用',
      // })
      // setTimeout(function () {
      //   wx.navigateBack({
      //     delta: 1
      //   })
      // }, 750)
      return
    } else {
      this.getData()
    }
  },
  getData: async function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let exam = await wx.cloud.callFunction({
      name: "getJwxt",
      data: {
        type: "exam",
        ...login
      }
    }).catch(e => {
      console.log(e);
      wx.hideLoading()
      wx.showToast({
        title: '出错了请重试',
        icon: 'error'
      })
    })

    wx.hideLoading()

    console.log(exam);
    let res = exam.result
    console.log(res.code);
    switch (res.code) {
      case 1:
        wx.showToast({
          title: '加载成功',
          icon: "success"
        })
        this.setData({
          data: res.data.items
        })
        return res.data
        break
      case -1:
        wx.removeStorageSync('login')
      default:
        wx.showToast({
          duration: 1500,
          icon: 'none',
          title: res.msg
        })
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