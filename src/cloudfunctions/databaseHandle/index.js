// 云函数入口文件
const getParamSet = require("./getParamSet/index")
const getSimilar = require("./getSimilar/index")
const search = require("./search/index")
const searchSchool = require("./searchSchool/index")
// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.type) {
        case "getParamSet":
            return await getParamSet.main(event, context);
        case "getSimilar":
            return await getSimilar.main(event, context);
        case "search":
            return await search.main(event, context)
            case "searchSchool":
                return await searchSchool.main(event, context)
    }
}