// pages/index/index.js
const app = getApp()
const db = wx.cloud.database()
let login = ''
Page({
  data: {
    backgroundColorNav: '#3a79fe',
    broadcastShow: false,
    imgs: [],
    opacity: 0,
    menu: wx.getStorageSync('mainMenu'),
    datas: [{
        title: "个性化推荐",
        subTitle: "猜你喜欢的功能",
        children: [{
          size: "big",
          title: "疫情服务助手",
          subTitle: "当前城市",
          tag: "低风险地区",
          // background: "url(https://img1.baidu.com/it/u=3472051836,1597143695&fm=253&fmt=auto&app=138&f=JPEG?w=801&h=500)",
          background: "url(https://cloud1-0glyq4v2627b233d-1306502030.tcloudbaseapp.com/head2.png?sign=84c4e51ff10f2f08496388910df91c50&t=1649048121)",
          cardStyle: "background-size:100% 100%;background-repeat:no-repeat;",
          functions: {
            pos: "fixed",
            data: [{
                title: "疫情场所地图在这里",
                icon: "https://img2.baidu.com/it/u=2094597808,10234848&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              },
              {
                title: "打个疫苗",
                icon: "https://img2.baidu.com/it/u=2094597808,10234848&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              },
              {
                title: "打个疫苗",
                icon: "https://img2.baidu.com/it/u=2094597808,10234848&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              }
            ]
          }
        }, {
          title: "疫苗通知",
          size: "small",
          type: "primary",
          subTitle: "这是个副标题",
          tag: "这是个标签",
          image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgpic1.58cdn.com.cn%2Fglobal%2Fbig%2Fn_v2592d9d14c72b4c32811a0cb77763f6d2.jpg&refer=http%3A%2F%2Fgpic1.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651643684&t=1ade3cd48696c4e5ab712861a87f084c"
        }, {
          title: "疫苗通知",
          size: "small",
          type: "primary",
          subTitle: "这是个副标题",
          tag: "这是个",
          image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgpic1.58cdn.com.cn%2Fglobal%2Fbig%2Fn_v2592d9d14c72b4c32811a0cb77763f6d2.jpg&refer=http%3A%2F%2Fgpic1.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651643684&t=1ade3cd48696c4e5ab712861a87f084c"
        }]
      },
      {
        title: "校园资讯",
        subTitle: "截止 2022年4月30日",
        children: [{
          size: "big",
          title: "疫情服务助手",
          subTitle: "当前城市",
          tag: "低风险地区",
          background: "url(https://img1.baidu.com/it/u=3472051836,1597143695&fm=253&fmt=auto&app=138&f=JPEG?w=801&h=500)",
          functions: {
            pos: "middle",
            data: [{
                title: "疫情场所地图在这里",
                icon: "https://img2.baidu.com/it/u=2094597808,10234848&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              },
              {
                title: "打个疫苗",
                icon: "https://img2.baidu.com/it/u=2094597808,10234848&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              },
              {
                title: "打个疫苗",
                icon: "https://img2.baidu.com/it/u=2094597808,10234848&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              }
            ]
          }
        }, {
          title: "疫苗通知",
          size: "small",
          type: "primary",
          subTitle: "这是个副标题",
          tag: "这是个标签",
          image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgpic1.58cdn.com.cn%2Fglobal%2Fbig%2Fn_v2592d9d14c72b4c32811a0cb77763f6d2.jpg&refer=http%3A%2F%2Fgpic1.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651643684&t=1ade3cd48696c4e5ab712861a87f084c"
        }, {
          title: "疫苗通知",
          size: "small",
          type: "primary",
          subTitle: "这是个副标题",
          tag: "这是个",
          image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgpic1.58cdn.com.cn%2Fglobal%2Fbig%2Fn_v2592d9d14c72b4c32811a0cb77763f6d2.jpg&refer=http%3A%2F%2Fgpic1.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651643684&t=1ade3cd48696c4e5ab712861a87f084c"
        }]
      }, {
        title: "个性化推荐",
        subTitle: "猜你喜欢的功能",
        children: [{
          size: "big",
          title: "疫情服务助手",
          subTitle: "当前城市",
          tag: "低风险地区",
          // background: "url(https://img1.baidu.com/it/u=3472051836,1597143695&fm=253&fmt=auto&app=138&f=JPEG?w=801&h=500)",
          background: "url(https://cloud1-0glyq4v2627b233d-1306502030.tcloudbaseapp.com/head2.png?sign=84c4e51ff10f2f08496388910df91c50&t=1649048121)",
          cardStyle: "background-size:100% 100%;background-repeat:no-repeat;",
          functions: {
            pos: "fixed",
            data: [{
                title: "疫情场所地图在这里",
                icon: "https://img2.baidu.com/it/u=2094597808,10234848&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              },
              {
                title: "打个疫苗",
                icon: "https://img2.baidu.com/it/u=2094597808,10234848&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              },
              {
                title: "打个疫苗",
                icon: "https://img2.baidu.com/it/u=2094597808,10234848&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              }
            ]
          }
        }, {
          title: "疫苗通知",
          size: "small",
          type: "primary",
          subTitle: "这是个副标题",
          tag: "这是个标签",
          image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgpic1.58cdn.com.cn%2Fglobal%2Fbig%2Fn_v2592d9d14c72b4c32811a0cb77763f6d2.jpg&refer=http%3A%2F%2Fgpic1.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651643684&t=1ade3cd48696c4e5ab712861a87f084c"
        }, {
          title: "疫苗通知",
          size: "small",
          type: "primary",
          subTitle: "这是个副标题",
          tag: "这是个",
          image: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgpic1.58cdn.com.cn%2Fglobal%2Fbig%2Fn_v2592d9d14c72b4c32811a0cb77763f6d2.jpg&refer=http%3A%2F%2Fgpic1.58cdn.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651643684&t=1ade3cd48696c4e5ab712861a87f084c"
        }]
      },
      {
        title: "校园资讯",
        subTitle: "截止 2022年4月30日",
        children: [{
          size: "big",
          title: "疫情服务助手",
          subTitle: "当前城市",
          tag: "低风险地区",
          background: "url(https://img1.baidu.com/it/u=3472051836,1597143695&fm=253&fmt=auto&app=138&f=JPEG?w=801&h=500)",
          vote: {}
        }, {
          title: "最新通知",
          size: "small",
          type: "broadcast",
          background: "#27625d",
          // background: "#92b5ff",
          titleStyle: "color:#eee;",
          content: "关于开展第二批返校学生全员第二、三轮核酸检测和部分人员抽检工作的通知。测试测试测试长度长度长度长度",
          contentStyle: "color:#eee",
          cardStyle: "border:10rpx solid #b69054;"
        }, {
          title: "疫情服务助手",
          size: "small",
          subTitle: "哈哈哈哈",
          content: "123123"
        }]
      }
    ]
  },
  async initCardsList() {

  },
  hexToRgb(hex) {
    let rgb = '255,255,255';
    if (hex && ~hex.indexOf('#')) {
      if (hex.length === 4) {
        let text = hex.substring(1, 4);
        hex = '#' + text + text;
      }
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        rgb = `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
      }
    }
    return rgb;
  },
  onPageScroll(e) {
    if (e.scrollTop <= this.data.top) {
      this.setData({
        opacity: e.scrollTop / this.data.top
      })
    } else {
      if (this.data.opacity != 1) this.setData({
        opacity: 1
      })
    }
  },
  onLoad: async function () {
    this.getOWS()
    if (!this.data.menu) {
      this.setData({
        menu: [{
          icon: 'cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/成绩单.png',
          text: "成绩列表",
          url: "/pages/scores/scores"
        }, {
          icon: 'cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/计划书 (1).png',
          text: "培养计划",
          url: "/pages/TrainPlan/TrainPlan"
        }, {
          icon: 'cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/service/日历 (1).png',
          text: "倒数日",
          url: "/pages/days/days"
        }, {
          icon: 'cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/休息.png',
          text: "无课表",
          url: "/pages/reversedSchedule/reversedSchedule"
        }, {
          icon: 'cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/在线客服.png',
          text: "联系客服",
          url: "/pages/serviceStaff/serviceStaff"
        }]
      })
    }
    // let systemInfo = wx.getSystemInfoSync()
    // console.log(systemInfo, systemInfo.screenHeight - systemInfo.windowHeight);
    let that = this

    let task = []
    task.push(new Promise((resolve, reject) => {
      db.collection('broadcast').orderBy('_createTime', 'desc').limit(1).get().then(res => {
        this.setData({
          notice: res.data[0]
        })
        resolve(res)
      })
    }))

    task.push(new Promise((resolve, reject) => {
      db.collection('wenuc_index_swiperImgs').orderBy('order', 'asc').get()
        .then(res => {
          this.setData({
            imgs: res.data
          })
          resolve(res)
        })
    }))


    Promise.all(task).then((res) => {
      console.log(res);
      const query = this.createSelectorQuery();
      query.select('.top').boundingClientRect()
      query.exec((res) => {
        console.log(res);
        var listHeight = res[0].height; // 获取list高度
        this.setData({
          top: listHeight
        })
      })

    })

    // this.getBalance()

    this.getMainMenu()
    console.log(app.globalSystemInfo);
    this.setData({
      naviHeight: app.globalSystemInfo.navBarHeight + app.globalSystemInfo.navBarExtendHeight,
      systemInfo: app.globalData.systemInfo
    })
    // userDays


  },
  toNotice: function () {
    if (!this.data.notice.bind_text) return;
    wx.navigateTo({
      url: `/pages/notice/notice?doc=${this.data.notice.bind_text}`,
    })
  },
  onHide: function () {

  },
  onShow() {
    try{
      this.getTabBar().init();

    }catch(e){}
    this.getDays()
    // if (!wx.getStorageSync('classTable')) {
    //   let todayCourse = this.selectComponent("#todayCourse")
    //   todayCourse.setData({
    //     courses: []
    //   })
    //   todayCourse.onLoad()
    // }
  },
  getOWS: function () {
    db.collection('owsData').orderBy('time', 'desc').limit(1).get()
      .then(res => {
        this.setData({
          owsData: res.data[0]
        })
      })
  },
  getMainMenu: function () {
    db.collection('main_menu').orderBy("order", "asc").get().then(res => {
      wx.setStorage({
        key: 'mainMenu',
        data: res.data
      })
      this.setData({
        menu: res.data
      })
    })

  },
  // getBalance: function () {
  //   let login = wx.getStorageSync('login')
  //   if (!login) {
  //     this.setData({
  //       balance: '请先登陆'
  //     })
  //     return
  //   }
  //   this.setData({
  //     balance: '加载中',
  //     balanceRefresh: false
  //   })
  //   wx.cloud.callFunction({
  //     name: "getJwxt",
  //     data: {
  //       type: 'balance',
  //       ...login
  //     }
  //   }).then(res => {
  //     if (res.result.data.oddfare == "") {
  //       this.setData({
  //         balance: '点击重试',
  //         balanceRefresh: true
  //       })
  //       return;
  //     }
  //     console.log(res);
  //     this.setData({
  //       balance: parseFloat(res.result.data.oddfare).toFixed(2) + '元',
  //       balanceRefresh: false
  //     })
  //   }).catch(err => {
  //     // console.log(err);
  //     this.setData({
  //       balance: '点击重试',
  //       balanceRefresh: true
  //     })
  //   })
  // },
  getDays: function () {
    db.collection('userDays').get()
      .then(res => {
        if (!res.data.length) this.daysInit()
        this.setData({
          days: res.data
        })
      })
  },
  daysInit: function () {
    db.collection('daysInit').get()
      .then(res => {
        if (!res.data.length) {
          wx.cloud.callFunction({
            name: 'daysInit'
          }).then(res => {
            this.onShow()
          })
        }
      })
  },
  onShareAppMessage: function () {
    return {
      imageUrl: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/imgs/考试时间表 (1).png",
      title: "这么好用的小程序你确定不用一下？"
    }
  },
  toContact: function () {
    wx.navigateTo({
      url: '/pages/serviceStaff/serviceStaff',
    })
  },
})