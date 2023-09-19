// components/unauthorizeBar/unauthorizeBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bottom: {
      type: Number,
      value: 0
    }
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
    toAuth: function () {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  }
})