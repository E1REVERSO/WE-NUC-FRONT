let addTime = []
let addWeeks = []
let addDay = 0

const app = getApp()
const db = wx.cloud.database()

let login = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    showWeekEnd: wx.getStorageSync('showWeekEnd'),
    showNotThis: wx.getStorageSync('showNotThis'),
    important: wx.getStorageSync('importantClassTable'),
    beforeArr: [30, 25, 20, 15, 10, 5, 0],
    day: ['一', '二', '三', '四', '五', '六', '日'],
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    columns: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
    ],
    switchActive: 0,
    kcmc: '',
    cdmc: '',
    xm: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (!app.globalData.init) {
      await app.setData()
    }

    this.setData({
      naviHeight: app.globalSystemInfo.navBarHeight + app.globalSystemInfo.navBarExtendHeight
    })

    const query = wx.createSelectorQuery();
    query.select('.head').boundingClientRect()
    query.exec((res) => {
      console.log(res);
      var listHeight = res[0].height;
      this.setData({
        top: listHeight
      })
    })

    this.setData({
      thisWeek: app.globalData.weeks,
      choosed: app.globalData.weeks,
    })
    console.log(this.data.thisWeek)
    login = wx.getStorageSync('login')
    if (!login) {
      wx.showToast({
        title: '请登陆后使用',
      })
      return
    }

  },
  toServerStaff: function () {
    wx.navigateTo({
      url: '/pages/serviceStaff/serviceStaff',
    })
  },
  onShow: function () {
    try{
      this.getTabBar().init();

    }catch(e){}

    login = wx.getStorageSync('login')
    if (!login) {
      wx.showToast({
        title: '请登陆后使用',
        icon: "none"
      })
      return
    }
    let tip = wx.getStorageSync('classTable_tip');
    if (!tip) {
      this.setData({
        showDialog: true
      })
      wx.setStorage({
        key: "classTable_tip",
        data: true
      })
    }
    this.getPushSetting()
    this.setExtra()
    this.setClass()
  },
  setExtra: function () {
    let extraAccounts = wx.getStorageSync('extraAccounts')
    if (!extraAccounts) extraAccounts = []
    let extraSet = extraAccounts.map(i => ({
      username: i.data.username,
      show: i.showTable,
      login: {
        username: i.username,
        password: i.password
      }
    }))

    let extra = extraSet.filter(function (e) {
      if (e.show) return e
    })

    this.setData({
      extraSet,
      extra
    })
  },
  showWeekEnd: function () {
    this.setData({
      showWeekEnd: !this.data.showWeekEnd
    })
    wx.setStorageSync('showWeekEnd', this.data.showWeekEnd)
  },
  showNotThis: function () {
    this.setData({
      showNotThis: !this.data.showNotThis
    })
    wx.setStorageSync('showNotThis', this.data.showNotThis)
    this.setClass()
  },
  getPushSetting: function () {
    db.collection('pushAuth').get()
      .then(res => {
        this.setData({
          pushClass: res.data.length ? true : false,
          pushInfo: res.data[0]
        })
      })
  },
  chooseWeek: function (event) {
    this.setData({
      choosed: event.detail[0]
    })
    this.setClass()
  },
  setClass: function () {
    switch (this.data.switchActive) {
      case 0:
        this.showOwn()
        break
      case 1:
        this.showImportant()
        break
      case 2:
        this.showMinor()
        break
      case 4:
        this.showOther(this.data.otherDoc)
        break
      default:
        break
    }
  },
  switchShow: function () {
    this.data.switchShow ? this.getTabBar().show() : this.getTabBar().hide();
    this.setData({
      switchShow: !this.data.switchShow,
      settingsShow: false,
      addCourseShow: false
    })
  },
  showSettings: function () {
    this.data.settingsShow ? this.getTabBar().show() : this.getTabBar().hide();
    this.setData({
      settingsShow: !this.data.settingsShow,
      switchShow: false,
      addCourseShow: false
    })
  },
  showOtherClassTable: function (e) {
    console.log(e.detail.doc);
    let doc = e.detail.doc
    this.setData({
      otherShow: true,
      otherDoc: doc,
      switchActive: 4
    })
  },
  onClose: function () {
    this.getTabBar().show();
    this.setData({
      switchShow: false,
      settingsShow: false,
      addCourseShow: false
    })
  },
  switchPush: function () {
    let type = 'switchOn'
    if (this.data.pushClass) {
      type = 'switchOff'
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "pushClass",
      data: {
        type
      }
    }).then(res => {
      console.log(res);
      wx.hideLoading()
      this.getPushSetting()
    })
  },
  showOtherClassTable: function (e) {
    console.log(e.detail.doc);
    let doc = e.detail.doc
    this.showOther(doc)
    this.setData({
      otherShow: true,
      otherDoc: doc,
      switchActive: 4
    })
  },
  changeImportant: function () {
    this.setData({
      switchActive: 1
    })
  },
  showOwn: async function () {
    let classtable = wx.getStorageSync('classTable')

    let extra = this.data.extra
    console.log(extra);
    let extraTable = {
      minor: [],
      main: []
    }

    for (let i = 0; i < extra.length; i++) {
      let item = wx.getStorageSync(`extraTable_${extra[i].username}`)
      if (!item) item = await app.fromJwxt(extra[i].login.username, extra[i].login.password, 'Modal', extra[i].username)
      console.log(i, item);
      extraTable.minor = extraTable.minor.concat(item.minor)
      extraTable.main = extraTable.main.concat(item.main)
    }

    if (!classtable) {
      classtable = await app.fromJwxt()
      wx.hideLoading()
    }

    this.showClassTable(classtable.main.concat(await app.getOtherSchedules()).concat(extraTable.main), 'ownData')
  },
  showImportant: async function () {
    let doc = wx.getStorageSync('importantClassTable')
    console.log(doc);
    this.setData({
      important: doc ? doc : ''
    })
    if (!doc) return
    let classtable = []
    if (this.importantCT && this.importantCT.doc == doc) {
      classtable = this.importantCT.classtable
    } else {
      classtable = await app.getOthers(doc)
      this.importantCT = {
        doc,
        classtable
      }
    }
    wx.hideLoading()
    this.showClassTable(classtable, 'importantData')
  },
  showMinor: async function () {
    let classtable = wx.getStorageSync('classTable')

    let extra = this.data.extra
    console.log(extra);
    let extraTable = {
      minor: [],
      main: []
    }

    for (let i = 0; i < extra.length; i++) {
      let item = wx.getStorageSync(`extraTable_${extra[i].username}`)
      if (!item) item = await app.fromJwxt(extra[i].login.username, extra[i].login.password, 'Modal', extra[i].username)
      console.log(i, item);
      extraTable.minor = extraTable.minor.concat(item.minor)
      extraTable.main = extraTable.main.concat(item.main)
    }

    if (!classtable) {
      classtable = await app.fromJwxt()
      wx.hideLoading()
    }
    console.log(extraTable.minor);
    console.log(classtable.minor.concat(extraTable.minor));
    this.setData({
      minorClass: classtable.minor.concat(extraTable.minor)
    })
  },
  showOther: async function (doc) {
    if (!doc) return
    let classtable = []
    if (this.otherCT && this.otherCT.doc == doc) {
      classtable = this.otherCT.classtable
    } else {
      classtable = await app.getOthers(doc)
      this.otherCT = {
        doc,
        classtable
      }
    }
    wx.hideLoading()
    this.showClassTable(classtable, 'otherData')
  },
  showClassTable: function (classtable, target) {
    let showList = []
    if (this.data.showNotThis) {
      showList = classtable
    } else {
      for (let i = 0; i < classtable.length; i++) {
        if (classtable[i].weeks.includes(this.data.choosed)) {
          showList.push(classtable[i])
        }
      }
    }
    this.setData({
      [`${target}`]: showList
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onChange: function (event) {
    this.setData({
      switchActive: event.detail.index
    })
    console.log(event.detail);
    this.setClass()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    if (!wx.getStorageSync('login')) {
      wx.showToast({
        title: '请登录后使用',
        icon: "none"
      })
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      return;
    }
    // let next = await wx.showModal({
    //   title: "温馨提示",
    //   content: "点击确定进行刷新操作"
    // }).then(res => {
    //   if (res.confirm) {
    //     return true
    //   }
    //   return false
    // })
    let next = true;
    if (!next) {
      wx.stopPullDownRefresh()
      return
    }

    try {


      switch (this.data.switchActive) {
        case 0:
          await app.fromJwxt()
          let extra = this.data.extra
          for (let i = 0; i < extra.length; i++) {
            await app.fromJwxt(extra[i].login.username, extra[i].login.password, 'Modal', extra[i].username)
          }
          wx.hideLoading()
          this.showOwn()
          break
        case 1:
          delete this.importantCT
          this.showImportant()
          break
        case 2:
          await app.fromJwxt()
          for (let i = 0; i < extra.length; i++) {
            let extra = this.data.extra
            await app.fromJwxt(extra[i].login.username, extra[i].login.password, 'Modal', extra[i].username)
          }
          wx.hideLoading()
          this.showMinor()
          break
        case 3:
          let authClass = this.selectComponent("#authClass")
          authClass.onLoad()
          break
        case 4:
          delete this.otherCT
          this.showOther(this.data.otherDoc)
          break
        default:
          wx.showToast({
            title: '没什么好刷新的',
            icon: 'none'
          })
      }
      wx.stopPullDownRefresh()
    } catch (e) {

      wx.stopPullDownRefresh()
    }





  },
  chooseTime: function (e) {
    console.log(e.detail);
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "pushClass",
      data: {
        type: 'setBefore',
        before: e.detail.name
      }
    }).then(() => {
      wx.hideLoading()
      this.getPushSetting()
    })
  },
  showAddCourse: function () {
    this.data.addCourseShow ? this.getTabBar().show() : this.getTabBar().hide();
    this.setData({
      addCourseShow: !this.data.addCourseShow,
      settingsShow: false,
      switchShow: false
    })
  },
  inputFocus: function (e) {
    if (this.keyboardHeight == e.detail.height) return
    this.keyboardHeight = e.detail.height

    if (e.detail.height == 0) {
      this.inputBlur()
      return
    }

    switch (e.currentTarget.dataset.name) {
      case "kcmc":
        if (this.data.kcmcIpt) break;
        this.setData({
          kcmcIpt: true,
        })
        break
      case "cdmc":
        if (this.data.cdmcIpt) break;
        this.setData({
          cdmcIpt: true,
        })
        break
      case "xm":
        if (this.data.xmIpt) break;
        this.setData({
          xmIpt: true,
        })
        break
    }
  },
  inputBlur: function (e) {
    this.setData({
      kcmcIpt: false,
      cdmcIpt: false,
      xmIpt: false
    })
  },
  onChooseTime: function (e) {
    addTime = e.detail
    console.log(addTime);
  },
  onChooseWeeks: function (e) {
    addWeeks = e.detail
    console.log(addWeeks);
  },
  quickChoose: function (e) {
    console.log(e.currentTarget.dataset.name);
    this.weekChooser = this.selectComponent('#weekChooser')
    switch (e.currentTarget.dataset.name) {
      case "clear":
        this.weekChooser.clear()
        break
      case "all":
        this.weekChooser.chooseAll()
        break
      case "odd":
        this.weekChooser.chooseOdd()
        break
      case "even":
        this.weekChooser.chooseEven()
        break
    }
  },
  onChooseDay: function (e) {
    let day = e.detail[0]
    addDay = this.data.day.indexOf(e.detail[0]) + 1
    console.log(addDay);
  },
  addCourse: function () {

    // kcmc = ''
    // cdmc = ''
    // xm = ''
    // addTime = []
    // addWeeks = []
    // addDay = 0

    if (!this.data.kcmc.trim()) {
      wx.showToast({
        title: '课程名不能为空',
        icon: 'error'
      })
    } else if (!addDay) {
      wx.showToast({
        title: '星期几不能为空',
        icon: 'error'
      })
    } else if (!addTime.length) {
      wx.showToast({
        title: '上课时间不能为空',
        icon: 'error'
      })
    } else if (!addWeeks.length) {
      wx.showToast({
        title: '周不能为空',
        icon: 'error'
      })
    } else {
      let sections = []
      for (let i = 0; i < addTime.length; i++) {
        sections.push({
          section: addTime[i]
        })
      }
      db.collection('otherSchedules').add({
        data: {
          kcmc: this.data.kcmc,
          cdmc: this.data.cdmc,
          xm: this.data.xm,
          xqj: addDay.toString(),
          weeks: addWeeks,
          zcd: this.getRanges(addWeeks) + '周',
          sections,
          isCustomer: true
        }
      }).then(res => {
        console.log(res);
        if (res._id) {
          this.setData({
            addCourseShow: false
          })
          this.getTabBar().show()
          this.setClass()
        }

        let timeChooser = this.selectComponent('#timeChooser')
        timeChooser.clear()
        let dayChooser = this.selectComponent('#dayChooser')
        dayChooser.clear()
        let weekChooser = this.selectComponent('#weekChooser')
        weekChooser.clear()

        this.setData({
          kcmc: '',
          cdmc: '',
          xm: ''
        })

      })
    }
  },
  getRanges: function (array) {
    var ranges = [],
      rstart, rend;
    for (var i = 0; i < array.length; i++) {
      rstart = array[i];
      rend = rstart;
      while (array[i + 1] - array[i] == 1) {
        rend = array[i + 1]; // increment the index if the numbers sequential
        i++;
      }
      ranges.push(rstart == rend ? rstart + '' : rstart + '-' + rend);
    }
    return ranges.join(',');
  },
  showExtra: function (e) {
    let username = e.detail
    let extraAccounts = wx.getStorageSync('extraAccounts')

    for (let i = 0; i < extraAccounts.length; i++) {
      if (extraAccounts[i].data.username == username) {
        extraAccounts[i].showTable = !extraAccounts[i].showTable
        break
      }
    }
    console.log(
      extraAccounts
    );
    wx.setStorageSync('extraAccounts', extraAccounts)
    this.setExtra()
    this.setClass()
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

  }
})