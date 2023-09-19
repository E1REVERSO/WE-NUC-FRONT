// miniprogram/pages/scores/scores.js
let login = null
const app = getApp()
import uCharts from '../../js/ucharts.js';
var _self;
var canvaLineA = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    xns: [],
    xn: null,
    xq: 1,
    scores: null,
    points: null,
    xqjd: 0,
    "LineA": {
      "categories": ["2012", "2013", "2014", "2015", "2016", "2017"],
      "series": [{
          "name": "学期绩点",
          "data": [1.5, 1.8, 2.8, 3.7, 4.0, 2.0]
        }
        // , {
        //   "name": "成交量B",
        //   "data": [70, 40, 65, 100, 44, 68]
        // }, {
        //   "name": "成交量C",
        //   "data": [100, 80, 95, 150, 112, 132]
        // }
      ]
    },
  },
  showLineA(canvasId, chartData) {
    let ctx = wx.createCanvasContext(canvasId, this);
    canvaLineA = new uCharts({
      type: 'line',
      context: ctx,
      fontSize: 11,
      legend: true,
      dataLabel: true,
      dataPointShape: true,
      background: '#FFFFFF',
      pixelRatio: 1,
      categories: chartData.categories,
      series: chartData.series,
      animation: true,
      enableScroll: true, //开启图表拖拽功能
      xAxis: {
        disableGrid: false,
        type: 'grid',
        gridType: 'dash',
        itemCount: 4,
        scrollShow: true,
        scrollAlign: 'left',
        //scrollBackgroundColor:'#F7F7FF',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条背景颜色,默认为 #EFEBEF
        //scrollColor:'#DEE7F7',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条颜色,默认为 #A6A6A6
      },
      yAxis: {
        //disabled:true
        gridType: 'dash',
        splitNumber: 8,
        min: 0,
        max: 5.0,
        formatter: (val) => {
          return val.toFixed(2)
        } //如不写此方法，Y轴刻度默认保留两位小数
      },
      width: _self.cWidth,
      height: _self.cHeight,
      extra: {
        line: {
          type: 'straight'
        }
      },
    });

  },
  touchLineA(e) {
    canvaLineA.scrollStart(e);
  },
  moveLineA(e) {
    canvaLineA.scroll(e);
  },
  touchEndLineA(e) {
    canvaLineA.scrollEnd(e);
    //下面是toolTip事件，如果滚动后不需要显示，可不填写
    canvaLineA.showToolTip(e, {
      formatter: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getServerData: function () {
    let LineA = {
      categories: [],
      series: []
    };
    LineA.categories = this.data.statisticData.map(a => a.xnxq)
    LineA.series = [{
        "name": "学期绩点",
        "data": this.data.statisticData.map(a => a.jd)
      },
      {
        "name": "必修绩点",
        "data": this.data.statisticData.map(a => a.bxxqjd)
      }
    ]
    // LineA.categories = this.data.LineA.categories;
    // LineA.series = this.data.LineA.series;
    _self.showLineA("canvasLineA", LineA);

  },
  onLoad: async function (options) {
    let {
      focus
    } = options
    if (focus) {
      wx.stopPullDownRefresh()
    }

    this.setExtra()
    login = wx.getStorageSync('login')
    if (!login) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    let scores = wx.getStorageSync('scores')
    if (!scores || focus) scores = await this.getScores()

    let points = wx.getStorageSync('points')
    if (!points || focus) {
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
    this.setData({
      refresh: false
    })
    this.getXqjd()
    this.getXqjdStatis()
    _self = this;
    this.cWidth = wx.getSystemInfoSync().windowWidth;
    this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    this.getServerData();

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
  onCloseStatistic: function () {
    this.setData({
      statistic: false
    })
  },
  showStatistic: function () {
    this.setData({
      statistic: !this.data.statistic
    })
  },
  getXqjdStatis: function () {
    for (let i = 0; i < this.data.xns.length; i++) {

      let xn = this.data.xns[i]
      for (let xq = 1; xq <= 2; xq++) {
        let scores = this.data.scores[0][xn][xq]
        let xfjdsum = 0
        let xfsum = 0
        let xfsumgain = 0
        let bxxfjdsum = 0;
        let bxxfsum = 0;
        let bxxfsumgain = 0;
        if (!scores) break;
        for (let i = 0; i < scores.length; i++) {
          xfsum += parseFloat(scores[i].xf)
          xfjdsum += scores[i].xf * scores[i].jd
          if (scores[i].jd > 0) {
            xfsumgain += parseFloat(scores[i].xf)
          }
          if (scores[i].kcxzmc == "必修") {
            bxxfsum += parseFloat(scores[i].xf)
            bxxfjdsum += scores[i].xf * scores[i].jd
            if (scores[i].jd > 0) {
              bxxfsumgain += parseFloat(scores[i].xf)
            }
          }
        }
        let xqjd = (xfjdsum / xfsum).toFixed(2)
        let bxxqjd = (bxxfjdsum / bxxfsum).toFixed(2)
        console.log(bxxqjd)
        console.log("jd", xqjd, xfjdsum, xfsum)
        this.setData({
          statisticData: this.data.statisticData ? this.data.statisticData.concat([{
              jd: xqjd,
              xfjdsum,
              xfsum,
              xfsumgain,
              bxxqjd,
              bxxfsumgain,
              xnxq: xn + "-" + xq
            }

          ]) : [{
            jd: xqjd,
            xfjdsum,
            xfsum,
            xfsumgain,
            bxxqjd,
            bxxfsumgain,
            xnxq: xn + "-" + xq
          }]
          // xqjd: {
          //   jd: xqjd,
          //   xfjdsum,
          //   xfsum,
          //   xfsumgain,
          //   bxxqjd,
          //   bxxfsumgain
          // }
        })

      }



    }

  },
  getXqjd: function () {
    let xn = this.data.xn
    let xq = this.data.xq
    let scores = this.data.scores[0][xn][xq]

    let xfjdsum = 0
    let xfsum = 0
    let xfsumgain = 0
    let bxxfjdsum = 0;
    let bxxfsum = 0;
    let bxxfsumgain = 0;
    for (let i = 0; i < scores.length; i++) {
      xfsum += parseFloat(scores[i].xf)
      xfjdsum += scores[i].xf * scores[i].jd
      if (scores[i].jd > 0) {
        xfsumgain += parseFloat(scores[i].xf)
      }
      if (scores[i].kcxzmc == "必修") {
        bxxfsum += parseFloat(scores[i].xf)
        bxxfjdsum += scores[i].xf * scores[i].jd
        if (scores[i].jd > 0) {
          bxxfsumgain += parseFloat(scores[i].xf)
        }
      }
    }
    let xqjd = (xfjdsum / xfsum).toFixed(2)
    let bxxqjd = (bxxfjdsum / bxxfsum).toFixed(2)
    console.log(bxxqjd)
    console.log("jd", xqjd, xfjdsum, xfsum)
    this.setData({
      xqjd: {
        jd: xqjd,
        xfjdsum,
        xfsum,
        xfsumgain,
        bxxqjd,
        bxxfsumgain
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
        wx.setStorageSync('scores', res.data)
        wx.showToast({
          title: '加载成功',
          icon: "success"
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
  toBack: async function () {

    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })


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
        wx.setStorageSync('points', res.data)
        return res.data
      case -1:
        wx.removeStorageSync('login')
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
    let extraAccounts = wx.getStorageSync('extraAccounts')
    if (extraAccounts == '') {
      wx.showToast({
        title: '您没有其他账户',
        icon: "none"
      })
      return;
    }
    console.log("ffff")
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
    if (this.data.refresh) {
      wx.showToast({
        title: '请等待此次加载完成',
        icon: "none"
      })
      return;
    }
    // wx.removeStorageSync('scores')
    // wx.removeStorageSync('points')
    this.setData({
      refresh: true
    })
    this.onLoad({
      focus: true
    })
  },
  setExtra: function () {
    let extraAccounts = wx.getStorageSync('extraAccounts')
    if (!extraAccounts) extraAccounts = []
    let extraSet = extraAccounts.map(i => ({
      username: i.data.username,
      login: {
        username: i.username,
        password: i.password
      }
    }))

    let extra = extraSet.filter(function (e) {
      if (e.show) return e
    })

    this.setData({
      extraSet,
      extra
    })
  },
  showExtra: function (e) {
    let username = e.detail
    let extraAccounts = wx.getStorageSync('extraAccounts')
    console.log(extraAccounts)

    let traget = {}
    for (let i = 0; i < extraAccounts.length; i++) {
      if (extraAccounts[i].data.username == username) {
        traget = extraAccounts[i]
        break
      }
    }

    console.log(traget);
    wx.navigateTo({
      url: '/pages/scoresExtra/scoresExtra?username=' + traget.username + '&password=' + traget.password
    })
  },
  showExtraScores: async function () {
    console.log(app);
    console.log(11);
    let extra = this.data.extra
    console.log(extra);
    let extraScores = {}

    for (let i = 0; i < extra.length; i++) {
      let item = wx.getStorageSync(`extraScores_${extra[i].username}`)
      if (!item) item = await app.getScoresFromJwxt(extra[i].login.username, extra[i].login.password, 'Modal', extra[i].username)
      console.log(i, item);
    }
  }
})