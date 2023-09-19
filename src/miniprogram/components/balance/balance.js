// components/balance/balance.js
Component({
  pageLifetimes: {
    show: function () {
      this.setData({
        login: wx.getStorageSync('login')
      })
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: String,
      value: null
    },
    refreshing: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick: function () {
      this.triggerEvent("onClick")
    },
    onRefresh: function () {
      this.triggerEvent("refresh")
    },
  }
})