/*
 * @Descripttion: 用于请求第三方接口
 * @version:
 * @Author:
 */
const axios = require("axios");
const instance = axios.create({
    timeout: 60000,
});

instance.interceptors.response.use(
    function (response: any) {
        return response;
    },
    function (e: any) {
        console.log(e, "ajax错误");
    }
);

instance.interceptors.request.use(
    function (config: any) {
        // Do something before request is sent
        return config;
    },
    function (error: any) {
        // Do something with request error
        return Promise.reject(error);
    }
);

instance.defaults.headers.post["Content-Type"] =
    "application/json;charset=utf-8";

export = instance;
