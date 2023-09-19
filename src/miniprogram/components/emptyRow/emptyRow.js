// components/emptyRow/emptyRow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'normal'
    },
    info: {
      type: Object,
      value: {},
      observer: function (n, o) {
        console.log(n)
        this.setData({
          item: n[Object.keys(n)[0]]
        })
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

  }
})