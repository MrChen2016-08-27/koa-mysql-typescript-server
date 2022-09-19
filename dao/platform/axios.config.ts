import axios, { AxiosResponse } from "axios";
import config from "../../config";
import ApiError from "../../config/ApiError";


const instance = axios.create({
    baseURL: config.api.baseUrl,
    timeout: 60000,
});

instance.interceptors.response.use(
    function (response: AxiosResponse<any>) {
        return response;
    },
    function (e: any) {
        console.log(e, "第三方平台请求错误");
        if (e.response && e.response.data) {
            throw ApiError(e.response.data.code, e.response.data.message);
        } else {
            throw ApiError(null, "第三方平台请求错误");
        }
    }
);

instance.defaults.headers.post["Content-Type"] = "application/json";

export = instance;
