// components/scoreItem/scoreItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready: function () {
    this.setData({
      xf: parseFloat(this.data.obj.xf).toFixed(1)
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})