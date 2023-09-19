// pages/peQuery/peQuery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  toDetail: async function (event) {
    console.log(event);
    // console.log(JSON.parse(d))
    // console.log(d);
    let gender = "女生"
    event.currentTarget.dataset.item.detail.map(a => (() => {
      console.log(a);
      if (a.examName == "1000米") gender = "男生"
    })())
    let url = `/pages/physicalTestCalculator/index?gender=${gender}&grade=大${event.currentTarget.dataset.item.gradeType.split("年级")[0]}&${(event.currentTarget.dataset.item.detail.map(a => `${a.examName}=${a.actualScore?a.actualScore:""}`)).join("&")}`
    let temp = {}
    let item = event.currentTarget.dataset.item.detail.map(a => (temp[`${a.examName}`] = a.actualScore))


    console.log(url);
    wx.navigateTo({
      url,
    })
  },
  onLoad: async function (options) {
    let login = wx.getStorageSync('tygl')
    if (!login) {
      wx.redirectTo({
        url: './login',
      })
      return;
    }

    let data = wx.getStorageSync('tygl_grade')
    if (!data) {
      wx.showLoading({
        title: '读取中',
      })
      let result = await this.getGrade(login.account, login.password)
      if (result.code != 0) {
        wx.hideLoading()
        wx.showToast({
          title: result.msg,
          icon: "none"
        })
        wx.redirectTo({
          url: './login',
        })
        return;
      }
      data = result.data
      wx.setStorageSync('tygl_grade', data)
    }

    this.setData({
      data: data.reverse()
    })


  },
  getGrade: async function (account, password) {
    return await wx.cloud.callFunction({
      name: "peTest",
      data: {
        type: "query",
        account,
        password
      }
    }).then(res => {
      return res.result
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
  onPullDownRefresh: async function () {
    let login = wx.getStorageSync('tygl')
    if (!login) {
      wx.redirectTo({
        url: './login',
      })
    }
    let {
      account,
      password
    } = login
    wx.showLoading({
      title: '读取中',
    })
    let result = await this.getGrade(account, password)
    if (result.code != 0) {
      wx.showToast({
        title: result.msg,
        icon: "none"
      })
      wx.redirectTo({
        url: './login',
      })
    }

    let data = result.data
    wx.setStorageSync('tygl_grade', data)
    this.setData({
      data: data.reverse()
    })
    wx.hideLoading()
    wx.showToast({
      title: '读取成功',
    })
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
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