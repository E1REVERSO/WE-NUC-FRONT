const cloud = require('wx-server-sdk')

cloud.init()


var request = require("request");
var querystring = require("querystring");
var api_host = "https://api.gugudata.com";
var api_path = "/location/college"; // todo: 注意修改请求对应的 API 接口
const rp = require('request-promise');

exports.main = async (event, context) => {
    console.log("eee")
    let {
        condition,
        database,
        last
    } = event
    let g = await cloud.database().collection(database).where(condition).skip(last).get()
    g = g.data
    for(;;){
        for(let  i =0;i<g.length;i++){

        }
    }

    let count = await cloud.database().collection(database).where(condition).count()
    return {
        data: g.data,
        index,
        pagesize,
        total: count.total
    }
}


function getSchool(schoolName){
    var data = {
        appkey: 'BJT54QB6WCT6',
        keywords: schoolName,
        pagesize: 1,
        pageindex: 1,
        keywordstrict: 'true',
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

}