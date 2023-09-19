//获取应用实例
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    show: {
      type: Boolean,
      value: false,
    },
    time: {
      type: Number,
      value: 0,
      observer: function (n, o) {
        if (n) {
          this.onLoad()
        }
      }
    }
  },
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
    online: "获取中",
    ping: "数据加载中",
  },

  methods: {
    onClickMember() {
      this.triggerEvent("clickStatus", {
        index: 0,
        data: this.data.online
      })
    },
    onClickStatus() {
      this.triggerEvent("clickStatus", {
        index: 1,
        data: this.data.status
      })
    },
    // 生命周期函数开始
    firstLoad: function () {
      //首次加载
    },
    onLoad: async function () {
      // 加载完成
      if (this.data.time) {
        wx.cloud.database().collection('activeMember').where({
          _createTime: _.gt(this.data.time - 5000000)
        }).count().then(res => {
          this.setData({
            online: res.total
          })
        })
      }

      wx.cloud.database().collection('serverStatus').orderBy('_createTime', 'desc').limit(1).get().then(res => {
        console.log(res)
        this.setData({
          status: res.data[0]
        })
      })
    },
    onHide: function () {
      // 准备退出
    },
    // 生命周期函数结束
  }

})