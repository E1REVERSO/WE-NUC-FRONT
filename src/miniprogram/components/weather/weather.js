// components/weather/weather.js
const amap = require("./amap-wx.js")

//获取应用实例
const app = getApp()

Component({
  pageLifetimes: {
    show: function () {
      this.firstLoad()
    }
  },
  lifetimes: {
    attached: function () {
      this.onLoad()
    },
    detached: function () {
      this.onHide()
    },
  },
  data: {
    amapPlugin: null,
    key: "6799b5f6f88d3d9fb52ac244855a8759",
    obj: {
      liveData: {}
    }
  },

  methods: {
    // 生命周期函数开始
    firstLoad: function () {
      //首次加载
    },
    onLoad: function () {
      // 加载完成

      this.data.amapPlugin = new amap.AMapWX({
        key: this.data.key
      })
      this.getWeather()



    },
    onHide: function () {
      // 准备退出
    },
    // 生命周期函数结束
    getWeather: function () {
      this.data.amapPlugin.getWeather({
        city: '140108',
        success: (data) => {
          //成功回调
          console.log(data);
          this.setData({
            obj: data
          })
        },
        fail: function (info) {
          //失败回调
          console.log(info)
        }
      })
    },
  }
})