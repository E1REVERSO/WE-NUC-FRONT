// pages/newHall/newHall.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balanceRefresh: false,
        interval: 5
    },
    toCoupons: function () {
        wx.navigateTo({
            url: '/pages/coupons/coupons',
        })
    },
    toGD: function () {
        wx.navigateTo({
            url: '/pages/coupons/coupons',
        })
    },
    showMap: function () {
        wx.previewImage({
            current: 'cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/QQ20210916-1.jpg', // 当前显示图片的http链接
            urls: ['cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/QQ20210916-1.jpg'] // 需要预览的图片http链接列表
        })
    },
    startInterval(){
        setInterval(()=>{
            if(this.data.interval < 5)
            this.data.interval ++
        },1000)
    },
    onRefreshBalance: function () {
        if(this.data.interval < 5){
            wx.showToast({
                title: '请5秒后再试',
                icon: "none"
            })
            return;
        }
        if (this.data.balanceRefresh) {
            wx.showToast({
                title: '加载中，请稍后',
                icon: "none"
            })
            return;

        }
        let login = wx.getStorageSync('login')
        this.setData({
            balanceRefresh: true
        })
        this.startInterval()
        wx.cloud.callFunction({
            name: "getJwxt",
            data: {
                type: 'balance',
                ...login
            }
        }).then(res => {
            if (res.result.data.oddfare == "") {
                if (this.data.balance == "获取失败")
                    wx.showToast({
                        title: '获取一卡通余额失败',
                        icon: "none"
                    })
                this.setData({
                    balance: '获取失败',
                    balanceRefresh: false
                })
                return;
            }
            console.log(res);
            this.setData({
                balance: parseFloat(res.result.data.oddfare).toFixed(2) + '元',
                balanceRefresh: false,
                interval : 0
            })
            wx.setStorageSync('balance', parseFloat(res.result.data.oddfare).toFixed(2) + '元')
        }).catch(err => {
            if (this.data.balance == "获取失败")
                wx.showToast({
                    title: '获取一卡通余额失败',
                    icon: "none"
                })
            this.setData({
                balance: '获取失败',
                balanceRefresh: false
            })
        })
    },
    initBalance: function () {
        this.setData({
            balance: '加载中',
            balanceRefresh: false
        })
        this.onRefreshBalance()

    },
    toContact: function () {
        wx.navigateTo({
            url: '/pages/serviceStaff/serviceStaff',
        })
    },
    toHall: function () {
        wx.navigateTo({
            url: '/pages/hall/hall',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _balance = wx.getStorageSync('balance')
        let login = wx.getStorageSync('login')
        if (_balance) {
            this.setData({
                balance: _balance
            })
        } else {
            if (login) {
                this.initBalance()
            }
        }
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
        try{
            this.getTabBar().init();
      
          }catch(e){}


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