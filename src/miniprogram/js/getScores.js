const db = wx.cloud.database()

async function fromJwxt(username = '', password = '', show = 'toast', account = '') {
  let login = {
    username,
    password
  }
  if (!username) login = wx.getStorageSync('login')
  wx.showLoading({
    title: '加载中',
  })

  let res = await wx.cloud.callFunction({
    name: 'getJwxt',
    data: {
      type: 'scores',
      ...login
    }
  }).then(res => {
    return res.result
  }).catch(e => {
    if (show == 'toast') {
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } else if (show = 'modal') {
      wx.showModal({
        content: '加载失败，请重试',
        showCancel: false,
        title: `账户${login.username}`,
      })
    }
  })

  wx.hideLoading()

  switch (res.code) {
    case 1:
      if (!account) wx.setStorageSync('scores', res.data)
      if (account) wx.setStorageSync(`extraScores_${account}`, res.data)
      wx.showToast({
        title: '加载成功',
        icon: "success"
      })
      return res.data
      break
    case -1:
      if (show == 'toast') {
        wx.showToast({
          duration: 1500,
          icon: 'none',
          title: '学号或密码错误'
        })
      } else if (show = 'modal') {
        wx.showModal({
          content: '学号或密码错误',
          showCancel: false,
          title: `账户${account}`,
        })
      }
      default:
        if (show == 'toast') {
          wx.showToast({
            duration: 1500,
            icon: 'none',
            title: res.msg
          })
        } else if (show = 'modal') {
          wx.showModal({
            content: res.msg,
            showCancel: false,
            title: `账户${account}`,
          })
        }
        return {
          main: [], minor: []
        }
  }
}

module.exports.fromJwxt = fromJwxt;