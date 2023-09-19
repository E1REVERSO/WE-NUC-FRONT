// pages/peTest/peTest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentChoose: "gender",
    name: "",
    gender: "",
    grade: "",
    height: "",
    weight: "",
    lung: "",
    jump: "",
    zwtqq: "",
    run50: "",
    run00: "",
    ytxs: "",
    show: false,
    actions: [{
        name: '选项',
      },
      {
        name: '选项',
      },
      {
        name: '选项',
        subname: '描述信息',
        openType: 'share',
      },
    ],
  },
  onClickBMI() {
    wx.previewImage({
      current: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/bmi.png",
      urls: ["cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/bmi.png"],
    })
  },
  onClickLung() {
    wx.previewImage({
      current: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/肺活量.png",
      urls: ["cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/肺活量.png"],
    })
  },
  onClickJump() {
    wx.previewImage({
      current: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/立定跳远.png",
      urls: ["cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/立定跳远.png"],
    })
  },
  onClickSit() {
    wx.previewImage({
      current: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/坐位体前屈.png",
      urls: ["cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/坐位体前屈.png"],
    })
  },
  onClick50() {
    wx.previewImage({
      current: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/50.png",
      urls: ["cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/50.png"],
    })
  },
  onClick00() {
    wx.previewImage({
      current: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/1000.png",
      urls: ["cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/1000.png"],
    })
  },
  onClickYt() {
    switch (this.data.gender) {
      case "女":
        wx.previewImage({
          current: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/仰卧起坐.png",
          urls: ["cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/仰卧起坐.png"],
        })
      default:
        wx.previewImage({
          current: "cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/引体向上.png",
          urls: ["cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/icon/体测/引体向上.png"],
        })
    }

  },
  onChooseGender() {
    this.setData({
      currentChoose: "gender",
      actions: [{
        name: "男"
      }, {
        name: "女"
      }],
      show: true
    })
  },
  onChooseGrade() {
    this.setData({
      currentChoose: "grade",
      actions: [{
          name: "大一"
        }, {
          name: "大二"
        },
        {
          name: "大三"
        }, {
          name: "大四"
        }
      ],
      show: true
    })

  },
  onClose() {
    this.setData({
      show: false
    });
  },

  onSelect(event) {
    console.log(event)
    this.setData({
      [`${this.data.currentChoose}`]: event.detail.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  optionsToData: function (options) {
    let keys = Object.keys(options)
    keys.forEach(k => {

      switch (k) {
        case '身高/体重':
          this.setData({
            height: options[k].split("/")[0],
            weight: options[k].split("/")[1],
          })
          break;
        default:
          let dataName = ""
          switch (k) {
            case 'grade':
              dataName = "grade"
              break;
            case '50米':
              dataName = "run50"
              break;
            case '1000米':
              dataName = "run00"
              break;
            case '坐位体前屈':
              dataName = "zwtqq"
              break;
            case '引体向上':
              dataName = "ytxs"
              this.setData({
                gender: "男"
              })
              break;
            case '仰卧起坐':
              dataName = "ytxs"
              this.setData({
                gender: "女"
              })
              break
            case '立定跳远':
              dataName = "jump"
              break;
            case '肺活量':
              dataName = "lung"
              break;
          }
          this.setData({
            [`${dataName}`]: options[k]
          })
      }
    })
  },
  onLoad: function (options) {
    if (options) {
      console.log(options);
      this.optionsToData(options)
    }
    let userinfo = wx.getStorageSync('userInfo')

    if (userinfo) {
      let cha = new Date().getFullYear() - parseInt(userinfo.grade)
      let grad = ""
      switch (cha) {
        case 0:
          grad = "大一"
          break
        case 1:
          grad = "大二"
          break
        case 2:
          grad = "大三"
          break
        case 3:
          grad = "大四"
          break
        default:
          grad = "大四"
      }
      if (!options) {
        this.setData({
          name: userinfo.name,
          grade: grad
        })
      } else {
        this.setData({
          name: userinfo.name
        })
      }

    }
  },
  onQuery() {
    wx.cloud.callFunction({
      name: "peTest",
      data: {
        type: "calc",
        ...this.data
      }
    }).then(res => {
      console.log(res)
      wx.showModal({
        content: `总分：${res.result.aggregate.score.toFixed(2)}，等级：${res.result.aggregate.grade}`,
        title: '计算结果',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})