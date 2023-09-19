// miniprogram/pages/login/login.js
import Notify from '@vant/weapp/notify/notify';
let username = ''
let password = ''
let userInfo = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    times: 0,
    show_type: 0,
    loading: false
  },
  onCloseDialog: function () {
    this.setData({
      show: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  forgetPwd() {
    this.setData({
      show: false
    })
    wx.navigateTo({
      url: '/pages/loginMore/loginMore',
    })
  },

  onLoad: async function (options) {
    // let json_array = [{name:"hhaha"},{name:"fffff",sex:"0"}]
    // let result = json_array.map(a=>({"ffff":a.name}))
    // console.log(result)
    if (options.back) {
      this.back = true
    }
    console.log(this.back);
  },
  uninput: function (e) {
    username = e.detail.value
  },
  pwinput: function (e) {
    password = e.detail.value
  },
  login: async function () {
    if (password == '' || username == '') {
      // wx.showToast({
      //   title: '账号或密码不能为空',
      //   icon: "none"
      // })
      Notify({
        type: 'danger',
        message: '账号或密码不能为空'
      });
      return
    }
    if (this.data.loading) {
      // wx.showToast({
      //   title: '正在登陆中',
      //   icon: "none"
      // })
      Notify({
        type: 'primary',
        message: '正在登陆中，请耐心等待'
      });
      return;
    }
    // if(!await this.dialog()) return 
    this.setData({
      loading: true
    })
    this.data.times++
    // Notify({
    //   type: 'primary',
    //   message: '尝试拉取用户信息'
    // });
    let login;
    await wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    }).then(async res => {
      console.log(res)
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
      wx.setStorage({
        key: "loginData",
        data: userInfo
      })
    }).catch(err => {
      this.setData({
        loading: false
      })
      Notify({
        type: 'warning',
        message: "获取微信授权信息失败"
      });
      console.log(err)
      return false
    }).then(async res => {
      console.log(res);
      if (res == false) return false
      Notify({
        type: 'success',
        message: "拉取授权信息成功，正在登录中..."
      });
      login = await wx.cloud.callFunction({
        name: 'getJwxt',
        data: {
          type: "login",
          username,
          password
        }
      })
      console.log(login)
    }).catch(e => {
      console.log(e);
      // wx.hideLoading()
      // wx.showToast({
      //   title: '出错了请重试',
      //   icon: 'error'
      // })
      Notify({
        type: 'danger',
        message: '出错了请重试'
      });
      this.setData({
        loading: false
      })
    })

    // wx.hideLoading()



    console.log(login);
    if (!login) {
      return
    }
    let res = login.result

    switch (res.code) {
      case 1:
        if (username != '20200000' && username != '20210000') {
          if (!await wx.showModal({
              content: '请确认该学号属于你本人，请不要登陆他人账户以免造成不必要的误会',
              title: '温馨提示',
              confirmText: '是',
              cancelText: '不是'
            }).then(res => {
              return res.confirm
            })) {
            Notify({
              type: 'danger',
              message: "非本人账号，拒绝访问。"
            });
            this.setData({
              loading: false
            })
            return
          }
        }
        wx.setStorageSync('userInfo', res.data)
        wx.setStorageSync('login', {
          username,
          password
        })

        if (this.back) {
          // wx.navigateToMiniProgram({
          //   appId: 'wxd7985a0410040e3d',
          // })
          wx.navigateBackMiniProgram()
        } else {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
        default:
          // wx.showToast({
          //   duration: 1500,
          //   icon: 'none',
          //   title: res.msg
          // })
          Notify({
            type: 'warning',
            duration: 1500,
            message: res.msg
          });
          if (res.msg && res.msg.includes('密码失效')) {
            this.setData({
              show_type: 0,
              show: true
            })
          }
          if (this.data.times > 3) {
            this.setData({
              show_type: 1,
              show: true
            })
          }
          this.setData({
            loading: false
          })

          return;
    }

  },
  toServiceStaff: function () {
    wx.navigateTo({
      url: '/pages/serviceStaff/serviceStaff',
    })
  },
  toUserKnow: function () {
    wx.navigateTo({
      url: '/pages/userKnow/userKnow',
    })
  },

})