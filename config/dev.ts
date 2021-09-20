import { ServerConfigInterface } from '../global.interface';

const devConfig: ServerConfigInterface  = {
    server: {
        port: 3000,
    },
    api: {
        baseUrl: '',
        baseUrl2: '',
        baseUrl3: '',
        // 支付宝
        payUrl: ''
    },
    redis: {
        host: 'localhost',
        port: 6379,
        ttl: 7200,
    },
    mysql: {
        database: 'test',
        username: 'root',
        password: '123456',
        host: 'localhost',
        port: 3306,
        pool: {
            max: 20,
            min: 0,
            idle: 10000
        },
        logging: false
    },
    jwt: {
        secret: 'jwt-secret',
        expiresIn: '24h',
        // 用户点击"记住我"后，最长保持登录时间
        maxExpiresIn: '720h',
    },
    apiFilter: [
        // /^\/^(api)+/,
        // /^\/api/,
        // /^\/api\/user\/admin/,
        /^\/public/,
        /^\/css/,
        /^\/img/,
        /^\/img_dist/,
        /^\/js/,
        /^\/api\/role\/add/,
        /^\/api\/user\/admin\/add/,
        /^\/api\/user\/register/,
        /^\/api\/user\/login/,
        /^\/api\/user\/getKey/,
        /^\/page\/auth/,
        /^\/page/,
        /^\/api\/content\/client/,
        /^\/api\/product\/client/,
        /^\/api\/column\/client/,
        /^\/api\/user\/captcha/,
        /^\/api\/user\/levels/,
        /^\/api\/productVersion\/list/,
        /^\/api\/productVersion\/get/,
        /^\/$/
        // /^\/$/
    ],
    file: {
        wwww: '/file_dist',
        local: 'public/file_dist'
    },
    image: {
        wwww: '/img_dist',
        local: 'public/img_dist'
    },
    upload: {
        file: 'public/file_dist'
    },
    https: {
        key: '',
        cert: '',
        port: 443
    },
    // 资源配置, 路径相对于/middleware, 可以使用绝对路径
    resource: {
        context: 'xxx',
        public: 'public'
    },
    // api 权限
    apiKeys: ['增加', '删除', '修改', '查询']
}

export = devConfig;