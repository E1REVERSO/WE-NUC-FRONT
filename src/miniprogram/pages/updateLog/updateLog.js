// miniprogram/pages/updateLog/updateLog.js
Page({

  /**
   * 页面的初始数据
   */

  // 标明日期（要用上面说过的规范）
  // 标明分类（采用英文）规范如下：
  // 'Added' 添加的新功能
  // 'Changed' 功能变更
  // 'Deprecated' 不建议使用，未来会删掉
  // 'Removed' 之前不建议使用的功能，这次真的删掉了
  // 'Fixed' 改的bug
  // 'Security' 改的有关安全相关bug
  data: {
    data: [{
        version: '1.9.4',
        date: '2022-03-23',
        info: [{
          icon: 'A',
          text: '增加服务电话查看及查询功能'
        }, {
          icon: 'A',
          text: '增加课程表获取机制相关提示'
        }, {
          icon: 'A',
          text: '增加个人主页中在线人数和服务器状态卡片'
        }, {
          icon: 'C',
          text: '修改登陆时的UE反馈，增加常见提示'
        }, {
          icon: 'F',
          text: '修复在未登录状态无法点击到用户协议的BUG'
        }, {
          icon: 'F',
          text: '修复在小程序初始化过程中用户切换页面导致的首页排版加载错乱的BUG'
        }]
      }, {
        version: '1.9.3',
        date: '2022-03-21',
        info: [{
          icon: 'A',
          text: '增加空教室查询中大小节次的切换控制'
        }, {
          icon: 'C',
          text: '修改教学执行计划中子标题为吸顶效果'
        }, {
          icon: 'C',
          text: '修改教学执行计划中部分图标的显示'
        }]
      }, {
        version: '1.9.2',
        date: '2022-03-21',
        info: [{
          icon: 'A',
          text: '增加教学执行计划查询功能'
        }, {
          icon: 'C',
          text: '优化绩点查询页面为平滑过渡效果'
        }, ]
      }, {
        version: '1.9.1',
        date: '2022-03-14',
        info: [{
          icon: 'A',
          text: '增加图书检索功能中图书热度显示、热门书籍缓存异步加载'
        }, {
          icon: 'A',
          text: '增加培养计划下拉刷新，并实时同步至云端'
        }, {
          icon: 'C',
          text: '图书检索单页数量上调至40'
        }, {
          icon: 'C',
          text: '下调登陆后课程表获取尝试次数到1次'
        }, {
          icon: 'C',
          text: '更改连续打开小程序预热机制触发条件'
        }, {
          icon: 'F',
          text: '尝试修复部分连续加载导致的频闪现象'
        }, {
          icon: 'S',
          text: '关闭图书检索中对全量搜索的支持'
        }]
      }, {
        version: '1.9.0',
        date: '2022-03-13',
        info: [{
          icon: 'A',
          text: '增加图书检索功能（暂时只支持书名检索）'
        }, {
          icon: 'A',
          text: '在图书检索中融合图书详细信息功能（api来自进制数据）'
        }, {
          icon: 'A',
          text: '增加了用户打开程序后账号的预热机制'
        }, {
          icon: 'C',
          text: '更改绩点页面导航条颜色'
        }, {
          icon: 'F',
          text: '修复后端线程池溢出导致的崩溃bug'
        }, {
          icon: 'F',
          text: '修复了成绩的缓存在刷新失败后删除的bug'
        }]
      }, {
        version: '1.8.0',
        date: '2022-03-12',
        info: [{
          icon: 'A',
          text: '服务器配置升级'
        }, {
          icon: 'A',
          text: '添加生活服务页面（原服务中心引导页）'
        }, {
          icon: 'C',
          text: '后端算法多线程重构（测试阶段）'
        }, {
          icon: 'C',
          text: '更改“我”页面中个人卡片样式'
        }, {
          icon: 'C',
          text: '移动查询一卡通余额模块到生活服务页面'
        }, {
          icon: 'C',
          text: '更改课程表当天所在列背景颜色'
        }, {
          icon: 'C',
          text: '更改福利中心内容'
        }, {
          icon: 'C',
          text: '更改首页排版'
        }]
      }, {
        version: '1.7.0',
        date: '2022-03-05',
        info: [{
            icon: 'A',
            text: '添加蹭课功能(聚合检索、高亮显示、一键添加)'
          }, {
            icon: 'A',
            text: '添加自定义课程显示标识及显示信息'
          }, {
            icon: 'A',
            text: '添加一键删除自定义课程功能（个人中心）'
          }, {
            icon: 'F',
            text: '修复考试时间未安排添加倒数日时间出错的问题'
          }, {
            icon: 'F',
            text: '修复自动获取课程表信息缓存管理出现的问题'
          }, {
            icon: 'F',
            text: '修复课程表日历在跨月周次当天显示不高亮的问题'
          },
          {
            icon: 'F',
            text: '修复课程表、今日课程、无课表、课程推送冬夏令时上课时间切换有误问题'
          }
        ]
      }, {
        version: '1.6.1',
        date: '2022-03-02',
        info: [{
          icon: 'A',
          text: '增加每周自动刷新获取课程表机制'
        }]
      }, {
        version: '1.6.0',
        date: '2021-10-18',
        info: [{
          icon: 'A',
          text: '新增「就餐指数」功能，可实时查看餐厅就餐情况'
        }, {
          icon: 'A',
          text: '「我」页面中新增用户身份码显示'
        }, {
          icon: 'C',
          text: '重构Tabbar'
        }, {
          icon: 'C',
          text: '重新绘制服务中心图标'
        }, {
          icon: 'C',
          text: '「今日课程」组件中显示自定义课程'
        }, {
          icon: 'C',
          text: '服务中心地图卡片移至「高清地图」按钮页面'
        }, {
          icon: 'C',
          text: '服务中心更名功能大厅'
        }, {
          icon: 'C',
          text: '服务中心实现方式全部更换，可实时参照云端实时同步'
        }]
      }, {
        version: '1.5.1',
        date: '2021-10-17',
        info: [{
          icon: 'C',
          text: '文章模板页优化'
        }, {
          icon: 'C',
          text: '体测计算器优化重构'
        }]
      }, {
        version: '1.5.0',
        date: '2021-10-16',
        info: [{
          icon: 'A',
          text: '新增体育管理系统成绩查询功能'
        }, {
          icon: 'A',
          text: '新增体测计算器功能'
        }, {
          icon: 'F',
          text: '修复了未登录课表下拉刷新导致无法点击的bug'
        }]
      },
      {
        version: '1.4.10',
        date: '2021-10-15',
        info: [{
          icon: 'A',
          text: '新增宿舍楼洗衣机状态查询功能'
        }]
      },
      {
        version: '1.4.9',
        date: '2021-10-09',
        info: [{
          icon: 'A',
          text: '新增成绩查询中绩点曲线功能'
        }, {
          icon: 'F',
          text: '修复成绩查询默认状态学期选择条未自动置为第一学期的bug'
        }, {
          icon: 'F',
          text: '修复成绩查询在以首页进入时无法回退的bug'
        }]
      },
      {
        version: '1.4.8',
        date: '2021-10-04',
        info: [{
          icon: 'A',
          text: '新增「头像挂件」功能'
        }, {
          icon: 'F',
          text: '修复一卡通余额接口获取数据为空时显示NaN的bug'
        }, {
          icon: 'F',
          text: '修复了课程表当日高亮显示消失的bug'
        }]
      }, {
        version: '1.4.7',
        date: '2021-09-28',
        info: [{
          icon: 'A',
          text: '新增右上角提示“添加到我的小程序”'
        }, {
          icon: 'C',
          text: '更换图标CDN'
        }]
      }, {
        version: '1.4.6',
        date: '2021-09-27',
        info: [{
          icon: 'C',
          text: '完善课程表夏令时、冬令时的判断问题'
        }]
      }, {
        version: '1.4.5',
        date: '2021-09-19',
        info: [{
          icon: 'A',
          text: '新增内容模板页面'
        }, {
          icon: 'C',
          text: '调整主页欢迎卡片显示内容（数据来自「單向历」使用OCR提取，如有侵权请告知我们立即下线；）'
        }]
      },
      {
        version: '1.4.4',
        date: '2021-09-19',
        info: [{
          icon: 'A',
          text: '新增空教室查询'
        }, {
          icon: 'C',
          text: '调整课程表当前周为高亮显示'
        }, {
          icon: 'C',
          text: '调整部分组件和UI'
        }]
      }, {
        version: '1.4.3',
        date: '2021-09-11',
        info: [{
            icon: 'A',
            text: '新增绩点查询功能'
          },
          {
            icon: 'A',
            text: '新增“关于账号与密码”页面'
          }, {
            icon: 'F',
            text: '修复退出登录后，移至课程表页面仍然进行加载的BUG。'
          },
        ]
      }, {
        version: '1.4.2',
        date: '2021-09-09',
        info: [{
          icon: 'A',
          text: '新增额外账户成绩查询'
        }]
      }, {
        version: '1.4.1',
        date: '2021-09-09',
        info: [{
          icon: 'F',
          text: '重写课程表全部功能，提升课程表处理性能和稳定性'
        }, {
          icon: 'F',
          text: '修复首页「今日课程」组件时间显示问题'
        }]
      }, {
        version: '1.4.0',
        date: '2021-09-07',
        info: [{
          icon: 'A',
          text: '新增额外账户登陆功能，并适配多账号课程表显示'
        }, {
          icon: 'C',
          text: '开放课程推送功能的使用'
        }, {
          icon: 'F',
          text: '修复首页下半部分高度定位可能出错的问题'
        }]
      }, {
        version: '1.3.2',
        date: '2021-09-06',
        info: [{
          icon: 'F',
          text: '尝试修复第一周时，课程表切换回「我的课表」不显示的Bug'
        }, {
          icon: 'F',
          text: '尝试修复重复获取课程表的Bug'
        }]
      }, {
        version: '1.3.1',
        date: '2021-09-04',
        info: [{
          icon: 'C',
          text: '修改倒数日中「0天」显示为「今天」'
        }, {
          icon: 'C',
          text: '修改一卡通余额显示为四舍五入到两位小数'
        }, {
          icon: 'F',
          text: '修复倒数日无法设置置顶的Bug'
        }]
      }, {
        version: '1.3.0',
        date: '2021-09-04',
        info: [{
          text: '课程推送开放测试，可联系客服参与测试'
        }, {
          icon: 'A',
          text: '完善课程推送相关逻辑（测试功能）'
        }, {
          icon: 'A',
          text: '新增首页一卡通余额显示'
        }, {
          icon: 'A',
          text: '新增添加课程至课程表功能'
        }, {
          icon: 'C',
          text: '修改首页布局'
        }, {
          icon: 'C',
          text: '修改课程表页面布局'
        }, {
          icon: 'F',
          text: '修复课程表授权分享给微信好友取消后依然生成授权二维码的BUG'
        }, {
          icon: 'F',
          text: '修复成绩显示时，选择学期对应成绩为空时的绩点显示'
        }]
      },
      {
        version: '1.2.0',
        date: '2021-09-03',
        info: [{
          icon: 'A',
          text: '新增测试功能课程推送'
        }, {
          icon: 'A',
          text: '新增首页天气标识'
        }, {
          icon: 'A',
          text: '新增考试安排可直接添加到个人倒数日事件中的功能'
        }, {
          icon: 'C',
          text: '修改同一时间多节课的展示方式，并在该情况下可查看多节课详情'
        }, {
          icon: 'C',
          text: '修改课程表加载方式，可显示上级组织添加的课程'
        }, {
          icon: 'C',
          text: '考试安排查询学期变更，修改在本学期暂无考试时以空状态页显示'
        }]
      }, {
        version: '1.1.1',
        date: '2021-08-30',
        info: [{
          icon: 'A',
          text: '新增课程表手动显示周末设置开关'
        }, {
          icon: 'A',
          text: '新增考试安排查询'
        }, {
          icon: 'A',
          text: '新增课程表无课程渲染时为毛玻璃遮罩'
        }, {
          icon: 'C',
          text: '修改课程表显示非本周设置开关位置'
        }, {
          icon: 'F',
          text: '修复课程表显示非本周后课程表渲染问题'
        }]
      }, {
        version: '1.1.0',
        date: '2021-08-27',
        info: [{
          icon: 'C',
          text: '课程表分享新增生成图片分享'
        }, {
          icon: 'C',
          text: '课程表点击详情增加「课程学分」显示'
        }, {
          icon: 'C',
          text: '新增用户点击「退出登陆」时，询问用户是否确认退出登陆'
        }, {
          icon: 'C',
          text: '针对未使用过小程序用户添加他人课程表授权后，在对方授权列表里无法显示头像和昵称的情况，用户在添加授权时需要获得用户头像和昵称'
        }, {
          icon: 'C',
          text: '成绩查询中成绩统计放到页面最底部'
        }, {
          icon: 'F',
          text: '修复课程表授权后无法初始化课程表的bug'
        }, {
          icon: 'F',
          text: '修复周次的计算错误'
        }]
      }, {
        version: '1.0.0',
        date: '2021-07-28',
        info: [{
          text: '首个正式版，更改为微信小程序原生开发的云开发模式，并重新开始策划和编写功能'
        }, {
          icon: 'C',
          text: '修改成绩查询页面，并新增学期成绩统计；修复成绩查询中的绩点显示'
        }, {
          icon: 'A',
          text: '新增课程表功能'
        }, {
          icon: 'A',
          text: '新增底部Tabbar，并将课程表入口放在Tabbar'
        }, {
          icon: 'A',
          text: '新增课程表分享功能，并开发并设计出对应授权机制，需要通过授权查询他人课程表，可以把重要的人授权后的课表可以设置为「Ta的课表」'
        }, {
          icon: 'A',
          text: '新增课程表授权管理，授权者可以撤销已经生效的授权，撤销后被授权者将立即无法查看该授权对应的课表'
        }, {
          icon: 'A',
          text: '新增首页轮播图、图标宫格菜单组件'
        }, {
          icon: 'A',
          text: '新增首页「今日课程」组件，可以在首页直接查看当天课程'
        }, {
          icon: 'A',
          text: '新增本地缓存管理功能，可以清空课程表缓存、删除「Ta的课表」设置、清空全部缓存（必要数据除外）、退出登陆（小程序本地完全初始化）'
        }, {
          icon: 'A',
          text: '新增无课表功能，通过「课程表」数据计算出该学期在某节课第几周无课'
        }, {
          icon: 'A',
          text: '新增倒数日功能，可以添加自定义事件'
        }, {
          icon: 'A',
          text: '新增服务中心页面，主要聚合小程序功能、学校有关信息等'
        }, {
          icon: 'A',
          text: '新增培养计划查询，可以查询到各个专业的课程计划'
        }, {
          icon: 'A',
          text: '重新修订《用户条款》和“关于我们”内容'
        }]
      }, {
        version: '0.0.1',
        date: '2021-07-11',
        info: [{
          text: '预先发布版，使用Uni-app云开发，主要提供成绩查询功能'
        }, {
          icon: 'A',
          text: '新增成绩查询功能'
        }]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})