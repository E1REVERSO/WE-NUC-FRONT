const STORAGE_KEY = 'PLUG-ADD-MYAPP-KEY';
Component({
  properties: {
    duration: {
      type: Number,
      value: 10
    },
    custom: {
      type: Boolean,
      value: false
    }
  },
  lifetimes: {
    attached: function () {
      if (wx.getStorageSync(STORAGE_KEY)) return;
      let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
      let {
        screenWidth
      } = wx.getSystemInfoSync();
      this.setData({
        navbarHeight: rect.bottom,
        arrowR: screenWidth - rect.right + rect.width * 3 / 4 - 5,
        bodyR: screenWidth - rect.right
      })
      this.setData({
        SHOW_TOP: true
      });
      setTimeout(() => {
        this.setData({
          SHOW_TOP: false
        })
      }, this.data.duration * 1000);
    },
  },
  data: {
    SHOW_TOP: false
  },
  methods: {
    hidden: function () {
      this.setData({
        SHOW_TOP: false
      }, () => {
        wx.setStorageSync(STORAGE_KEY, true)
      });
    }
  }
})