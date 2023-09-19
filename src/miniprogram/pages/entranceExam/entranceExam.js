// pages/entranceExam/entranceExam.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentSearch: "",
        data: Array,
        show: false,
        search: false,
        input: "",
        searchCondition: {
            region: {
                ok: true
            },
            Is985: false,
            Is211: false,
            IsDualClass: false,
            politic: {
                ok: true
            },
            foreign: {
                ok: true
            },
            profession1: {
                ok: true
            },
            profession2: {
                ok: true
            },
        }
    },
    research: function (e) {
        this.setData({
            searchCondition: {
                region: {
                    ok: true
                },
                Is985: false,
                Is211: false,
                IsDualClass: false,
                politic: {
                    ok: true
                },
                foreign: {
                    ok: true
                },
                profession1: {
                    ok: true
                },
                profession2: {
                    ok: true
                },
            }
        })
    },
    afterInput: function (e) {
        console.log(e)
        this.setData({
            [`searchCondition.${e.currentTarget.dataset.current}`]: e.detail
        })
    },
    onBlur: function () {
        this.goSearch(this.data.input);

    },
    onBack: function () {
        wx.navigateBack({
            delta: 1,
        })

    },
    onClose: function () {
        this.setData({
            show: false
        })
    },

    onClickGreyTag: function (e) {
        switch (e.currentTarget.dataset.c) {
            case "985":
                this.setData({
                    ['searchCondition.Is985']: !this.data.searchCondition.Is985
                })
                break;

            case "211":
                this.setData({
                    ['searchCondition.Is211']: !this.data.searchCondition.Is211
                })
                break;
            case "syl":
                this.setData({
                    ['searchCondition.IsDualClass']: !this.data.searchCondition.IsDualClass
                })
                break;
        }
    },
    onFilter: function () {
        this.setData({
            show: !this.data.show,
            search: false
        })
    },
    onSearch: function () {
        this.setData({
            search: !this.data.search,
            show: false
        })
    },
    lookup: async function () {
        let keys = Object.keys(this.data.searchCondition)
        for (let i = 0; i < keys.length; i++) {
            console.log(this.data.searchCondition[keys[i]].ok)
            if (this.data.searchCondition[keys[i]].ok != undefined && !this.data.searchCondition[keys[i]].ok) {
                console.log("eee")

                let c = await wx.showModal({
                    content: "您有检索项不明确，是否进行泛检索？"
                }).then(res => {
                    return res.confirm
                })
                if (!c) return
            }
        }
        let temp_condition = {
            province_name: this.data.searchCondition.region.input ? this.data.searchCondition.region.input : null,
            politics_course: this.data.searchCondition.politic.input ? this.data.searchCondition.politic.input : null,
            major_course_1: this.data.searchCondition.profession1.input ? this.data.searchCondition.profession1.input : null,
            major_course_2: this.data.searchCondition.profession2.input ? this.data.searchCondition.profession2.input : null
        }
        let keys_temp = Object.keys(temp_condition)
        let condition = {}
        for (let i = 0; i < keys_temp.length; i++) {
            if (temp_condition[keys_temp[i]] == null) {
                continue;
            }
            condition[keys_temp[i]] = temp_condition[keys_temp[i]]
        }

        console.log(condition)
        wx.cloud.callFunction({
            name: "databaseHandle",
            data: {
                type: "searchSchool",
                condition,
                pagesize: 20,
                index: 2,
                database: "entrance_exam"
            }
        }).then(res => {
            console.log(res)
        })


    },
    goSearch: function (keywords) {
        wx.showLoading({
            title: '搜索中',
            mask: true
        })
        console.log(keywords)
        wx.cloud.callFunction({
            name: "entranceExam",
            data: {
                keywords: keywords,
                pagesize: 20,
                index: 1
            }
        }).then(res => {
            console.log(res)
            this.setData({
                currentSearch: keywords,
                data: res.result.Data,
                show: false,
                search: false
            })
            wx.hideLoading({
                success: (res) => {},
            })

        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        this.goSearch("", 20, 1)
        // wx.cloud.callFunction({
        //     name: "entranceExam",
        //     data: {
        //         keywords: "",
        //         pagesize: 20,
        //         index: 1
        //     }
        // }).then(res => {
        //     console.log(res)
        //     that.setData({
        //         data: res.result.Data
        //     })
        //     console.log(that.data.data)
        // })
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

    },






})