// components/mainMenu/mainMenu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num: {
      type: Number,
      value: 4
    },
    data: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    action: function (e) {
      var type = e.currentTarget.dataset.type
      var content1 = e.currentTarget.dataset.content1
      var content2 = e.currentTarget.dataset.content2

      if (type == '') return


      if (type == 'minip') {
        let appid = content1
        let path = content2
        console.log(appid, path);

        wx.navigateToMiniProgram({
          appId: appid,
          path: path,
          success(res) {
            console.log(res)
          },
          fail(res) {
            console.log(res)
          }
        })
      } else if (type == 'url') {
        let url = content1

        // url = encodeURIComponent(url)

        console.log(url);

        wx.navigateTo({
          url: '/pages/web/web?url=' + url,
        })
      } else if (type == 'navigate') {
        let path = content1

        wx.navigateTo({
          url: path,
        })
      }

    }
  }
})