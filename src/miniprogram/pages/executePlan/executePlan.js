// pages/executePlan/executePlan.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show_data: {},
        show: false,
        recalc: 1,
        scrollTop: 0,
        container: null
    },
    onClose: function () {
        this.setData({
            show: false,
            // show_data: {}
        })
    },
    onClickCell: function (e) {
        // console.log(e.currentTarget.dataset.item)
        this.setData({
            show: true,
            show_data: e.currentTarget.dataset.item
        })
    },
    onScroll: function (e) {
        console.log(e.detail)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        if (!wx.getStorageSync('login')) {
            wx.reLaunch({
                url: '/pages/login/login',
            })
            return;
        }
        let data = wx.getStorageSync('executePlan')
        this.setData({
            data
        })
        if (!data) {
            await this.getData()
        }
        this.setData({
            total: this.data.data.reduce((prev, cur, index) => {
                if (index == 1) {
                    return prev.kcList ? prev.kcList.length : 0
                }
                return prev + (cur.kcList ? cur.kcList.length : 0)
            })
        }, () => {
            // this.setData({
            //     recalc: 2 //recalc改变表示需要重新计算
            // })
            let container = []
            for (let i = 0; i < this.data.data.length; i++) {
                container.push(() => wx.createSelectorQuery().select(`#container_${i}`));
            }
            this.setData({
                container
            })
        })

    },
    async getData() {
        wx.showLoading({
            title: '获取中'
        })
        let data = await wx.cloud.callFunction({
            name: "getJwxt",
            data: {
                type: "execute",
                ...wx.getStorageSync('login')
            }
        }).then(res => {
            let result = res.result
            console.log(result)
            if (result.code != 1) {
                return result
            }
            return {
                code: 0,
                data: result.data,
                msg: "加载成功"
            }
        }).catch(e => {
            return {
                code: -2,
                msg: "未知错误"
            }
        })
        wx.hideLoading()
        if (data.code) {
            wx.showToast({
                title: result.msg,
                icon: "none"
            })
            return;
        }
        wx.showToast({
            title: "加载成功"
        })
        data = data.data
        wx.setStorageSync('executePlan', data)
        this.setData({
            data
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
        wx.stopPullDownRefresh()
        this.getData()
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