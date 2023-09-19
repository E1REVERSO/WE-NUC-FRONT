// components/searchBar/searchBar.js
let keyWord = ''

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    disable: {
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
    onInput: function (e) {
      keyWord = e.detail.value
    },
    onSearch: function () {
      this.triggerEvent('onSubmit', keyWord)
    }
  }
})