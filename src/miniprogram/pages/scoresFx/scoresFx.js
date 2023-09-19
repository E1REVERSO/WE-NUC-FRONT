import uCharts from '../../js/ucharts.js';
var _self;
var canvaColumn = null;
var canvaLineA = null;
var canvaCandle = null;
Page({
  data: {
    cWidth: '',
    cHeight: '',
    "LineA": {
        "categories": ["2012", "2013", "2014", "2015", "2016", "2017"],
        "series": [{
          "name": "成交量A",
          "data": [35, 8, 25, 37, 4, 20]
        }, {
          "name": "成交量B",
          "data": [70, 40, 65, 100, 44, 68]
        }, {
          "name": "成交量C",
          "data": [100, 80, 95, 150, 112, 132]
        }]
      },
  },
  onLoad: function () {
    _self=this;
    this.cWidth = wx.getSystemInfoSync().windowWidth;
    this.cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    this.getServerData();
  },
  getServerData: function() {
    let LineA = { categories: [], series: [] };
    //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
    LineA.categories = this.data.LineA.categories;
    LineA.series = this.data.LineA.series;
    let Candle = {categories: [],series: []};
    //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
    // Candle.categories = res.data.data.Candle.categories;
    // Candle.series = res.data.data.Candle.series;
    // _self.showColumn("canvasColumn", Column);
    _self.showLineA("canvasLineA", LineA);

    // wx.request({
    //   url: 'https://www.ucharts.cn/data.json',
    //   data: {

    //   },
    //   success: function (res) {
    //     // console.log(res.data.data)
    //     // let Column = { categories: [], series: [] };
    //     // Column.categories = res.data.data.ColumnB.categories;
    //     // Column.series = res.data.data.ColumnB.series;
    //     // //自定义标签颜色和字体大小
    //     // Column.series[1].textColor = 'red';
    //     // Column.series[1].textSize = 18;

    //     // _self.showCandle("canvasCandle", Candle);
    //   },
    // });
  },
  showLineA(canvasId, chartData) {
    let ctx = wx.createCanvasContext(canvasId, this);
    canvaLineA = new uCharts({
      type: 'line',
      context: ctx,
      fontSize: 11,
      legend: true,
      dataLabel: true,
      dataPointShape: true,
      background: '#FFFFFF',
      pixelRatio: 1,
      categories: chartData.categories,
      series: chartData.series,
      animation: true,
      enableScroll: true,//开启图表拖拽功能
      xAxis: {
        disableGrid: false,
        type: 'grid',
        gridType: 'dash',
        itemCount: 4,
        scrollShow: true,
        scrollAlign: 'left',
        //scrollBackgroundColor:'#F7F7FF',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条背景颜色,默认为 #EFEBEF
        //scrollColor:'#DEE7F7',//可不填写，配合enableScroll图表拖拽功能使用，X轴滚动条颜色,默认为 #A6A6A6
      },
      yAxis: {
        //disabled:true
        gridType: 'dash',
        splitNumber: 8,
        min: 10,
        max: 180,
        formatter: (val) => { return val.toFixed(0) + '元' }//如不写此方法，Y轴刻度默认保留两位小数
      },
      width: _self.cWidth,
      height: _self.cHeight,
      extra: {
        line: {
          type: 'straight'
        }
      },
    });

  },
  touchLineA(e) {
    canvaLineA.scrollStart(e);
  },
  moveLineA(e) {
    canvaLineA.scroll(e);
  },
  touchEndLineA(e) {
    canvaLineA.scrollEnd(e);
    //下面是toolTip事件，如果滚动后不需要显示，可不填写
    canvaLineA.showToolTip(e, {
      formatter: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
 
})
