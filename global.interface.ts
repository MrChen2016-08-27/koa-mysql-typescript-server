/**
 * 接受列表请求的参数规范
 */
export interface ListParamsInterface {
    pageNumber: number;
    pageSize: number;
    keyword: string;
    [prop: string]: any;
}

/**
 * 查询所有数据与行数返回的结果规范
 */
export interface InterfaceFindAllObject {
    rows: any[];
    count: number;
}

// 权限数据规范
export interface AuthorityInterface {
    // 是否拥有所有权限，通常为管理员
    all?: boolean | number | string;
    [authKey: string]: any;
    [authKey: number]: any;
}

// token 中的 user 信息
export interface TokenUserInfo {
    id: number | string;
    userId: number | string;
    username: string;
    avatar: string;
    orgId: string | number;
    orgName: string;
    type: string | number;
    roleIds: number[];
}

// 服务配置文件
export interface ServerConfigInterface {
    server: ServerConfig;
    api: ServerConfigApi;
    redis: ServerConfigRedis;
    mysql: ServerConfigMysql;
    jwt: ServerConfigJwt;
    apiFilter: RegExp[];
    file: ServerConfigFile;
    image: ServerConfigImage;
    upload: ServerConfigUpload;
    https: ServerConfigHttps;
    resource: ServerConfigResource;
    apiKeys: ["增加", "删除", "修改", "查询"];
    domain: string;
    wechats?: ServerWeChatItemConfig[];
}

export interface ServerConfig {
    port: number;
}

interface ServerConfigApi {
    baseUrl: string;
    baseUrl2?: string;
    baseUrl3?: string;
    payUrl?: string;
}

interface ServerConfigRedis {
    host: string;
    port: number;
    ttl: number;
}

interface ServerConfigMysql {
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
    pool?: ServerConfigMysqlPool;
    logging?: boolean;
}

interface ServerConfigMysqlPool {
    max: number;
    min: number;
    idle: number;
}

interface ServerConfigJwt {
    secret: string;
    expiresIn: string | number;
    maxExpiresIn?: string | number;
}

interface ServerConfigFile {
    wwww: string;
    local: string;
}

interface ServerConfigImage {
    wwww: string;
    local: string;
}

interface ServerConfigUpload {
    file: string;
}

interface ServerConfigHttps {
    key: string;
    cert: string;
    port: number;
}

interface ServerConfigResource {
    context: string;
    public: string;
}

// 获取权限过滤的列表参数
export const getAuthListParams = (
    params: ListParamsInterface,
    tokenUserData: TokenUserInfo
) => {
    // 是否是超级管理员,超级管理员可以查看所有用户数据不受限制
    let isAdmin: any = tokenUserData.roleIds.find(
        (roleId: number) => roleId == 1
    );
    if (!isAdmin) {
        // 非超级管理员只能查看自己的数据
        params.userId = tokenUserData.userId;
    }
    return params;
};

interface ServerWeChatItemConfig {
    // 自定义标识，用于辨别选择哪个小程序与服务器对应配置
    id: number;
    // 小程序名称
    name: string;
    // 小程序 appid
    appid: string;
    // 小程序 secret
    secret: string;
}
