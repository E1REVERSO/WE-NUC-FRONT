const app = getApp()

Component({
	data: {
		login: wx.getStorageSync('login'),
		activePage: 0,
		hide: false,
		list: [{
				icon: 'home',
				text: '首页',
				url: '/pages/index/index'
			},
			{
				icon: 'schedule',
				text: '课程表',
				url: '/pages/classTable/classTable'
			},
			{
				icon: 'components',
				text: '生活服务',
				url: '/pages/newHall/newHall'
			},
			{
				icon: 'my',
				text: '我',
				url: '/pages/more/more'
			}
		]
	},

	methods: {
		change(e) {
			let index = e.currentTarget.dataset.index
			wx.switchTab({
				url: this.data.list[index].url
			});
			this.setData({
				active: index
			});
		},
		onChange(e) {
			console.log(e, 'e')
			wx.switchTab({
				url: this.data.list[e.detail].url
			});
			this.setData({
				active: e.detail
			});
		},
		async init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`),
				login: wx.getStorageSync('login')
			});

			let query = this.createSelectorQuery().in(this)

			if (!app.globalSystemInfo.tabBarHeight) {
				app.globalSystemInfo.tabBarHeight = await new Promise((resolve, reject) => {
					query.select('.main').boundingClientRect().exec(function (res) {
						console.log(res);
						resolve(res[0].height)
					})
				})
			}

			this.setData({
				tabBarHeight: app.globalSystemInfo.tabBarHeight
			})

		},
		hide: function () {
			this.setData({
				hide: true
			})
		},
		show: function () {
			this.setData({
				hide: false
			})
		},
	}
});