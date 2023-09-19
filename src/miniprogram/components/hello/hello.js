// components/hello/hello.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
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
    showImg: function () {
      wx.previewImage({
        urls: [`https://img.owspace.com/Public/uploads/Download/${this.data.info.file}.jpg?ver=375`],
        current: `https://img.owspace.com/Public/uploads/Download/${this.data.info.file}.jpg?ver=375`,
        showmenu: true
      })
    }
  }
})