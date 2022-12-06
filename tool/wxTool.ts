import $http = require("./axios.config");

/**
 * 微信工具
 */

/**
 * @description 接口参数与返回详情更多参考 https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
 * @param params 请求参数
 *
 */
export const getCode2session = (params: any) => {
    let url = "https://api.weixin.qq.com/sns/jscode2session";
    return $http.request({
        url,
        method: "GET",
        params,
    });
};
