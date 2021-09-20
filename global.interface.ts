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
    host:  string;
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
