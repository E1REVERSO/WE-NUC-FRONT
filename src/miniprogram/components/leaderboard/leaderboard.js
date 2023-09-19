// components/leaderboard/leaderboard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // tabs: ["学分绩点", "签到次数"],
    data:[
      {username:"1802044343",name:"张三",point:"3.43"},
      {}
    ],
    active: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickTab: function (e) {
      this.setData({
        active: e.currentTarget.dataset.index
      })
    }
  }
})