// miniprogram/pages/createCTPermission/createCTPermission.js
let doc = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    create: true,
    showShare: false,
    options: [{
        name: '微信',
        icon: 'wechat',
        openType: 'share'
      },
      {
        name: '二维码',
        icon: 'qrcode',
        type: 'qrcode',
        description: '分享给QQ好友'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options.scene);
    if (!options.doc) {
      options.doc = options.scene
    }
    console.log(options.doc);
    if (!options.doc) {
      wx.showShareMenu({
        menus: ['shareAppMessage']
      })

      wx.hideLoading()
    } else {
      doc = options.doc
      this.setData({
        create: false
      })
    }
  },
  createShare: async function () {
    console.log(1111);
    wx.showLoading({
      title: '创建中',
    })
    let res = await wx.cloud.callFunction({
      name: 'classTable',
      data: {
        type: 'createByTarget'
      }
    })
    wx.hideLoading()
    doc = res.result._id
    this.setData({
      showShare: true
    })
  },
  onSelect: function (e) {
     console.log(e.detail.type);
    console.log(doc);
    if(e.detail.type != 'qrcode') return 
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'createQrcode',
      data: {
        scene: doc,
        page: 'pages/createCTPermission/createCTPermission',
        width: 148,
        isHyaline: false
      }
    }).then(res => {
      console.log(res.result.tempFileURL);
      this.createPoster(res.result.tempFileURL)
    })
  },
  createPoster: function (qrcode) {
    let wxml = `
    <view class="poster">
    <image class="bg" src="https://cloud1-0glyq4v2627b233d-1306502030.tcloudbaseapp.com/static/%E6%9C%AA%E6%A0%87%E9%A2%98-1-%E6%81%A2%E5%A4%8D%E7%9A%84.png?sign=cf8af7905ab031eaace8517d91879129&t=1629989742"></image>
    <image class="qrcode" src="${qrcode}"></image>
  </view>`
    let style = {
      poster: {
        width: 595,
        height: 842,
        position: 'relative',
      },
      bg: {
        width: 595,
        height: 842,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      qrcode: {
        position: 'absolute',
        bottom: 96,
        left: 224,
        height: 148,
        width: 148,
      }
    }

    let widget = this.selectComponent('.widget')
    const p1 = widget.renderToCanvas({
      wxml,
      style
    })
    p1.then((res) => {
      console.log(res);
      console.log('container', res.layoutBox)
      this.container = res
      this.extraImage(widget)
    })
  },
  extraImage(widget) {
    const p2 = widget.canvasToTempFilePath({
      fileType: 'jpg',
      quality: 1
    })
    wx.hideLoading()
    p2.then(res => {
      wx.showShareImageMenu({
        path: res.tempFilePath,
        success: (res) => {
          console.log("分享成功：", res);
        },
        fail: (err) => {
          console.log("分享失败：", err);
        },
      });
    })
  },
  onClose: function () {
    this.setData({
      showShare: false
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我授权你查看我的课程表',
      imageUrl: 'cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/imgs/shareByTarget.png',
      path: '/pages/createCTPermission/createCTPermission?doc=' + doc,
    }
  },
  accept: async function () {
    let userInfo
    await wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    }).then(async res => {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      userInfo = res.userInfo
      console.log(userInfo);
      let openid = await wx.cloud.callFunction({
        name: 'userInfo',
        data: {
          type: "record",
          avatar: userInfo.avatarUrl,
          nick: userInfo.nickName
        }
      })
      console.log(openid.result);
      wx.setStorage({
        key: 'openid',
        data: openid.result
      })
    }).then(async (res) => {
      wx.showLoading({
        title: '加载中',
      })

      return await wx.cloud.callFunction({
        name: 'classTable',
        data: {
          type: 'acceptPerByTarget',
          doc
        }
      })
    }).then(async res => {
      console.log(res);
      wx.hideLoading()
      if (!res.result) {
        wx.showToast({
          title: '该授权已被使用',
          icon: "error"
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/classTable/classTable',
          })
        }, 3000)
      } else {
        wx.showToast({
          title: '添加成功',
          icon: "success"
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/classTable/classTable',
          })
        }, 1500)
      }
    })
  }
})