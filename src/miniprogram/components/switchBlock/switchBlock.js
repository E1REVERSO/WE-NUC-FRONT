// components/switchBlock/switchBlock.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: String,
    desc: String,
    icon: String,
    prefix: {
      type: String,
      value: 'fa'
    },
    open: {
      type: Boolean,
      value: false
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
    onClick: function () {
      this.triggerEvent('onClick', this.data.name)
    },
    onLongClick: function () {
      this.triggerEvent('onLongClick')
    }
  }
})