// miniprogram/index/pages/coupons/coupons.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '福利中心'
    })
  },

  eleme1: function () {
    wx.navigateToMiniProgram({
      appId: 'wxece3a9a4c82f58c9',
      path: 'taoke/pages/shopping-guide/index?scene=Rcl7MYu',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  eleme2: function () {
    wx.navigateToMiniProgram({
      appId: 'wxece3a9a4c82f58c9',
      path: 'pages/sharePid/web/index?scene=https://s.click.ele.me/4QUBshu',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  eleme3: function () {
    wx.navigateToMiniProgram({
      appId: 'wxece3a9a4c82f58c9',
      path: 'ele-recommend-price/pages/guest-fire/index?inviterId=39ff855&actId=1',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  meituan1: function () {
    wx.navigateToMiniProgram({
      appId: 'wxde8ac0a21135c07d',
      path: '/index/pages/h5/h5?lch=cps:waimai:5:2686b91983d72ed9130632a334a390c3:61392ztkzhetaokeztk10000:2:85797&f_userId=1&weburl=https%3A%2F%2Fclick.meituan.com%2Ft%3Ft%3D1%26c%3D1%26p%3DOWMpZ-uzIFOVe6JyOONs3dXuqV0qcAf-r-KCvHdXiNdEWBUvOJlS_ruN_mhbKosbVBifT_dtFimGwUOlcYhe3CMZjV3HrXHgSZBw2fEDyNB1MqT2KkiuwZjaZuCcN4tM44MEXdTuCgJauGyHM3TVKJHdbNXxMCyT3XLudyFT1q0iNaR062ORO8TDcZr-ZBc2WJHKtozXtw3EMPSjqPS6wPg5k3PMGK3uCTB0Jqj3f9av8-Je0JKDPQNkzTYSZ_ia07QcO0lW7X6FnsrlT1wusqNCrb5mG78bgOkNiQydq6HvToLwLBRK_2axgwbq66auglf9PIMq0cU-3ytsZAEM1MblhAXW2661i9gBaFbv8vp0uqKOVi-O0M9iMeFgyyG5ByYTCYQBEySEBeOWLNNgN-RIotAjZVm_JrsJNeKBnf8mAo2hC7CkBQTk1dOc46_iRejRNMucnPJWSzvJD7yjTcCCuJGj0Wy2M1EV1x4iQ2uuVMR3vj4b4i1w-qmg_PttrixGowdyIrSbw3nYJGIQV9dZx-Y38PwScrKti7jBhhiWYfGXM-BquDMDezkXD1u81VOY-I3eHykex6dMREkvZtNWRbH7SoCWy6KRvHmP8wumTWS1CEiPTdZuQmcDMZtDdrlJ69_vE7KJf6Qa_ZQmY8bwnH0D7TX_hzllwVtjsmSuR9Vndq-ZzA1lN1BNCy5M0O1LchkBF-Qh8QGgRhe5VuSQk_aB9OBiDGvyohLldXjEZVmb7InZTXhtoiSkPqN5miKE5-4i0yjsgSk31zfb7wvF9504PIuEZ5WS4i6M7hm_MVgpWZDz0lCeSds9xyuG&f_token=1',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  gaode: function () {
    wx.navigateToMiniProgram({
      appId: 'wxbc0cf9b963bd3550',
      path: 'shareActivity/basic_activity/page/BasicActivityPop/BasicActivityPop?page_id=4k1Khw5X8wy&gd_from=outside_coupon_&pid=mm_1984600136_2386100292_111533800010',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  taopiaopiao: function () {
    wx.navigateToMiniProgram({
      appId: 'wx553b058aec244b78',
      path: 'pages/index/index?sqm=dianying.wechat.taobaolianmeng.1.mm_1984600136_2386100292_111533800010&url=https%3A%2F%2Ft.taopiaopiao.com%2Fyep%2Fpage%2Fm%2Fstyuc69mu6',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  meituan2: function () {
    wx.navigateToMiniProgram({
      appId: 'wx2c348cf579062e56',
      path: '/index/pages/h5/h5?lch=cps:waimai:5:2686b91983d72ed9130632a334a390c3:61392ztkzhetaokeztk10000:33:85797&weburl=https%3A%2F%2Fdpurl.cn%2F4ebMVbkz&f_userId=1&f_token=1',
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '外卖红包每天领',
      imageUrl: 'cloud://cloud-gnmhb.636c-cloud-gnmhb-1303179792/static/WechatIMG4035.jpeg'
    }
  },
  onShareTimeline: function () {
    return {
      title: '外卖红包每天领',
      imageUrl: 'cloud://cloud-gnmhb.636c-cloud-gnmhb-1303179792/static/WechatIMG4035.jpeg'
    }
  }
})