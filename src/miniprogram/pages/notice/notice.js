Page({
    data: {},
    // onClickMark(e) {
    //     console.log(e);
    // },
    onLoad: function (options) {
        let t = wx.getSystemInfoSync()
        let bottom = t.safeArea.bottom
        this.setData({
            height: bottom - t.statusBarHeight - t.safeArea.top - Math.trunc((t.screenWidth / 750) * (16 + 24 + 52 + 56))
        })
        wx.setNavigationBarTitle({
            title: '文章'
        })

        var that = this

        Date.prototype.Format = function (fmt) { // author: meizz
            var o = {
                "M+": this.getMonth() + 1, // 月份
                "d+": this.getDate(), // 日
                "h+": this.getHours(), // 小时
                "m+": this.getMinutes(), // 分
                "s+": this.getSeconds(), // 秒
                "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
                "S": this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
            return fmt
        }

        // 1. 获取数据库引用
        const db = wx.cloud.database()
        const _ = db.command

        db.collection('article').doc(options.doc).get({
            success: function (res) {
                var res = res.data

                that.setData({
                    md: res.content.replace(/#换行#/g, "\n"),
                    title: res.title,
                    notice_time: new Date(res._updateTime).Format("yyyy年MM月dd日 hh:mm:ss")
                })

            },
            fail: function () {
                that.setData({
                    notice: "与服务器通信超时，无法正常提供服务",
                    ping: "超时",
                    notice_color: 'red'
                })
            }
        })

    }
})