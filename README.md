# koa-mysql-typescript-server

> 基于 Typescript, Sequelize 6.x, Koa2 基于token验证的项目

> 示范中的登录加密解密与的前端方面模板搭配请参考 [vue3-typescript-admin](https://github.com/MrChen2016-08-27/vue3-typescript-admin)

* koa2
* typescript
* koa-router
* helmet
* node-rsa
* koa-session-redis
* koa-body
* sequelize
* node-xss
* koa-ratelimit
* koa-jwt

### 部分目录结构说明

* built Typescript 编译后目录
* config (项目配置文件)
    * errorCode.ts (错误码映射列表)
    * dev.ts (开发环境配置)
    * prod.ts (生产环境配置)
* controller (对应路由映射的控制层, 调用dao层)
* dao (使用 orm 对model操作)
* middleware (中间件)
    * authority.ts (权限控制, session过滤api 和 page)
    * base.ts (基本中间件)
    * rest.ts (对于rest api的一些配置与错误处理)
    * router.ts (路由中间件配置)
* model (定义数据库模型)
* public (公共静态文件, js,css,img..静态文件)
* routes (路由，对路由列表的配置，通常对应 controller)
    * api (提供 api 接口)
    * page (提供 需要 seo 的页面 ejs 渲染路由)
* tool (工具)
    * rsa.ts (node-rsa 加密封装)
    * upload (文件上传, 目前已废弃，具体参考 router -> api -> fileupload)
    * token (每隔一段时间定时获取第三方tokens, 在 middleware/base.ts 下取消注释开启)
    * redis
    * redis_tool (快捷操作 redis, promise封装)
* global.interface.ts (全局接口规范声明)

### 启动前配置

* 开发环境确保 config/dev， 生产环境确保 config/prod 的mysql, redis配置与环境正确，修改 jwt 的 secret
* 全局正确安装了 Typescript 的情况下，在项目根目录执行 tsc 进行编译
* 编辑开发文件的 运行和调试 配置文件,例如 vscode:
```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Typescript node",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}\\built\\bin\\www",
            "args": [
                "${relativeFile}"
            ],
            "cwd": "${workspaceRoot}",
            "protocol": "inspector",
        }
    ]
}
```
* 点击编辑器的调试运行图标

> 注意事项
    安全起见，项目 config/prod 中记得修改 mysql 配置 以及 自定义 jwt 的 secret 加密密钥




