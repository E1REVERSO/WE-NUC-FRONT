// pages/TrainPlan/TrainPlan.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let login = wx.getStorageSync('login')
    if (!login) {
      this.setData({
        login: false
      })
      return
    }
    this.setData({
      login: true
    })
    this.getDisciplineId()
  },
  getDisciplineId: async function (focus) {
    let that = this
    // wx.showLoading({
    //   title: "加载中"
    // })
    let disciplineId = wx.getStorageSync('disciplineId')

    if (!disciplineId || focus) {
      wx.showNavigationBarLoading()

      await wx.cloud.callFunction({
        name: "getJwxt",
        data: {
          type: 'disciplineId',
          ...wx.getStorageSync('login')
        }
      }).then(res => {
        console.log(res)
        wx.setStorageSync('disciplineId', res.result.jxzxjhxx_id)
        disciplineId = res.result.jxzxjhxx_id
        db.collection('disciplineList').where({
          jxzxjhxx_id: res.result.jxzxjhxx_id
        }).count().then(res => res.total).then(total => {
          switch (total) {
            case 0:
              db.collection('disciplineList').add({
                data: {
                  ...res.result
                }
              })
              break;
            default:
              db.collection('disciplineList').where({
                jxzxjhxx_id: res.result.jxzxjhxx_id
              }).update({
                data: {
                  ...res.result
                }
              })
          }
        })

        this.setData({
          info: res.result
        }, () => {
          wx.hideNavigationBarLoading()
        })
      }).catch(e => {
        console.log(e)
        wx.hideNavigationBarLoading()

        wx.showToast({
          title: '出错了，请重试',
          icon: "error"
        })
      })
    } else {

      let jxzxjhxx_id = disciplineId
      await db.collection('disciplineList').where({
        jxzxjhxx_id
      }).get().then(res => {
        console.log(res)
        that.setData({
          info: res.data[0]
        })
      }).catch(e => {
        wx.showToast({
          title: '出错了，请重试',
          icon: "error"
        })
      })
    }
    this.setData({
      loading: false
    })
  },
  // getDisciplineInfo: function (jxzxjhxx_id) {
  //   // this.setData({
  //   //   // data: wx.getStorageSync('disciplineDetail')
  //   // })
  // db.collection('disciplineList').where({
  //   jxzxjhxx_id
  // }).get().then(res => {
  //   if (!res.data.length) {
  // wx.cloud.callFunction({
  //   name: "getJwxt",
  //   data: {
  //     type: "disciplineDetail",
  //     ...wx.getStorageSync('login'),
  //     zyh: jxzxjhxx_id,
  //     upload: true
  //   }
  // })
  //   }
  // })
  // },
  toDiscList() {
    wx.navigateTo({
      url: '/pages/discList/discList',
    })
  },
  toDetail() {
    wx.navigateTo({
      url: '/pages/TrainPlanDetail/TrainPlanDetail?id=' + this.data.info.jxzxjhxx_id,
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
    wx.stopPullDownRefresh()
    this.getDisciplineId(true)
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