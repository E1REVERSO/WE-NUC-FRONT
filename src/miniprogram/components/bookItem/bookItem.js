const cloud = wx.cloud
const db = cloud.database()
const _ = db.command
Component({
  options: {
    virtualHost: true
  },
  properties: {
    //数据obj
    entity: {
      type: Object,
      value: {}
    },
    //是否为列表展示
    isList: {
      type: Boolean,
      value: false
    }
  },
  data: {},
  methods: {
    detail() {
      wx.navigateTo({
        url: '/pages/bookDetail/bookDetail?data=' + encodeURIComponent(JSON.stringify(this.data.entity)),
      })
      db.collection('booksTop').where({
        attachId: this.data.entity._id
      }).update({
        data: {
          score: _.inc(5)
        }
      }).then(res => {
        console.log(res)
      })
    }
  }
})