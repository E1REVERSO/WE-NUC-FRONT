// pages/extra/avatar/index.js
let canvas, ctx
const db = wx.cloud.database()

let interstitialAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-7a4e0f9f80aa0f5e'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // this.loadCanvas()
    // this.redraw('https://thirdwx.qlogo.cn/mmopen/vi_32/7gicicmriacTZarkRIDkqsjEcbozyBX57y6eRy4ltKcGFaN2rCPnM1KyjNdlhPjuvLyibE58NH57deDD8yzCd8xZ0w/132')
    this.getDecoration()
  },
  storage: function () {
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }

    wx.canvasToTempFilePath({
      fileType: 'png',
      quality: 1,
      canvas,
    }).then(res => {
      console.log(res);
      wx.showShareImageMenu({
        path: res.tempFilePath,
        success: (res) => {
          console.log("分享成功：", res);
        },
        fail: (err) => {
          console.log("分享失败：", err);
        },
      });
    })
  },
  redraw: async function (avatar, decoration) {
    ctx.clearRect(0, 0, 976, 976);
    if (avatar) {
      await this.drawImage(avatar)
    }
    if (decoration) {
      await this.drawImage(decoration)
    }
  },
  loadCanvas: async function () {
    const query = wx.createSelectorQuery()
    await new Promise((resolve, reject) => {
      query
        .select("#myCanvas")
        .fields({
          node: true,
          size: true
        })
        .exec(async res => {
          canvas = res[0].node
          ctx = canvas.getContext("2d")
          resolve()
        })
    })

    canvas.width = 976
    canvas.height = 976
  },
  drawDeco: function (e) {
    console.log(e.currentTarget.dataset.url);
    if (!this.data.avatar) {
      wx.showToast({
        title: '请授权头像',
        icon: 'none'
      })
      return
    }
    this.redraw(this.data.avatar, e.currentTarget.dataset.url)
  },
  drawImage: function (url) {
    new Promise((reslove, reject) => {
      const img = canvas.createImage()
      img.src = url
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 976, 976)
      }
    })

  },
  getAvatar: function () {
    wx.getUserProfile({
      desc: '完善客户资料',
    }).then(res => {
      wx.cloud.callFunction({
        name: 'getUserInfo',
        data: {
          cloudID: res.cloudID
        }
      })
      this.setData({
        avatar: res.userInfo.avatarUrl
      })
    }).then(async () => {
      await this.loadCanvas()
      await this.redraw(this.data.avatar)
    })
  },
  getDecoration: function () {
    db.collection('avatarDecoration').where({
      show: true
    }).count().then(res => {
      const total = res.total
      const batch = Math.ceil(total / 20)

      let list = []
      for (let i = 0; i < batch; i++) {
        db.collection('avatarDecoration').where({
          show: true
        }).orderBy('order', 'asc').limit(20).skip(i * 20).get().then(res => {

          list = list.concat(res.data)
          list.sort((a, b) => {
            return a.order - b.order
          })

          this.setData({
            list
          })
        })
      }
    })
  },
  drawDecoration: function (url) {
    new Promise((reslove, reject) => {
      const img = canvas.createImage()
      img.src = url
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 976, 976)
      }
    })

  },
  drawAvatar: function (avatar) {
    new Promise((reslove, reject) => {
      const img = canvas.createImage()
      img.src = avatar
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 976, 976)
      }
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