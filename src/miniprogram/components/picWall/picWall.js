// components/picWall/picWall.js
let width = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgs: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        // if (!newVal.length) return
        // let that = this
        // // 在组件实例进入页面节点树时执行
        // const query = wx.createSelectorQuery().in(this);
        // // let query1 = this.createSelectorQuery();
        // query.select('.photo-cont-item').boundingClientRect()
        // // query.selectViewport().scrollOffset()
        // query.exec((res) => {
        //   console.log(res);
        //   width = res[0].width; // 获取list高度

        //   let ani = wx.createAnimation({
        //     duration: 3000,
        //     timingFunction: 'linear',
        //     delay: 0
        //   })

        //   ani.translateX(-width / 2).step({
        //     duration: 16000
        //   })
        //   // ani.translateX(0).step({
        //   //   duration: 0
        //   // })
        //   that.setData({
        //     ani: ani.export()
        //   })
        //   // let flag = false

        //   setInterval((() => {
        //     // ani2.translateX(0).step({
        //     //   duration: 0
        //     // })
        //     ani.translateX(0).step({
        //       duration: 0
        //     })

        //     ani.translateX(-width / 2).step({
        //       duration: 16000
        //     })


        //     that.setData({
        //       ani: ani.export()
        //     })

        //     // console.log(new Date().getTime())
        //     // ani.translateX(0).step()
        //     // that.setData({
        //     //   ani: ani.export()
        //     // })
        //     // console.log("exe")
        //     // // ani.translateX(-width / 2).step()
        //     // that.setData({
        //     //   ani: ani.export()
        //     // })




        //     console.log(new Date().getTime())
        //   }).bind(that), 16000)

        // animate()
        // animate1()



        // function animate() {
        //   that.animate('.animation-1', [{
        //     translateX: 0
        //   }, {
        //     translateX: -width/2
        //   }], 16000, () => {
        //     that.clearAnimation('.animation-1', function () {
        //       animate()
        //     })
        //   })
        // }

        // function animate1() {
        //   that.animate('.animation-2', [{
        //     translateX: 0
        //   }, {
        //     translateX: -width/2
        //   }], 16000, () => {
        //     that.clearAnimation('.animation-2', function () {
        //       animate1()
        //     })
        //   })
        // }

        //     })
        //   }
      }
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

        url = encodeURIComponent(url)

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


// console.log("exe")
//           let ani = wx.createAnimation({
//             duration: 3000,
//             timingFunction: 'linear',
//             delay: 0,
//             transformOrigin: "100% 0 0"

//           })
//           let ani2 = wx.createAnimation({
//             duration: 0,
//             timingFunction: 'step-start',
//             delay: 0,

//           })
//           ani.translateX(-width / 2).scale().step()
//           // that.setData({
//           //   ani: ani.export()
//           // })
//           that.setData({
//             ani: ani.export(),
//             ani2: ani2.export()
//           })
//           // let flag = false

//           setInterval((() => {
//             ani2.translateX(0).step({
//               duration: 2000
//             })
//             ani.translateX(-width / 2).step({
//               duration: 3000
//             })




//             // console.log(new Date().getTime())
//             // ani.translateX(0).step()
//             // that.setData({
//             //   ani: ani.export()
//             // })
//             // console.log("exe")
//             // // ani.translateX(-width / 2).step()
//             // that.setData({
//             //   ani: ani.export()
//             // })




//             console.log(new Date().getTime())
//           }).bind(that), 3000)







//           console.log(width)

//           // ani.translateX(0).step()
//           // this.setData({
//           //   ani: ani.export()
//           // })



//           // let d = setInterval((() => {
//           //   console.log("exe")
//           //   let ani = wx.createAnimation({
//           //     duration: 160000,
//           //     timingFunction: 'linear',
//           //     delay: 0
//           //   })
//           //   ani.translateX(-width).step()
//           //   this.setData({
//           //     ani: ani.export()
//           //   })

//           // }).bind(this), 16000)