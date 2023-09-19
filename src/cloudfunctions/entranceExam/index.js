// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var request = require("request");
var querystring = require("querystring");
var api_host = "https://api.gugudata.com";
var api_path = "/location/college"; // todo: 注意修改请求对应的 API 接口
const rp = require('request-promise');
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const {
        keywords,
        pagesize,
        index
    } = event;
    var data = {
        appkey: 'BJT54QB6WCT6',
        keywords: keywords,
        pagesize: pagesize,
        pageindex: index,
        keywordstrict: 'false',
        collegecategory: ''
    };
    var content = querystring.stringify(data);
    // var options = {
    //     method: "GET",
    //     url: api_host + api_path + "?" + content,
    //     headers: {}
    // };

    let res = await rp({
        uri: api_host + api_path + "?" + content
    })
    let json_array = JSON.parse(res)
    return json_array
    let result = []
    // 发送网络请求
    var requestGuGuData = await request(options, (error, response) => {
        if (error) throw new Error(error);
        console.log(JSON.parse(response.body));
        result = JSON.parse(response.body)
        return result
        requestGuGuData.end();
        // return result;
    });


}