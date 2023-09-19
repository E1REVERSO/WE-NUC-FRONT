// miniprogram/pages/scores/scores.js
let login = null
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    xns: [],
    xn: null,
    xq: null,
    scores: null,
    points: null,
    xqjd: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options);
    wx.stopPullDownRefresh()
    const {
      username,
      password
    } = options

    login = {
      username,
      password
    }
    console.log(options);
    let extraAccounts = wx.getStorageSync('extraAccounts')

    for (let i = 0; i < extraAccounts.length; i++) {
      if (extraAccounts[i].username == username) {
        this.account = extraAccounts[i]
        break
      }
    }
    console.log(this.account);
    if (!login) {
      wx.navigateBack()
      return
    }
    let scores = wx.getStorageSync('extraScores_' + this.account.data.username)
    if (!scores) scores = await this.getScores()

    let points = wx.getStorageSync('extraPoints_' + this.account.data.username)

    if (!points) {
      this.getPoints().then(res => {
        console.log(res);
        this.setData({
          points: res
        })
      })
    } else {
      this.setData({
        points
      })
    }

    this.setData({
      scores
    })

    this.showScores()
    this.getXqjd()
  },
  showScores: function () {
    let scores = this.data.scores[0]
    let xns = Object.keys(scores)
    xns.sort((a, b) => {
      return a.split('-')[0] - b.split('-')[0]
    })

    let xn = xns[xns.length - 1]
    let xq = Object.keys(scores[xn]).length

    this.setData({
      xns,
      xn,
      xq
    })
  },
  getXqjd: function () {
    let xn = this.data.xn
    let xq = this.data.xq
    let scores = this.data.scores[0][xn][xq]

    let xfjdsum = 0
    let xfsum = 0
    let xfsumgain = 0
    for (let i = 0; i < scores.length; i++) {
      xfsum += parseFloat(scores[i].xf)
      xfjdsum += scores[i].xf * scores[i].jd
      if (scores[i].jd > 0) {
        xfsumgain += parseFloat(scores[i].xf)
      }
    }
    let xqjd = (xfjdsum / xfsum).toFixed(2)
    console.log("jd", xqjd, xfjdsum, xfsum)
    this.setData({
      xqjd: {
        jd: xqjd,
        xfjdsum,
        xfsum,
        xfsumgain
      }
    })
  },
  getScores: async function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let scores = await wx.cloud.callFunction({
      name: "getJwxt",
      data: {
        type: "scores",
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

    console.log(scores);
    let res = scores.result
    console.log(res.code);
    switch (res.code) {
      case 1:
        wx.setStorageSync('extraScores_' + this.account.data.username, res.data)
        wx.showToast({
          title: '加载成功',
          icon: "success"
        })
        return res.data
        break
      case -1:
        wx.showToast({
          duration: 1500,
          icon: 'none',
          title: '学号或密码错误'
        })
      default:
        wx.showToast({
          duration: 1500,
          icon: 'none',
          title: res.msg
        })
        return {}
    }

  },
  getPoints: async function () {
    let points = await wx.cloud.callFunction({
      name: "getJwxt",
      data: {
        type: "points",
        ...login
      }
    }).catch(e => {

    })

    wx.hideLoading()

    let res = points.result

    switch (res.code) {
      case 1:
        wx.setStorageSync('extraPoints_' + this.account.data.username, res.data)
        return res.data
      case -1:
        wx.showToast({
          duration: 1500,
          icon: 'none',
          title: '学号或密码错误'
        })
      default:
        return {}
    }
  },
  onChangeXn(event) {
    this.setData({
      xn: event.detail.name
    })
    this.getXqjd()
  },
  onChangeXq(event) {
    this.setData({
      xq: event.detail.index + 1
    })
    this.getXqjd()
  },
  showSettings: function () {
    this.setData({
      settingsShow: !this.data.settingsShow,
    })
  },
  onClose: function () {
    this.setData({
      settingsShow: false,
    })
  },
  onPullDownRefresh: function () {
    wx.removeStorageSync('extraScores_' + this.account.data.username)
    wx.removeStorageSync('extraPoints_' + this.account.data.username)

    this.onLoad(login)
  }
})