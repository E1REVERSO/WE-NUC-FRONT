// components/radioSwitch/radioSwitch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array
    },
    current: {
      type: Number,
      value: -1
    },
    currentName: {
      type: String
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
    choose: function (e) {
      console.log(e.currentTarget.dataset.idx);
      let data = {
        index: e.currentTarget.dataset.idx,
        name: this.data.items[e.currentTarget.dataset.idx]
      }
      console.log(data);
      this.triggerEvent('onChoose', data)
    }
  }
})