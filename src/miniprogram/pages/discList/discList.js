// pages/discList/discList.js
const db = wx.cloud.database()
const _ = db.command
let total = 0
let disName = ""
let disListWhere
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "搜索查看专业列表",
    infoShow: true,
    onSearch: false,
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this
    this.search({
      detail: ""
    }).then(res => {
      this.setData({
        onSearch: false
      })
    })

  },
  search: async function (e) {
    this.setData({
      result: [],
      onSearch: true
    })
    let that = this
    disName = e.detail
    console.log(e)
    console.log(`输入了${disName}`)

    if (!disName) {
      disListWhere = db.collection('disciplineList').orderBy("njmc", "desc")
    } else {
      disListWhere = db.collection('disciplineList').where(_.or([{
        "zymc": db.RegExp({
          regexp: `.*${disName}.*`,
          options: 'i',
        })
      }, {
        "zyh_id": db.RegExp({
          regexp: `.*${disName}.*`,
          options: 'i',
        })
      }])).orderBy("njmc", "desc")

    }

    total = await disListWhere.count()
    total = total.total

    this.setData({
      onSearch: false
    })
    // let disciplineItem = that.selectComponent('disciplineItem')
    //     disciplineItem.setData({
    //       loading: false
    //     })
    if (!total) {
      this.setData({
        infoShow: true,
        info: "未查询到相关专业"
      })
      return;
    }
    // let pageTotal = Math.ceil(tempPageTotal.total / 20)
    // console.log(pageTotal)

    // .skip(0).get().then(res => {
    //   console.log(res)
    // })
    this.getData(disName)
  },
  getData: function (disName) {
    this.setData({
      infoShow: false
    })
    if (this.data.result.length >= total) {
      return
    }

    disListWhere.skip(this.data.result.length).limit(20).get().then(res => {
      this.setData({
        result: this.data.result.concat(res.data)
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(disName);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})