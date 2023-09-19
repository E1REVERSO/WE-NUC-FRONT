// pages/books/books.js
const cloud = wx.cloud
const db = cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        total: 0,
        current: 0,
        value: "",
        loading: false,
        noMore: false,
        text: "正在加载(图书检索耗时较长，请耐心等待)",
        text_default: "正在加载(图书检索耗时较长，请耐心等待)"
    },
    onChange: function (e) {
        this.data.value == e.detail
    },
    onSearch: function (e) {
        if (this.data.loading) {
            wx.showToast({
                title: '请等待本次检索完成',
                icon: "none"
            })
            return;
        }
        if (this.data.type == "" || this.data.type != this.data.value || (e && e.detail)) {
            this.reInit()
            this.setData({
                type: this.data.value
            })
        }
        this.setData({
            loading: true,
            noMore: false,
        })
        cloud.callFunction({
            name: "getJwxt",
            data: {
                type: "books",
                current: this.data.current,
                pageSize: 40,
                keyword: this.data.type,
                username: this.data.login.username
            }
        }).then(res => {
            console.log(res)
            res = res.result
            if (res.code) {
                if (res.code == -5) res.msg = "未检索到结果"
                wx.showToast({
                    title: res.msg,
                    icon: "none"
                })
                this.setData({
                    loading: false
                })
                return;
            }
            this.setData({
                current: res.data.current,
                total: res.data.total,
                list: this.data.list.concat(res.data.list),
                loading: false,
                type: this.data.value
            }, () => {
                wx.setNavigationBarTitle({
                    title: this.data.type + '，共检索到' + res.data.total + "条数据",
                })
                this.setData({
                    noMore: this.data.list.length >= this.data.total,
                    current: this.data.current + 1
                })
            })
        })
    },
    reInit: function () {
        this.setData({
            list: [],
            noMore: false,
            loading: false,
            current: 0,
            total: 0
        })
    },
    onGetTop: function (first) {
        if (first) {
            let storage = wx.getStorageSync('book_top')
            if (storage) {
                this.setData({
                    type: "",
                    list: storage
                })
                wx.showNavigationBarLoading()
                console.log("有储存数据，已加载成功", storage)
            }
        }
        if (this.data.type != "") {
            this.reInit()
        }
        this.setData({
            loading: true,
            text: first ? "正在初始化图书检索功能，请稍后" : this.data.text_default,
            noMore: false,
        })
        console.log("开始检索")
        wx.setNavigationBarTitle({
            title: '近期热门书籍',
        })
        cloud.callFunction({
            name: "Books",
            data: {
                type: "top",
                current: this.data.current,
                pageSize: 40
            }
        }).then(res => {
            res = res.result
            if (first) {
                wx.setStorageSync('book_top', res.data.list)
                wx.hideNavigationBarLoading()
                this.setData({
                    text: this.data.text_default
                })
            }
            if (res.code) {
                if (res.code == -5) res.msg = "未检索到结果"
                wx.showToast({
                    title: res.msg,
                    icon: "none"
                })
                this.setData({
                    loading: false
                })
                return;
            }

            console.log("检索成功", res.data.list)
            this.setData({
                current: res.data.current,
                total: res.data.total,
                list: first ? res.data.list : this.data.list.concat(res.data.list),
                loading: false,
                type: ""
            }, () => {
  
                this.setData({
                    noMore: this.data.list.length >= this.data.total,
                    current: this.data.current + 1,
                    init: true
                })
            })
        })
    },
    onChange: function (e) {
        this.data.value = e.detail
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.createSelectorQuery().select('.head').boundingClientRect(rect => {
            console.log(rect)
            this.setData({
                head: rect
            })
        }).exec()
        this.onGetTop(true)
        const login = wx.getStorageSync('login')
        if (!login) wx.reLaunch({
            url: '/pages/login/login',
        })
        this.setData({
            login
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
        if ((!this.data.noMore) && (!this.data.loading) && this.data.init) {
            switch (this.data.type) {
                case '':
                    this.onGetTop()
                    return;
                default:
                    this.onSearch()
                    return;
            }
        }

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})