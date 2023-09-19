// pages/activities/lottery/lottery.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        create: true,
        showShare: false,
        options: [{
                name: '微信',
                icon: 'wechat',
                openType: 'share'
            },
            {
                name: '二维码',
                icon: 'qrcode',
                type: 'qrcode',
                description: '分享给QQ好友'
            },
        ],
        inputValue: '', //搜索的内容
        //轮播图
        movies: [],
        over: false

    },


    onClickButton: async function (e) {


        // this.authorized()
        let that = this
        console.log(e)
        this.setData({
            loading: true
        })
        if (this.data.isMine) {
            this.setData({
                showShare: true,
                loading: false
            })
        } else {
            await wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            }).then(async res => {
                console.log(res)
                wx.showLoading({
                    title: '加载中',
                    mask: true
                })
                let userInfo = res.userInfo
                console.log(userInfo);
                let openid = await wx.cloud.callFunction({
                    name: 'userInfo',
                    data: {
                        type: "record",
                        avatar: userInfo.avatarUrl,
                        nick: userInfo.nickName
                    }
                })
                wx.setStorage({
                    key: 'openid',
                    data: openid.result
                })

            })
            let res = await new Promise(async (resolve, reject) => {
                resolve(await wx.cloud.callFunction({
                    name: "activityHandle",
                    data: {
                        type: "attend",
                        id: that.data.indi_data._id
                    }
                }))
            })
            wx.getUserProfile({
                desc: 'desc',
            })
            if (res.result.status != "normal") {


                switch (res.result.status) {

                    case 'full':
                        
                        break
                    case 'unauthorized':




                        break
                    case 'notToMine':
                        wx.showToast({
                            title: '不能为自己助力',
                        })
                        return false

                }


                // wx.showToast({
                //     title: res.result.msg,
                //     icon: "none",
                // })
                this.setData({
                    loading: false
                })
                wx.hideLoading({
                    success: (res) => {},
                })
                let modal = await wx.showModal({
                    title: "温馨提示",
                    content: res.result.msg,
                    confirmText: "看看我的",
                    showCancel: false
                }).then(res => {

                    return res.confirm
                })
                console.log(res)
                if (modal) {
                    wx.navigateTo({
                        url: '/pages/activities/lottery/lottery?scene=' + res.result.data._id,
                    })
                }
                return false;
            }
            this.setData({
                loading: false
            })
            let modal = await wx.showModal({
                title: "温馨提示",
                content: "助力成功",
                confirmText: "我也想要",
                showCancel: false
            }).then(res => {
                return res.confirm
            })

            wx.navigateTo({
                url: '/pages/activities/lottery/lottery?scene=' + res.result.data._id,
            })
            console.log(res)

            this.onLoad({
                scene: this.data.indi_data._id
            })

        }


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.scene
        //判断状态
        if (!id) {
            wx.showToast({
                title: "活动不存在",
                mask: true,
                duration: 2000
            }).then(() => {
                setTimeout(function () {
                    wx.reLaunch({
                        url: '/pages/index/index',
                    })
                }, 1000)
            })
        }
        wx.showLoading({
            title: '请稍等',
            mask: true
        })
        wx.cloud.callFunction({
            name: "activityHandle",
            data: {
                type: "info",
                id
            }
        }).then(res => {
            console.log(res)
            if (res.result.status != "normal") {
                console.log("fff")
                wx.showToast({
                    title: res.result.msg,
                    icon: 'error',
                    mask: false,
                    duration: 1000
                }).then(() => {
                    this.setData({
                        over: true
                    })
                    // setTimeout(function () {
                    //     wx.reLaunch({
                    //         url: '/pages/index/index',
                    //     })
                    // }, 1000)
                })
            }
            console.log(res.result.data)
            this.setData({
                indi_data: res.result.data.indi_activity,
                data: res.result.data.activity,
                isMine: res.result.data.isMine,
                movies: res.result.data.activity.image.map(a => ({
                    url: a
                }))
            })
            console.log(this.data.movies)
            wx.hideLoading({
                success: (res) => {},
            })
        })

    },


    onSelect: function (e) {
        console.log(e.detail.type);
        if (e.detail.type != 'qrcode') return
        wx.showLoading({
            title: '加载中',
        })
        wx.cloud.callFunction({
            name: 'createQrcode',
            data: {
                scene: this.data.indi_data._id,
                page: 'pages/activities/lottery/lottery',
                width: 148,
                isHyaline: false
            }
        }).then(res => {
            console.log(res.result.tempFileURL);
            this.createPoster(res.result.tempFileURL)
        })
    },
    createPoster: async function (qrcode) {
        let text = ""
        for (let i = 0; i < this.data.data.reward.length && i <= 3; i++) {
            text += `${this.data.data.reward[i].reward} : ${this.data.data.reward[i].name}\n`
        }
        console.log(text)
        let fileList = this.data.data.reward.map(a => a.image)
        console.log(fileList)
        let image = await wx.cloud.getTempFileURL({
            fileList: fileList
        })
        let bg = await wx.cloud.getTempFileURL({
            fileList: ['cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/imgs/放的地方.png']
        })
        console.log(bg)
        bg = bg.fileList
        image = image.fileList
        console.log(image[0].tempFileURL)
        console.log(image[1].tempFileURL)
        console.log(qrcode)
        console.log(bg[0].tempFileURL)
        let wxml = `
       <view class="poster">

       <image class="bg" src="${bg[0].tempFileURL}"></image>
       <image class="c1" src="${image[0].tempFileURL}"></image>
       <image class="c2" src="${image[1].tempFileURL}"></image>
       <text class="text">
       ${text}
       </text>
       <image class="qrcode" src="${qrcode}"></image>
     </view>`
        let style = {
            poster: {
                width: 465,
                height: 827,
                position: 'relative',
            },
            bg: {
                width: 465,
                height: 827,
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            c1: {
                position: 'absolute',
                top: 204,
                left: 64,
                height: 186,
                width: 186,
                borderRadius: 16
            },
            c2: {
                position: 'absolute',
                top: 284,
                right: 64,
                height: 186,
                width: 186,
                borderRadius: 16
            },
            text: {
                position: 'relative',
                top: 406,
                left: 34,
                height: 264,
                width: 166,
                fontSize: 18,
                color: "black"
            },
            qrcode: {
                position: 'absolute',
                bottom: 42,
                left: 174,
                height: 116,
                width: 116,
                borderRadius: 16
            }
        }

        let widget = this.selectComponent('.widget')
        const p1 = widget.renderToCanvas({
            wxml,
            style
        })
        console.log(p1)
        p1.then((res) => {
            console.log(res);
            console.log('container', res.layoutBox)
            this.container = res
            this.extraImage(widget)
        })
    },
    extraImage(widget) {
        const p2 = widget.canvasToTempFilePath({
            fileType: 'jpg',
            quality: 1
        })
        console.log(p2)
        wx.hideLoading()
        p2.then(res => {
            wx.showShareImageMenu({
                path: res.tempFilePath,
                success: (res) => {
                    console.log("分享成功：", res);
                },
                fail: (err) => {
                    console.log("分享失败：", err);
                },
            });
        })
    },
    onClose: function () {
        this.setData({
            showShare: false
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
        return {
            title: '快来帮我助力拿奖品！',
            imageUrl: 'cloud://cloud1-0glyq4v2627b233d.636c-cloud1-0glyq4v2627b233d-1306502030/imgs/卡通手绘七夕福利礼物 (1).png',
            path: '/pages/activities/lottery/lottery?scene=' + this.data.indi_data._id,
        }
    }
})