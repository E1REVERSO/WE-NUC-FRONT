// components/associate/associate.js
let data_set = []
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        bind_database: String,
        bind_param: String,
        placeholder: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        input: "",

        ok: true
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClickItem: function (e) {
            console.log(e)
            this.setData({
                input: e.currentTarget.dataset.item._id,
                ok: true,
                tag: []
            })
        },
        onInput: function (e) {
            console.log(e.detail.value)

            let value = e.detail.value

            this.setData({
                ok: false
            })


            wx.cloud.callFunction({
                name: "databaseHandle",
                data: {
                    type: "getSimilar",
                    ...this.data,
                    search_text: value,
                    count: 3
                }
            }).then(res => {
                console.log(res)
                if (value != "") {
                    if (res.result && res.result.length) {
                        if (parseFloat(res.result[0].similar) == 1.000) {
                            this.setData({
                                tag: [],
                                ok: true
                            })
                        } else {
                            this.setData({
                                tag: res.result.filter((value) => {
                                    return value.similar != "0.000"
                                }),
                                ok: false
                            })
                        }

                    }
                } else {
                    this.setData({
                        tag: [],
                        ok: true
                    })
                }
                this.triggerEvent('afterInput', this.data)


            })
        }
    }
})