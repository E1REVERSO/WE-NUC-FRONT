// pages/more/more.js
const app = getApp()

Page({
  /**
   * 组件的初始数据
   */
  data: {
    navigate: [{
      url: "/pages/tabbar/index/index",
      type: "switchTab",
      text: "关于我们"
    }],
  },
  onCloseDialog: function () {
    this.setData({
      show: false
    })
  },
  onClickStatus: function (e) {
    console.log(e.detail)
    let index = e.detail.index
    this.setData({
      show: true,
      showType: index,
      showData: e.detail.data
    })
  },
  clearMainClass: function () {
    // wx.cloud.database().collection('otherSchedules').count().then(res => {
    //   console.log(res)
    // })
    wx.showModal({
      // cancelColor: 'cancelColor',
      title: "敏感操作",
      content: "您是否要删除您的所有自定义课程？（该操作不可逆）"
    }).then(res => {
      if (res.confirm) {
        wx.cloud.database().collection('otherSchedules').where({
          _openid: null
        }).remove().then(res => {
          console.log(res)
          wx.showToast({
            title: '您成功删除' + res.stats.removed + "个课程",
            icon: "none"
          })
        }).catch(e => {
          wx.showToast({
            title: '删除失败',
            icon: "none"
          })
        })
      }
    })

  },
  /**
   * 组件的方法列表
   */
  onShow() {
    try{
      this.getTabBar().init();

    }catch(e){}

    this.setData({
      time: new Date().getTime(),
      serTime: new Date().Format('yyyy-MM-dd hh:mm:ss'),
      userinfo: wx.getStorageSync('userInfo'),
      loginData: wx.getStorageSync('loginData')
    })

    // let showNotThis = wx.getStorageSync('showNotThis')
    // this.setData({
    //   showNotThis: showNotThis
    // })


  },

  onClickOpenid() {
    wx.setClipboardData({
      data: this.data.openid,
    })
  },
  showNotThis() {
    this.setData({
      showNotThis: !this.data.showNotThis
    })
    wx.setStorageSync('showNotThis', this.data.showNotThis)
  },
  onLoad: function () {
    console.log(this.data.showNotThis)
    wx.setNavigationBarTitle({
      title: '更多',
    })
    this.setData({
      openid: wx.getStorageSync('openid')
    })
  },
  onHide: function () {

  },
  clearAllStorage: function () {
    let info = wx.getStorageInfoSync()
    info = info.keys
    for (let i = 0; i < info.length; i++) {
      if (info[i] != 'login' && info[i] != 'openid' && info[i] != 'userInfo' && info[i] != 'showNotThis') {
        wx.removeStorage({
          key: info[i],
        })
      }
    }

    wx.showToast({
      title: '清空成功！',
    })
  },
  clearCTStorage: function () {
    wx.removeStorage({
      key: 'classTable',
    })
    let extra = wx.getStorageSync('extraAccounts')
    for (let i = 0; i < extra.length; i++) {
      wx.removeStorage({
        key: `extraTable_${extra[i].data.username}`,
      })
    }
    wx.showToast({
      title: '清空成功！',
    })
  },
  cancelImportantCT: function () {
    wx.removeStorage({
      key: 'importantClassTable',
    })
    wx.showToast({
      title: '操作成功！',
    })
  },
  logout: function () {
    wx.showModal({
      title: '温馨提示',
      content: '退出登录后，你的所有数据（登陆信息、设置等）将全部清空',
      showCancel: true,
    }).then(res => {
      console.log(res);
      if (res.confirm) {
        wx.clearStorage({
          success: (res) => {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          },
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      imageUrl: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/imgs/考试时间表 (1).png",
      title: "这么好用的小程序你确定不用一下？"
    }
  }
})