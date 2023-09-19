// import tui from '../../common/httpRequest'
let globalData = getApp().globalData;
Page({
    data: {
        width: 0,
        height: 64, //header高度
        top: 24, //标题图标距离顶部距离
        scrollH: 0, //滚动总高度
        menuShow: false,
        popupShow: false,
        value: 1,
        collected: false
    },
    onLoad: function (options) {
        this.setData({
            data: JSON.parse(decodeURIComponent(options.data))
        })
        let obj = wx.getMenuButtonBoundingClientRect();

        this.setData({
            width: obj.left,
            height: obj.top + obj.height + 8,
            top: obj.top + (obj.height - 32) / 2
        }, () => {
            wx.getSystemInfo({
                success: (res) => {
                    this.setData({
                        scrollH: res.windowWidth
                    })
                    globalData.navigationBarWidth = obj.left || res.windowWidth
                    globalData.navigationBarHeight = obj.top + obj.height + 8
                    globalData.statusBarHeight = res.statusBarHeight;
                }
            })
        });
    },
    bannerChange: function (e) {
        this.setData({
            bannerIndex: e.detail.current
        })
    },
    previewImage: function (e) {
        let index = e.currentTarget.dataset.index;
        wx.previewImage({
            current: this.data.data.detail.pic ? this.data.data.detail.pic : 'https://cloud1-0glyq4v2627b233d-1306502030.tcloudbaseapp.com/1647137288098.jpg?sign=d8647ff8890979995adbee331d5c092b&t=1647145928',
            urls: [this.data.data.detail.pic ? this.data.data.detail.pic : 'https://cloud1-0glyq4v2627b233d-1306502030.tcloudbaseapp.com/1647137288098.jpg?sign=d8647ff8890979995adbee331d5c092b&t=1647145928']
        })
    },
    back: function () {
        wx.navigateBack();
    },








})