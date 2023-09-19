// components/disciplineItem/disciplineItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loading: Boolean,
    info: {
      type: Object,
      observer: function (newVal, oldVal) {
        console.log(newVal)
        if (newVal.jxzxjhxx_id) {
          this.setData({
            loading: false
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: true,
    rowWidth: ["250rpx", "300rpx", "270rpx", "270rpx", "270rpx", "270rpx", "80rpx", "40rpx", "250rpx"]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail: function () {
      console.log(this.data.info)
      wx.navigateTo({
        url: '/pages/TrainPlanDetail/TrainPlanDetail?id=' + this.data.info.jxzxjhxx_id,
      })
    }
  }
})