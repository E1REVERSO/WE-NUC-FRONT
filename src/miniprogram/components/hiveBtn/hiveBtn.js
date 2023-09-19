// components/hiveBtn/hiveBtn.js
let data = []
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    canCancel: {
      type: Boolean,
      value: true
    },
    highLightIndex: {
      type: Number,
      value: -1,
      observer: function (n, o) {
        console.log(o)
        console.log(n)
      }
    },
    type: {
      type: String,
      value: "single"
    },
    data: {
      type: Array,
      value: [],
      observer: function (n, o) {
        data = n
      }
    },
    active: {
      type: Array,
      value: []
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
    onClick: function (e) {
      console.log(this.data.highLightIndex)
      let current = e.currentTarget.dataset.item
      let result = []
      switch (this.data.type) {
        case 'single':
          result = this.single(current)
          break;
        case 'multi':
          result = this.multi(current)
          break;
        case "multi-conti":
          result = this.multiConti(current)
          break;
        default:
          break;
      }
      this.triggerEvent('onChoose', result)
    },
    single: function (current) {
      let active = [current]
      if (current == this.data.active[0]) {
        if (!this.data.canCancel) return active;
        active = []
      }
      this.setData({
        active
      })
      return active
    },
    multi: function (current) {
      let active = this.data.active
      let idx = active.indexOf(current)
      if (idx != -1) active.splice(idx, 1)
      else active.push(current)
      this.setData({
        active
      })

      return active
    },
    multiConti: function (current) {
      let active = this.data.active
      let idx = active.indexOf(current)
      if (idx != -1) active.splice(idx, 1)
      else active.push(current)
      if (!this.isContinuityNum(active)) {
        active = [current]
      }

      this.setData({
        active
      })

      return active
    },
    chooseAll: function () {
      if (this.data.type == 'single') return
      this.setData({
        active: [...data]
      })
      this.triggerEvent('onChoose', this.data.active)
    },
    chooseEven: function () {
      if (this.data.type == 'single') return
      let active = []
      for (let i = 0; i < data.length; i++) {
        if (data[i] % 2 == 0) active.push(data[i])
      }
      this.setData({
        active
      })

      this.triggerEvent('onChoose', this.data.active)
    },
    chooseOdd: function () {
      if (this.data.type == 'single') return
      let active = []
      for (let i = 0; i < data.length; i++) {
        if (data[i] % 2 != 0) active.push(data[i])
      }
      this.setData({
        active
      })

      this.triggerEvent('onChoose', this.data.active)
    },
    clear: function () {
      this.setData({
        active: []
      })
      this.triggerEvent('onChoose', [])
    },
    isContinuityNum: function (array) {
      var arr = array.sort((a, b) => {
        return a - b;
      })
      var sum = 0;
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
      }
      var min = arr[0];
      var max = arr[arr.length - 1];
      var c = 0;
      for (var a = min - 1; a < max; a++) {
        c += a + 1;
      }
      if (sum == c) {
        return true;
      } else {
        return false;
      }
    }
  }
})