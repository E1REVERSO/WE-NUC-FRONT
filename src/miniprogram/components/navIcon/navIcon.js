// components/navIcon/navIcon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    prefix: {
      type: String,
      value: 'fa'
    },
    iconName: String,
    num: String,
    type: String,
    navigateTo: String,
    url: String
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
    tap: function () {
      switch (this.data.type) {
        case 'back':
          wx.navigateBack()
          break
        case 'navigateTo':
          wx.navigateTo({
            url: this.data.url,
          })
          break
        default:
          this.triggerEvent('tap')
          break
      }
    }
  }
})