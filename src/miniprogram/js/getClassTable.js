const db = wx.cloud.database()

async function fromJwxt(username = '', password = '', show = 'toast', account = '', text) {
  let login = {
    username,
    password
  }
  if (!username) login = wx.getStorageSync('login')
  wx.showLoading({
    title: text ? text : '加载中',
  })

  let res = await wx.cloud.callFunction({
    name: 'getJwxt',
    data: {
      type: 'classTable',
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
  if (!res) {
    res = {
      code: 0
    }
  }
  switch (res.code) {
    case 1:
      if (!account) wx.setStorageSync('classTable', res.data)
      if (account != username) wx.setStorageSync(`extraTable_${account}`, res.data)
      wx.showToast({
        title: text ? '更新成功' : '加载成功',
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
        try {
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
        } catch (e) {
          console.log(e);
        }

        return {
          main: [], minor: []
        }
  }
}

async function getOthers(doc) {
  wx.showLoading({
    title: '加载中',
  })
  return await wx.cloud.callFunction({
    name: "classTable",
    data: {
      type: "getClassTable",
      doc
    }
  }).then(res => {
    wx.hideLoading()
    return res.result
  }).catch(e => {
    wx.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    })
    wx.hideLoading()
  })
}

async function getOtherSchedules() {
  return await db.collection('otherSchedules').count().then(res => {
    let total = res.total
    let batch = Math.ceil(total / 20)
    return batch
  }).then(async res => {
    if (!res) return []
    let data = []
    for (let i = 0; i < res; i++) {
      await db.collection('otherSchedules').limit(20).skip(i * 20).get()
        .then(res => {
          data = data.concat(res.data)
        })
    }
    return data
  })
}

module.exports.fromJwxt = fromJwxt;
module.exports.getOthers = getOthers;
module.exports.getOtherSchedules = getOtherSchedules;