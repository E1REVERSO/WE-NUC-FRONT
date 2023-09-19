Component({
  lifetimes: {
    attached: function () {
      this.setData({
        login: wx.getStorageSync('login')
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    userinfo: {
      type: Object,
      value: {}
    },
    noAvatar: {
      type: Boolean,
      value: false
    },
    loginData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {},


  /**
   * 组件的方法列表
   */
  methods: {
    toLogin: function () {
      wx.navigateTo({
        url: "/pages/login/login"
      })
    },
    onClick: function () {
      if (this.data.userinfo) {
        this.triggerEvent('onClick', this.data.userinfo)
      } else {
        this.toLogin();
      }
    }
  }
})