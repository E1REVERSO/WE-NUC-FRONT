// components/elect/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      observer: function (n, o) {
        if (n) {
          this.setData({
            time: new Date(n._createTime).Format('yyyy-MM-dd hh:mm:ss')
          })
        }
      }
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
    toChoose: function(){
      wx.navigateTo({
        url: '/pages/bindElect/index',
      })
    }
  }
})