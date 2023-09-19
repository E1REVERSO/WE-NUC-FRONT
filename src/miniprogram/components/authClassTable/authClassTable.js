// components/authClassTable/authClassTable.js
const app = getApp()
let getFmtDate

Component({
  pageLifetimes: {
    show: function () {
      this.firstLoad()
    }
  },
  lifetimes: {
    attached: function () {
      this.onLoad()
    },
    detached: function () {
      this.onHide()
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {

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
    firstLoad: function () {

    },
    onLoad: async function () {
      if (!app.globalData.init) {
        await app.setData()
      }
      getFmtDate = app.globalData.getFmtDate
      wx.showLoading({
        title: '加载中',
      })

      let permission = await wx.cloud.callFunction({
        name: 'classTable',
        data: {
          type: 'getPermission'
        }
      })

      console.log(permission);
      let data = []
      for (let i = 0; i < permission.result.length; i++) {
        data[i] = this.handle(permission.result[i])
      }

      await this.setData({
        data
      })
      wx.hideLoading()
    },
    onHide: function () {

    },
    handle: function (data) {
      if (data.acceptTime && (new Date().getTime() <= data.endTime)) data.valid = true

      data.startTime = !data.startTime ? '0000-00-00 00:00:00' : getFmtDate('yyyy-MM-dd hh:mm:ss', new Date(data.startTime))
      data.acceptTime = !data.acceptTime ? '未接受' : getFmtDate('yyyy-MM-dd hh:mm:ss', new Date(data.acceptTime))
      data.endTime = !data.endTime ? '0000-00-00 00:00:00' : getFmtDate('yyyy-MM-dd hh:mm:ss', new Date(data.endTime))

      return data
    },
    choosePermission: function (e) {
      let doc = e.currentTarget.dataset.doc
      console.log(doc)
      this.triggerEvent('choose', {
        doc
      })

    },
    setImportant: function (e) {
      let doc = e.currentTarget.dataset.doc
      wx.setStorageSync('importantClassTable', doc)
      wx.showToast({
        title: '设置成功'
      })
      this.triggerEvent('changeImportant')
    },
    createShare: function () {
      wx.navigateTo({
        url: '/pages/createCTPermission/createCTPermission',
      })
    }
  }
})