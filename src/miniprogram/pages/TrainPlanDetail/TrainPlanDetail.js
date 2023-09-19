// pages/TrainPlanDetail/TrainPlanDetail.js
let db = wx.cloud.database()
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
    wx.showLoading({
      title: '加载中',
      icon:'loading'
    })
    let that = this
    let {
      id
    } = options

    wx.cloud.getTempFileURL({
      fileList: [`cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/training_plan/${id}.json`],
    }).then(res => {
      console.log( res.fileList[0].tempFileURL)
      return res.fileList[0].tempFileURL
    }).then(res => {
      // console.log(1)
      let url = res
      wx.request({
        url,
        success: function (res) {
          console.log(res)
          that.setData({
            data: res.data
          })
        },
        fail: async function (err) {
          console.log(err)
          if (err.errMsg.startsWith("request:fail invalid url")) {
            // that.setData({
            //   data: wx.getStorageSync('disciplineDetail')
            // })
            //传文件 加数据库
            wx.showLoading({
              title: '从云端获取中',
              icon: "loading"
            })
            let zyh = wx.getStorageSync('disciplineId')
            let detail = await wx.cloud.callFunction({
              name: "getJwxt",
              data: {
                type: "disciplineDetail",
                zyh,
                upload: true,
                ...wx.getStorageSync('login')
              }
            })
            that.setData({
              data: detail.result
            })
            console.log(detail)
            wx.hideLoading()

            console.log(zyh)
            // wx.setStorageSync('disciplineId', zyh.result.jxzxjhxx_id)
            // wx.setStorageSync('disciplineDetail', zyh.result)


          }
          console.log(err);
        }
      })
    })

    wx.hideLoading({
      success: (res) => {},
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