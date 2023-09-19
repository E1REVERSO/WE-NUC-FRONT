// pages/phoneList/phoneList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    searches: []
  },
  onCancel: function () {
    this.setData({
      searches: []
    })
  },
  onSearch: function (e) {
    let text = e.detail
    let datas = this.data.data
    let searches = []
    for (let i = 0; i < datas.length; i++) {
      for (let j = 0; j < datas[i].children.length; j++) {
        let element = datas[i].children[j]
        //address  name  userName
        // console.log(element)
        if (element.address.includes(text) || element.name.includes(text) || element.userName.includes(text)) {
          element.type = datas[i].name
          searches.push(element)
        }

      }
    }
    if (searches.length) {
      this.setData({
        searches
      })
    } else {
      wx.showToast({
        title: '未搜索到结果',
        icon: 'none'
      })
    }


    console.log(searches)

  },
  onChange: function (e) {
    console.log(e)
    let datas = this.data.data[e.detail].children
    console.log(datas)
    this.setData({
      current_catagory: datas
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let phoneList = wx.getStorageSync('phoneList')
    if (phoneList) {
      this.setData({
        data: phoneList,
        current_catagory: phoneList[0].children
      })
      wx.showNavigationBarLoading()
    } else {
      wx.showLoading({
        title: "加载中"
      })
    }
    wx.cloud.callFunction({
      name: "getOther",
      data: {
        type: "phone"
      }
    }).then(res => {
      console.log(res)
      if (res.result.errCode == 0) {
        let data = res.result.data
        this.setData({
          data,
          current_catagory: data[0].children
        })
        wx.setStorage({
          key: "phoneList",
          data
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      } else {
        wx.showToast({
          title: '加载失败',
          icon: "none"
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  onClickItem(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.item.phone)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.item.phone,
      fail: () => {}
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