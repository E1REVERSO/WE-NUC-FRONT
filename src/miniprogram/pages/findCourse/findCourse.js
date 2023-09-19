// pages/findCourse/findCourse.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: "",
        current: 0,
        list: [],
        info: "在搜索框中输入课程名称/教师姓名可进行课程模糊搜索，数据为根据一定规则检索去重所得，仅供参考。",
        show: false,
        text: "加载中",
        loading: false,
    },
    onChange: function (e) {
        console.log(e)
        this.data.value = e.detail
    },
    onClose: function () {
        this.setData({
            show: false
        })
    },
    onAdd: function () {
        if (!this.data.detail) {
            wx.showToast({
                title: '添加失败',
                icon: "none"
            })
            return;
        }
        db.collection('otherSchedules').add({
            data: {
                ...this.data.detail,
                kcmc: this.data.detail.kcmc,
                isCustomer: true
            }
        }).then(() => {
            wx.showToast({
                title: '添加成功',
                icon: "none"
            })
        })
    },
    onClickItem: function (e) {
        this.setData({
            show: true,
            detail: this.data.list[e.currentTarget.dataset.index]
        })
    },
    onSearch() {
        console.log(this.data.value)
        // if (this.data.keyword != this.data.value) {
        //     this.setData({
        //         loading: false
        //     })
        // }
        if (!this.data.value || !this.data.value.length) {
            wx.showToast({
                title: '暂不支持全量搜索,请输入关键字',
                icon: "none"
            })
            return;
        }
        this.data.current = 0
        this.setData({
            list: [],
            keyword: this.data.value
        })
        this.next()
    },
    next() {
        if (this.data.count && this.data.count <= this.data.list.length) {
            return;
        }
        this.setData({
            loading: true
        })
        // wx.showLoading({
        //     title: '加载中',
        //     mask: true
        // })
        wx.cloud.callFunction({
            name: "getJwxt",
            data: {
                type: "findCourse",
                keyword: this.data.value,
                current: this.data.current,
                pageSize: 20
            }
        }).then(res => {
            if (res.code) {
                wx.showToast({
                    title: res.msg,
                    icon: "none"
                })
                return;
            }
            if (this.data.current == 0 && res.result.data.count == 0) {
                this.setData({
                    info: "暂无相关数据"
                })
                wx.hideLoading()
                return;
            }
            console.log(res)
            this.data.current = res.result.data.current + 1
            this.setData({
                list: this.data.list.concat(res.result.data.list),
                count: res.result.data.count
            })
            wx.hideLoading()
        }).catch(e => {
            wx.hideLoading()
            wx.showToast({
                title: '加载失败',
                icon: "none"
            })
        }).then(() => {
            this.setData({
                loading: false
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let login = wx.getStorageSync('login')
        if (!login) {
            wx.reLaunch({
                url: '/pages/login/login',
            })

            return
        }
        wx.createSelectorQuery().select('.head').boundingClientRect(rect => {
            console.log(rect)
            this.setData({
                head: rect
            })
        }).exec()
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
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.next()

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})