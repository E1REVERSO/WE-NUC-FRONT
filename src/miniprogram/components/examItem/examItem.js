// components/examItem/examItem.js
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: Object
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
    setDays: function () {
      let kssj
      let error = false
      try {
        kssj = this.data.info.kssj.split('(')[0]
        if (new Date(kssj) == "Invalid Date") throw "error"
      } catch (e) {
        kssj = new Date().Format("yyyy-MM-dd")
        error = true
      }
      console.log(this.data.info.kssj)
      wx.showModal({
        title: '温馨提示',
        content: `您要将「${this.data.info.kcmc}」考试添加进您的倒数日中吗？${error?'该考试时间尚未安排，系统将默认设置为今天':''}`,
      }).then(res => {

        if (res.confirm) {
          wx.showLoading({
            title: '添加中',
          })

          let kcmc = this.data.info.kcmc
          if (kcmc > 11) kcmc = kcmc.slice(0, 9) + '...'
          kcmc += '考试'
          db.collection('userDays').add({
            data: {
              name: kcmc,
              date: kssj,
              repeat: 0,
              top: false
            }
          }).then(res => {
            wx.hideLoading()
            if (res._id) {
              wx.showToast({
                title: '新增成功',
              })
            }
          })
        }
      })
    }
  }
})